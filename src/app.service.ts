import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as os from 'os-utils';
import * as netos from 'os';

@Injectable()
export class AppService {
  private prevRxBytes = 0;
  private prevTxBytes = 0;
  private readonly interfaceName: string;

  constructor() {
    this.interfaceName = this.getNetworkInterface(); // Dynamically set the network interface
  }
  // Dynamically select the first active non-internal network interface
  private getNetworkInterface(): string {
    const networkInterfaces = netos.networkInterfaces();
    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
      const activeInterface = interfaces?.find(
        (iface) => !iface.internal && iface.family === 'IPv4',
      );
      if (activeInterface) {
        console.log(`Using network interface: ${name}`);
        return name;
      }
    }

    // Fallback if no suitable network interface is found
    throw new Error('No active network interface found.');
  }

  private async getNetworkSpeed(): Promise<{
    rxbytes: number;
    txbytes: number;
  }> {
    return new Promise((resolve, reject) => {
      exec('cat /proc/net/dev', (error, stdout) => {
        if (error) {
          return reject(`Error executing command: ${error.message}`);
        }

        const lines = stdout.trim().split('\n');
        for (const line of lines) {
          if (line.includes(this.interfaceName)) {
            const parts = line.trim().split(/\s+/);
            const rxbytes = parseInt(parts[1], 10); // Received bytes
            const txbytes = parseInt(parts[9], 10); // Transmitted bytes
            return resolve({ rxbytes, txbytes });
          }
        }

        reject(`Network interface ${this.interfaceName} not found.`);
      });
    });
  }

  private formatSpeed(bytes: number): { value: string; unit: string } {
    const kbps = bytes / 1024; // Convert to KBps
    if (kbps > 1000) {
      return { value: (kbps / 1024).toFixed(2), unit: 'MBps' }; // Convert to MBps
    }
    return { value: kbps.toFixed(2), unit: 'KBps' }; // Stay in KBps
  }

  public async logNetworkSpeed(): Promise<any> {
    try {
      const { rxbytes, txbytes } = await this.getNetworkSpeed();

      // Calculate the download and upload speed
      const downloadSpeedBytes = rxbytes - this.prevRxBytes;
      const uploadSpeedBytes = txbytes - this.prevTxBytes;

      // Update the previous values for the next calculation
      this.prevRxBytes = rxbytes;
      this.prevTxBytes = txbytes;

      // Format the result
      return {
        downloadSpeed: downloadSpeedBytes,
        uploadSpeed: uploadSpeedBytes,
      };
    } catch (error) {
      console.error('Error logging network speed:', error);
      throw error; // rethrow the error to be handled elsewhere
    }
  }

  getCpuUsage(): Promise<number> {
    return new Promise((resolve) => {
      os.cpuUsage((usage) => {
        resolve(usage * 100); // Convert to percentage
      });
    });
  }

  async getDiskPartitions(): Promise<any[]> {
    const partitions: any[] = [];

    // Use `df` command to get the list of partitions
    const command =
      os.platform() === 'win32'
        ? 'wmic logicaldisk get name, size, freespace'
        : 'df -h';

    return new Promise((resolve, reject) => {
      exec(command, async (error, stdout) => {
        if (error) {
          return reject(`Error executing command: ${error.message}`);
        }

        const lines = stdout.trim().split('\n');

        // For Unix-like systems
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].trim().split(/\s+/);
          if (os.platform() === 'win32') {
            const filesystem = parts[0];
            const size = (parseInt(parts[1], 10) / 1024 ** 3).toFixed(2); // Convert to GB
            const available = (parseInt(parts[2], 10) / 1024 ** 3).toFixed(2); // Convert to GB
            const used =
              (parseInt(parts[1], 10) - parseInt(parts[2], 10)) / 1024 ** 3; // Calculate used in GB
            const usePercentage = `${(((parseInt(parts[1], 10) - parseInt(parts[2], 10)) / parseInt(parts[1], 10)) * 100).toFixed(2)}%)`; // Calculate use percentage

            partitions.push({
              filesystem,
              size,
              used: used.toFixed(2),
              available,
              usePercentage,
            });
          } else {
            const filesystem = parts[0];
            const size = this.convertSizeToGB(parts[1]); // Convert to GB
            const used = this.convertSizeToGB(parts[2]); // Convert to GB
            const available = this.convertSizeToGB(parts[3]); // Convert to GB
            const usePercentage = parts[4]; // Already in human-readable form

            partitions.push({
              filesystem,
              size,
              used,
              available,
              usePercentage,
            });
          }
        }

        resolve(partitions);
      });
    });
  }

  // Helper function to convert human-readable sizes to GB
  private convertSizeToGB(size: string): number {
    const unit = size.slice(-1).toUpperCase(); // Get the last character as unit
    const number = parseFloat(size); // Convert string to float

    switch (unit) {
      case 'G':
        return number; // Already in GB
      case 'M':
        return number / 1024; // Convert MB to GB
      case 'K':
        return number / 1024 ** 2; // Convert KB to GB
      case 'T':
        return number * 1024; // Convert TB to GB
      default:
        return 0; // Unknown unit
    }
  }
  async getMemoryUsage(): Promise<{
    usedMemory: number;
    totalMemory: number;
    freeMemory: number;
  }> {
    return new Promise((resolve) => {
      const totalMemory = os.totalmem(); // Total memory in bytes
      const freeMemory = os.freemem(); // Free memory in bytes
      const usedMemory = ((totalMemory - freeMemory) / totalMemory) * 100; // Used memory in percentage

      resolve({
        usedMemory: Math.round(usedMemory), // Round the percentage
        totalMemory,
        freeMemory,
      });
    });
  }
}
