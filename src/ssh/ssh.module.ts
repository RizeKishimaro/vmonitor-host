import { Module } from '@nestjs/common';
import { SshService } from './ssh.service';
import { SshGateway } from './ssh.gateway';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Module({
  providers: [SshGateway, SshService, PrismaService],
})
export class SshModule { }
