import { Controller, Get, Query, Sse } from '@nestjs/common';
import { ServerManagerService } from './server-manager.service';
import { interval, map, Observable } from 'rxjs';
import { ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { IsPublic } from 'src/utils/decorators/Public.decorator';

interface LogMessageEvent {
  data: string;
}
@ApiSecurity("X-API-KEY")
@IsPublic()
@ApiBearerAuth()
@Controller('server-manager')
export class ServerManagerController {
  constructor(private readonly serverManagerService: ServerManagerService) { }
  @Sse('status')
  sendServerStatus(@Query("id") id: string): Observable<any> {
    return new Observable((observer) => {
      const serverStatusInterval = setInterval(async () => {
        const { status, responseCode } = await this.serverManagerService.checkServerStatus(id);

        const timestamp = new Date().toLocaleString(); // Current timestamp

        observer.next({
          data: {
            timestamp,
            status,
            responseCode,
          },
        });
      }, 25000);

      // Clear the interval when the observable is complete
      return () => clearInterval(serverStatusInterval);
    });
  }
  @Sse('nginx')
  sendLogs(): Observable<Partial<MessageEvent>> {
    return this.serverManagerService.streamLogs();
  }
  @Get("os-info")
  getOsInfo() {
    return this.serverManagerService.getOsInfo();
  }
  @Get("get-first-server")
  getFirstServer(@Query("id") id: number) {
    return this.serverManagerService.getFirstServer(id);
  }
}
