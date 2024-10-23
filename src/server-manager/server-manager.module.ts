import { Module } from '@nestjs/common';
import { ServerManagerService } from './server-manager.service';
import { ServerManagerController } from './server-manager.controller';

@Module({
  controllers: [ServerManagerController],
  providers: [ServerManagerService],
})
export class ServerManagerModule {}
