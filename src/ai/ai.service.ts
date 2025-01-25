// this is the logic for OpenAI
// import { Injectable } from '@nestjs/common';
// import { Configuration, OpenAIApi } from 'openai';

// @Injectable()
// export class AiService {
//   private openai: OpenAIApi;

//   constructor() {
//     const configuration = new Configuration({
//       apiKey: process.env.OPENAI_API_KEY,
//     });
//     this.openai = new OpenAIApi(configuration);
//   }

//   async generateWireframe(prompt: string): Promise<string> {
//     const response = await this.openai.createCompletion({
//       model: 'text-davinci-003',
//       prompt: `Generate a wireframe based on this description: ${prompt}`,
//       max_tokens: 500,
//     });
//     return response.data.choices[0].text;
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AiService {
  private hfClient: HfInference;

  constructor(private configService: ConfigService) {
    this.hfClient = new HfInference(this.configService.get<string>('HUGGINGFACE_API_KEY'));
  }

  async generateWireframe(prompt: string): Promise<any> {
    try {
      const response = await this.hfClient.textToImage({
        model: 'CompVis/stable-diffusion-v1-4', // Example model
        inputs: prompt,
      });
      return response;
    } catch (error) {
      throw new Error(`Hugging Face API Error: ${error.message}`);
    }
  }
}
