import { Injectable } from '@nestjs/common';
import { ChatDto } from './chat.dto';
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
  private chatHistory: Record<string, { role: string; content: string }[]> = {};

  findAll() {
    return Object.keys(this.chatHistory).map((userId) => ({
      userId,
      history: this.chatHistory[userId],
    }));
  }

  async chat(chatDto: ChatDto) {
    const userId: string =
      typeof chatDto.userId === 'string' ? chatDto.userId : 'default'; // Identificador del usuario
    if (!this.chatHistory[userId]) {
      this.chatHistory[userId] = [
        {
          role: 'system',
          content:
            'You are an AI English teacher. Your goal is to help students improve their English skills. You will always respond in English. You will not translate to another language. You will analyze the text and correct any grammar or spelling errors. You will also provide feedback on the text. Keep track of the conversation and give responses based on past messages.',
        },
      ];
    }

    // Agregar el mensaje del usuario al historial
    this.chatHistory[userId].push({ role: 'user', content: chatDto.message });

    // Limitar el historial a los últimos 10 mensajes para evitar sobrecarga
    if (this.chatHistory[userId].length > 10) {
      this.chatHistory[userId] = this.chatHistory[userId].slice(-10);
    }

    const ollama_url = 'http://localhost:11434/api/chat';
    try {
      const response = await axios.post<Readable>(
        ollama_url,
        {
          model: 'llama3.2:3b',
          messages: this.chatHistory[userId],
        },
        {
          responseType: 'stream',
        },
      );

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

          // Agregar la respuesta de la IA al historial
          this.chatHistory[userId].push({
            role: 'assistant',
            content: resultText,
          });

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
