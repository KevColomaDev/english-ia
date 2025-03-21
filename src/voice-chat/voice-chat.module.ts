import { Module } from '@nestjs/common';
import { VoiceChatController } from './voice-chat.controller';
import { VoiceChatService } from './voice-chat.service';

@Module({
  controllers: [VoiceChatController],
  providers: [VoiceChatService],
})
export class VoiceChatModule {}
