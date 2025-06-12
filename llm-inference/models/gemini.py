from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from datetime import datetime
import json
import uuid
import os
from typing import List, Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class GeminiLLMServer:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.api_key = api_key
        self.available_models = self.get_available_models()
        self.active_sessions = {}
        
    def get_available_models(self):
        """Get all available models for the API key"""
        try:
            models = []
            for model in genai.list_models():
                if 'generateContent' in model.supported_generation_methods:
                    models.append({
                        'id': model.name,
                        'name': model.display_name,
                        'description': getattr(model, 'description', 'No description available'),
                        'input_token_limit': getattr(model, 'input_token_limit', 'Unknown'),
                        'output_token_limit': getattr(model, 'output_token_limit', 'Unknown')
                    })
            return models
        except Exception as e:
            logger.error(f"Error fetching models: {e}")
            return []
    
    def create_model_instance(self, model_name: str, temperature: float = 0.7, max_tokens: int = 2048):
        """Create a model instance with specific configuration"""
        try:
            model = genai.GenerativeModel(
                model_name,
                generation_config={
                    "temperature": temperature,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": max_tokens,
                }
            )
            return model
        except Exception as e:
            logger.error(f"Error creating model instance: {e}")
            return None
    
    def create_chat_session(self, model_name: str, session_config: dict = None):
        """Create a new chat session"""
        session_id = str(uuid.uuid4())
        
        config = session_config or {}
        temperature = config.get('temperature', 0.7)
        max_tokens = config.get('max_tokens', 2048)
        
        model = self.create_model_instance(model_name, temperature, max_tokens)
        if not model:
            return None
            
        chat = model.start_chat(history=[])
        
        self.active_sessions[session_id] = {
            'id': session_id,
            'model_name': model_name,
            'chat': chat,
            'model': model,
            'history': [],
            'created_at': datetime.now().isoformat(),
            'config': config,
            'message_count': 0
        }
        
        return session_id
    
    def send_message(self, session_id: str, message: str):
        """Send a message to a specific session"""
        if session_id not in self.active_sessions:
            return {"error": "Session not found", "status": "error"}
        
        session = self.active_sessions[session_id]
        
        try:
            response = session['chat'].send_message(message)
            
            # Store the conversation
            conversation_record = {
                'user_message': message,
                'ai_response': response.text,
                'timestamp': datetime.now().isoformat(),
                'model_used': session['model_name']
            }
            
            session['history'].append(conversation_record)
            session['message_count'] += 1
            
            return {
                "response": response.text,
                "status": "success",
                "session_id": session_id,
                "message_count": session['message_count']
            }
            
        except Exception as e:
            error_msg = f"Error processing message: {str(e)}"
            logger.error(error_msg)
            return {"error": error_msg, "status": "error"}
    
    def get_session_info(self, session_id: str):
        """Get information about a session"""
        if session_id not in self.active_sessions:
            return {"error": "Session not found", "status": "error"}
        
        session = self.active_sessions[session_id]
        return {
            "session_id": session_id,
            "model_name": session['model_name'],
            "created_at": session['created_at'],
            "message_count": session['message_count'],
            "config": session['config'],
            "status": "success"
        }
    
    def get_session_history(self, session_id: str, limit: int = 50):
        """Get conversation history for a session"""
        if session_id not in self.active_sessions:
            return {"error": "Session not found", "status": "error"}
        
        session = self.active_sessions[session_id]
        history = session['history'][-limit:] if limit else session['history']
        
        return {
            "history": history,
            "total_messages": len(session['history']),
            "status": "success"
        }
    
    def delete_session(self, session_id: str):
        """Delete a chat session"""
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
            return {"message": "Session deleted successfully", "status": "success"}
        return {"error": "Session not found", "status": "error"}

# Initialize LLM Server
API_KEY = os.getenv('GEMINI_API_KEY', 'your-api')
llm_server = GeminiLLMServer(API_KEY)

# Routes

@app.route('/')
def index():
    """Serve the main UI"""
    return render_template('index.html')

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get available models"""
    try:
        models = llm_server.available_models
        return jsonify({
            "models": models,
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/create', methods=['POST'])
def create_chat():
    """Create a new chat session"""
    try:
        data = request.get_json()
        model_name = data.get('model_name', 'gemini-pro')
        config = data.get('config', {})
        
        session_id = llm_server.create_chat_session(model_name, config)
        
        if session_id:
            return jsonify({
                "session_id": session_id,
                "model_name": model_name,
                "status": "success"
            })
        else:
            return jsonify({
                "error": "Failed to create chat session",
                "status": "error"
            }), 500
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/send', methods=['POST'])
def send_message():
    """Send a message to a chat session"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        message = data.get('message')
        
        if not session_id or not message:
            return jsonify({
                "error": "session_id and message are required",
                "status": "error"
            }), 400
        
        result = llm_server.send_message(session_id, message)
        
        if result.get('status') == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/session/<session_id>', methods=['GET'])
def get_session(session_id):
    """Get session information"""
    try:
        result = llm_server.get_session_info(session_id)
        
        if result.get('status') == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Get chat history for a session"""
    try:
        limit = request.args.get('limit', 50, type=int)
        result = llm_server.get_session_history(session_id, limit)
        
        if result.get('status') == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/session/<session_id>', methods=['DELETE'])
def delete_session(session_id):
    """Delete a chat session"""
    try:
        result = llm_server.delete_session(session_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/chat/sessions', methods=['GET'])
def list_sessions():
    """List all active sessions"""
    try:
        sessions = []
        for session_id, session_data in llm_server.active_sessions.items():
            sessions.append({
                'session_id': session_id,
                'model_name': session_data['model_name'],
                'created_at': session_data['created_at'],
                'message_count': session_data['message_count']
            })
        
        return jsonify({
            "sessions": sessions,
            "total": len(sessions),
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_sessions": len(llm_server.active_sessions),
        "available_models": len(llm_server.available_models)
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Endpoint not found",
        "status": "error"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        "error": "Internal server error",
        "status": "error"
    }), 500

if __name__ == '__main__':
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 8000)),
        debug=os.getenv('DEBUG', 'False').lower() == 'true'
    )
