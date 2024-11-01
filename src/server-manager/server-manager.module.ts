import { Module } from '@nestjs/common';
import { ServerManagerService } from './server-manager.service';
import { ServerManagerController } from './server-manager.controller';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Module({
  controllers: [ServerManagerController],
  providers: [ServerManagerService, PrismaService],
})
export class ServerManagerModule { }
