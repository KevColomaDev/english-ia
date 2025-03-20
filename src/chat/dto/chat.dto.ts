import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({
    description: 'The message of the chat',
    example: 'Hello, how are you?',
  })
  @IsNotEmpty({ message: 'Message is required' })
  @IsString({ message: 'Message must be a string' })
  readonly message: string;

  @ApiProperty({
    description: 'The user id of the chat',
    example: '123',
  })
  @IsNotEmpty({ message: 'User id is required' })
  @IsString({ message: 'User id must be a string' })
  readonly userId: string;
}
