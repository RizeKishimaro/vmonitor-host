import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerManagerModule } from './server-manager/server-manager.module';
import { SshModule } from './ssh/ssh.module';

@Module({
  imports: [ServerManagerModule, SshModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
