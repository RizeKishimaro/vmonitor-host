import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServerManagerModule } from './server-manager/server-manager.module';
import { SshModule } from './ssh/ssh.module';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LetMeInGuard } from './utils/guards/LetMeIn.guard';
import { ServersModule } from './servers/servers.module';
import { PrismaService } from './utils/prisma/prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ServerManagerModule,
    SshModule,
    LoginModule,
    ServersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LetMeInGuard,
    },
    PrismaService
  ],
})
export class AppModule { }
