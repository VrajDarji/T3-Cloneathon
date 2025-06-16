"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  Check,
  Cpu,
  Globe,
  MessageSquare,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Bot,
    title: "Multiple AI Models",
    description:
      "Access GPT-4, Claude, Gemini, and more AI models in one unified interface.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Real-time streaming responses with optimized performance for instant conversations.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "End-to-end encryption ensures your conversations remain private and secure.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share conversations, collaborate with team members, and manage projects together.",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description:
      "Communicate in over 100 languages with native AI model support.",
  },
  {
    icon: Cpu,
    title: "Smart Context",
    description:
      "Advanced context management keeps conversations coherent across long sessions.",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "MultiLLM Chat has revolutionized how our team collaborates with AI. Having access to multiple models in one place is a game-changer.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Software Engineer",
    company: "StartupXYZ",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The interface is incredibly intuitive, and the real-time streaming makes conversations feel natural. Best AI chat platform I've used.",
  },
  {
    name: "Emily Watson",
    role: "Content Creator",
    company: "Creative Studio",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Being able to switch between different AI models for different tasks has improved my productivity by 300%. Absolutely love it!",
  },
];

// const pricingPlans = [
//   {
//     name: "Starter",
//     price: "Free",
//     description: "Perfect for individuals getting started",
//     features: ["100 messages per month", "Access to GPT-3.5", "Basic chat history", "Community support"],
//     popular: false,
//   },
//   {
//     name: "Pro",
//     price: "$19",
//     description: "Best for professionals and small teams",
//     features: [
//       "Unlimited messages",
//       "Access to all AI models",
//       "Advanced chat history",
//       "Priority support",
//       "Team collaboration",
//       "Custom themes",
//     ],
//     popular: true,
//   },
//   {
//     name: "Enterprise",
//     price: "Custom",
//     description: "For large organizations with specific needs",
//     features: [
//       "Everything in Pro",
//       "Custom AI model integration",
//       "Advanced security features",
//       "Dedicated support",
//       "SLA guarantee",
//       "Custom deployment",
//     ],
//     popular: false,
//   },
// ]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LLM Paglu
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </Link>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <Badge className="gradient-primary text-white border-0 shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Now with GPT-4o Support
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-primary to-purple-600 bg-clip-text text-transparent">
            Chat with Multiple AI Models in One Place
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience the power of GPT-4, Claude, Gemini, and more AI models
            through a single, beautiful interface. Switch between models
            seamlessly and get the best response for every query.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6"
              >
                Start Chatting Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-0 hover-lift text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Free tier available
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Powerful Features for Modern AI Conversations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to have productive conversations with AI, all
              in one beautifully designed platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-effect border-0 shadow-md hover:shadow-lg hover-lift transition-all duration-200"
              >
                <CardHeader>
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-purple-50/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Loved by Thousands of Users
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users are saying about their experience with MultiLLM
              Chat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="glass-effect border-0 shadow-md hover:shadow-lg hover-lift transition-all duration-200"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={testimonial.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you. Upgrade or downgrade at any time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`glass-effect border-0 shadow-md hover:shadow-lg hover-lift transition-all duration-200 relative ${
                  plan.popular ? "ring-2 ring-primary shadow-xl" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="gradient-primary text-white border-0 shadow-lg">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {plan.price}
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <span className="text-lg text-muted-foreground">/month</span>
                    )}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "gradient-primary text-white hover:opacity-90 shadow-md hover:shadow-lg"
                        : "glass-effect border-0 hover-lift"
                    } transition-all duration-200`}
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-purple-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Ready to Transform Your AI Conversations?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already experiencing the future of
            AI chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="glass-effect border-0 hover-lift text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8 glass-effect">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  MultiLLM Chat
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                The most powerful AI chat platform that brings together multiple
                language models in one beautiful, easy-to-use interface.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover-lift">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="hover-lift">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LLM Paglu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
