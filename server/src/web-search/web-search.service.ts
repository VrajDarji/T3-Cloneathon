import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
@Injectable()
export class WebSearchService {
  private readonly logger = new Logger(WebSearchService.name);

  //   Add websearch from google and bing
  // bind the responses send to llm for summary

  async searchDuckDuckGo(query: string) {
    try {
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const { data } = await axios.get(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36',
        },
      });

      const $ = cheerio.load(data);
      const results: string[] = [];

      $('a.result__snippet').each((i, el) => {
        const title = $(el).text();
        const href = $(el).attr('href');
        if (title && href) results.push(`${title} - ${href}`);
      });
      return results.slice(0, 5);
    } catch (error) {
      this.logger.error('Web search failed', error);
      return [];
    }
  }
}
