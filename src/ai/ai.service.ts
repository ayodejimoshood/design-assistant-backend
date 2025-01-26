import { Injectable, Logger } from '@nestjs/common';
import { HfInference } from '@huggingface/inference';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly hf: HfInference;
  
  // Standard mobile viewport dimensions
  private readonly MOBILE_WIDTH = 375;  // iPhone viewport width
  private readonly MOBILE_HEIGHT = 812; // iPhone viewport height

  constructor() {
    // Initialize the Hugging Face Inference client
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }

  async generateWireframe(prompt: string): Promise<any> {
    try {
      // Enhance prompt to specifically request wireframe-style UI
      const enhancedPrompt = `Create a minimal, black and white mobile app wireframe UI design with basic shapes and elements: ${prompt}. Use only simple geometric shapes, lines, and placeholder elements. No colors, no detailed graphics, just wireframe elements like boxes, lines, and basic icons. Make it look like a low-fidelity prototype or sketch.`;

      const response = await this.hf.textToImage({
        model: "stabilityai/stable-diffusion-2-1-base",
        inputs: enhancedPrompt,
        parameters: {
          negative_prompt: "color, gradient, realistic, detailed, photograph, 3d, shading, texture, colorful, high fidelity, rich colors, blurry, photo-realistic",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: this.MOBILE_WIDTH,
          height: this.MOBILE_HEIGHT,
          seed: Math.floor(Math.random() * 1000000), // Random seed for consistency
        }
      });

      if (response instanceof Uint8Array) {
        return {
          success: true,
          image: Buffer.from(response).toString('base64'),
          format: 'base64'
        };
      }

      throw new Error('Invalid response format from image generation');

    } catch (error) {
      this.logger.error('Error generating wireframe:', error);
      throw error;
    }
  }
}