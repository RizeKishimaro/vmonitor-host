import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerManagerModule } from './server-manager/server-manager.module';
import { SshModule } from './ssh/ssh.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [ServerManagerModule, SshModule, MonitoringModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
