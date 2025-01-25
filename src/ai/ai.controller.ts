import { Controller, Post, Body, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateWireframeDto } from './dto/generate-wireframe.dto';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private aiService: AiService) {}

  @Post('wireframe')
  async generateWireframe(@Body() generateWireframeDto: GenerateWireframeDto) {
    try {
      const result = await this.aiService.generateWireframe(generateWireframeDto.prompt);
      this.logger.log('Service response:', result);

      if (!result) {
        throw new HttpException(
          'No response received from service',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return result;
    } catch (error) {
      this.logger.error('Controller error:', error);
      throw new HttpException(
        error.message || 'Failed to generate wireframe',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}