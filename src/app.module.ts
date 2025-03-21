import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { VoiceChatModule } from './voice-chat/voice-chat.module';

@Module({
  imports: [UsersModule, ChatModule, VoiceChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
