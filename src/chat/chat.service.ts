import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import axios from 'axios';
import { Readable } from 'stream';

interface ChunkResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

@Injectable()
export class ChatService {
  findAll() {
    return `This action returns all chat`;
  }

  async chat(chatDto: ChatDto) {
    const ollama_url = 'http://localhost:11434/api/chat';
    const dataToSend = {
      model: 'llama3.2:1b',
      messages: [{ role: 'user', content: chatDto.message }],
    };
    try {
      const response = await axios.post<Readable>(ollama_url, dataToSend, {
        responseType: 'stream',
      });
      let resultText = '';
      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          const data = JSON.parse(chunk.toString()) as ChunkResponse;
          if (data.message?.content) {
            resultText += data.message.content;
          }
        });
        response.data.on('end', () => {
          resolve(resultText);
        });
        response.data.on('error', (error: Error) => {
          reject(new Error(error.message));
        });
      });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate response');
    }
  }
}
