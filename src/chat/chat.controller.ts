import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  findAll() {
    return this.chatService.findAll();
  }
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  chat(@Body() chatDto: ChatDto) {
    return this.chatService.chat(chatDto);
  }
}
