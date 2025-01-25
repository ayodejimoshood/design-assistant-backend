import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateWireframeDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
} 