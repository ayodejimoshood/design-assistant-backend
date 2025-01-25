// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async generateWireframe(prompt: string): Promise<string> {
    const response = await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate a wireframe based on this description: ${prompt}`,
      max_tokens: 500,
    });
    return response.data.choices[0].text;
  }
}