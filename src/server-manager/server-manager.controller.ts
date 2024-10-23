import { Controller, Sse } from '@nestjs/common';
import { ServerManagerService } from './server-manager.service';
import { interval, map, Observable } from 'rxjs';

interface LogMessageEvent {
  data: string;
}
@Controller('server-manager')
export class ServerManagerController {
  constructor(private readonly serverManagerService: ServerManagerService) { }
  @Sse('status')
  sendGoogleStatus(): Observable<any> {
    return new Observable((observer) => {
      // Emit Google status every 3 seconds
      const googleStatusInterval = setInterval(async () => {
        const { status, responseCode } = await this.serverManagerService.checkGoogleStatus();
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
      return () => clearInterval(googleStatusInterval);
    });
  }
  @Sse('nginx')
  sendLogs(): Observable<Partial<MessageEvent>> {
    return this.serverManagerService.streamLogs();
  }
}
