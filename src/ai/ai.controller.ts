import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('wireframe')
  async generateWireframe(@Body('prompt') prompt: string) {
    return this.aiService.generateWireframe(prompt);
  }
}