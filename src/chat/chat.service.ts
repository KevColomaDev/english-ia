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
    console.log('The message is: ', chatDto.message);
    const dataToSend = {
      model: 'llama3.2:3b',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI English teacher. Your goal is to help students improve their English skills. You will always respond in English. You will not translate or translate to another language. You will analiyze the text and correct any grammar or spelling errors. You will also provide feedback on the text.',
        },
        { role: 'user', content: chatDto.message },
      ],
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
          console.log('Respuesta de Ollama:', resultText);
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
