import { Controller, Post, Body, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateWireframeDto } from './dto/generate-wireframe.dto';
import { WireframeResponse } from './interfaces/wireframe-response.interface';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private aiService: AiService) {}

  @Post('wireframe')
  async generateWireframe(@Body() generateWireframeDto: GenerateWireframeDto): Promise<WireframeResponse> {
    try {
      const result = await this.aiService.generateWireframe(generateWireframeDto.prompt);
      return {
        ...result,
        dimensions: {
          width: 375,
          height: 812
        }
      };
    } catch (error) {
      this.logger.error('Failed to generate wireframe:', error);
      throw error;
    }
  }
}