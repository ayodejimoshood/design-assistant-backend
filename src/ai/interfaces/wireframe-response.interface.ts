export interface WireframeResponse {
  success: boolean;
  image: string;
  format: 'base64';
  dimensions?: {
    width: number;
    height: number;
  };
} 