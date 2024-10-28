import { HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as readline from 'readline';
import * as os from 'os';
import * as publicIp from 'public-ip';

interface LogMessageEvent {
  data: string;
}
@Injectable()
export class ServerManagerService {
  private logStream$ = new Subject<LogMessageEvent>();
  constructor() {
    this.watchLogFile();
  }
  private path = '/etc/os-release';
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
  async getOsInfo() {
    const osType = os.type();

    // Get platform (architecture)
    const platform = os.arch();

    // Get CPU information
    const cpus = os.cpus();
    const cpuCoreNames = cpus.map(cpu => cpu.model);

    // Get total RAM in GB
    const totalRam = (os.totalmem() / (1024 ** 3)).toFixed(2);

    // Check if system has SSD or HDD
    function checkStorage() {
      const devices = fs.readdirSync('/sys/block');
      return devices.map(device => {
        const rotational = fs.readFileSync(`/sys/block/${device}/queue/rotational`, 'utf8').trim();
        return {
          device,
          type: rotational === '1' ? 'HDD' : 'SSD',
        };
      });
    }

    // Get internal IP address
    const internalIp = os.networkInterfaces();
    const internalIps = Object.values(internalIp)
      .flat()
      .filter(iface => iface.family === 'IPv4' && !iface.internal)
      .map(iface => iface.address);

    // Get public IP address (async)


    // Get public IP address (async)
    const publicIp = await this.getPublicIp();
    const distro = this.getLinuxDistro() || osType;
    return {
      statusCode: HttpStatus.OK,
      data: {
        distro,
        osType,
        platform,
        cpuCoreNames,
        totalRam,
        internalIps,
        publicIp
      }
    }

  }
  async getPublicIp() {
    try {
      const ip = await publicIp.v4();
      return ip
    } catch (error) {
      console.error('Error fetching public IP:', error);
    }
  }
  getLinuxDistro() {
    try {
      const osRelease = fs.readFileSync(this.path, 'utf8');
      const lines = osRelease.split('\n');
      const nameLine = lines.find(line => line.startsWith('PRETTY_NAME='));
      return nameLine ? nameLine.split('=')[1].replace(/"/g, '') : 'Unknown Linux Distribution';
    } catch (err) {
      console.error('Error reading OS release file:', err);
      return 'Unknown Linux Distribution';
    }
  }
}
