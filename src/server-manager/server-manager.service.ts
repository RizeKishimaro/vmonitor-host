import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as readline from 'readline';

interface LogMessageEvent {
  data: string;
}
@Injectable()
export class ServerManagerService {
  private logStream$ = new Subject<LogMessageEvent>();
  constructor() {
    this.watchLogFile();
  }
  private watchLogFile() {
    const logFilePath = '/var/log/nginx/access.log'; // Update this to your Nginx log file path


    // Watch the file and listen for new lines
    fs.watchFile(logFilePath, { interval: 1000 }, (curr, prev) => {
      if (curr.size > prev.size) {
        const stream = fs.createReadStream(logFilePath, { start: prev.size });
        const rl = readline.createInterface({
          input: stream,
          output: process.stdout,
          terminal: false,
        });

        rl.on('line', (line) => {
          this.logStream$.next({ data: line });
        });
      }
    });
  }
  streamLogs(): Observable<LogMessageEvent> {
    return this.logStream$.asObservable();
  }
  async checkGoogleStatus(): Promise<any> {
    try {
      const response = await axios.get('http://localhost', {
        timeout: 20000,
        insecureHTTPParser: true,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Bypass SSL verification
        }),
      });

      // Return both status and response code
      if (response.status === 200) {
        return { status: 'Alive', responseCode: response.status };
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        if (error.response.status === 502) {
          return { status: 'Down', responseCode: 502 }; // 502 Bad Gateway
        } else if (error.response.status === 403) {
          return { status: 'Under Maintenance', responseCode: 403 }; // 403 Forbidden
        } else {
          return { status: 'Down', responseCode: error.response.status }; // Other error statuses
        }
      } else {
        return { status: 'Down', responseCode: undefined }; // Network or other issues
      }
    }
  }
}
