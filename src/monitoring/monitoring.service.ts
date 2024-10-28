import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as os from 'os-utils';
import * as netos from 'os';

@Injectable()
export class MonitoringService {
  private prevRxBytes = 0;
  private prevTxBytes = 0;
  private readonly interfaceName: string;

  constructor() {
    this.interfaceName = this.getNetworkInterface();
  }

  private getNetworkInterface(): string {
    const interfaces = netos.networkInterfaces();
    for (const [name, ifaceDetails] of Object.entries(interfaces)) {
      const validInterface = ifaceDetails?.find(
        (iface) => !iface.internal && iface.family === 'IPv4',
      );
      if (validInterface) return name;
    }
    throw new Error('No active network interface found.');
  }

  async getNetworkSpeed() {
    const { rxbytes, txbytes } = await this.getNetworkUsage();
    const downloadSpeed = rxbytes - this.prevRxBytes;
    const uploadSpeed = txbytes - this.prevTxBytes;
    this.prevRxBytes = rxbytes;
    this.prevTxBytes = txbytes;

    return { downloadSpeed, uploadSpeed };
  }

  private getNetworkUsage(): Promise<{ rxbytes: number; txbytes: number }> {
    return new Promise((resolve, reject) => {
      exec('cat /proc/net/dev', (error, stdout) => {
        if (error) return reject(error.message);
        const interfaceLine = stdout
          .split('\n')
          .find((line) => line.includes(this.interfaceName));
        if (!interfaceLine) return reject('Interface not found');
        const [rx, , , , , , , , tx] = interfaceLine
          .trim()
          .split(/\s+/)
          .slice(1);
        resolve({ rxbytes: parseInt(rx, 10), txbytes: parseInt(tx, 10) });
      });
    });
  }

  async getCpuUsage(): Promise<number> {
    return new Promise((resolve) =>
      os.cpuUsage((usage) => resolve(usage * 100)),
    );
  }

  async getDiskPartitions(): Promise<any[]> {
    const command =
      os.platform() === 'win32'
        ? 'wmic logicaldisk get name, size, freespace'
        : 'df -h';
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) return reject(error.message);
        resolve(this.parseDiskPartitions(stdout));
      });
    });
  }

  private parseDiskPartitions(stdout: string) {
    return stdout
      .trim()
      .split('\n')
      .slice(1)
      .map((line) => {
        const [filesystem, size, used, available, usePercentage] =
          line.split(/\s+/);
        return { filesystem, size, used, available, usePercentage };
      });
  }

  async getMemoryUsage() {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = ((totalMemory - freeMemory) / totalMemory) * 100;
    return { usedMemory, totalMemory, freeMemory };
  }
}
