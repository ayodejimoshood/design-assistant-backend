import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

// Add Blob type definition for Node.js environment
declare global {
  namespace NodeJS {
    interface Global {
      Blob: {
        new (parts: any[], options?: { type?: string; endings?: 'transparent' | 'native'; }): Blob;
        prototype: Blob;
      };
    }
  }
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly hf: HfInference;

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async generateWireframe(prompt: string): Promise<any> {
    try {
      this.logger.log(`Generating wireframe for prompt: ${prompt}`);

      const response = await this.hf.textToImage({
        model: "stabilityai/stable-diffusion-2-1-base",
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, bad quality, low quality",
          num_inference_steps: 35,
          guidance_scale: 8.0,
          width: 512,
          height: 512
        }
      });

      this.logger.log('Response:', {
        type: typeof response,
        isObject: response !== null && typeof response === 'object',
        hasArrayBuffer: typeof response === 'object' && 'arrayBuffer' in response,
        properties: Object.keys(response as object)
      });

      // Try to access the raw data
      if ('arrayBuffer' in response) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return {
          success: true,
          image: buffer.toString('base64'),
          format: 'base64'
        };
      }

      // If we can't get the data directly, return what we got for debugging
      return {
        success: false,
        debug: {
          type: typeof response,
          constructor: (response as any)?.constructor?.name,
          keys: Object.keys(response as object),
          methods: Object.getOwnPropertyNames(Object.getPrototypeOf(response as object))
        }
      };

    } catch (error) {
      this.logger.error('Error details:', error);
      throw error;
    }
  }
}