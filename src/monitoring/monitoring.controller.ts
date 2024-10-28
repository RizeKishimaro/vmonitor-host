import { Controller, Sse, Get } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('disk-partitions')
  async getDiskPartitions() {
    const partitions = await this.monitoringService.getDiskPartitions();
    return partitions.map(
      ({ filesystem, size, used, available, usePercentage }) => ({
        filesystem,
        size,
        used,
        available,
        usePercentage,
      }),
    );
  }

  @Sse('ram-usage')
  sendRamUsage(): Observable<any> {
    return interval(3000).pipe(
      map(async () => {
        const { usedMemory, totalMemory, freeMemory } =
          await this.monitoringService.getMemoryUsage();
        const timestamp = new Date().toISOString();
        return { data: { timestamp, usedMemory, totalMemory, freeMemory } };
      }),
    );
  }

  @Sse('network-speed')
  sendNetworkSpeed(): Observable<any> {
    return interval(3000).pipe(
      map(async () => {
        const networkData = await this.monitoringService.getNetworkSpeed();
        const timestamp = new Date().toISOString();
        return { data: { timestamp, ...networkData } };
      }),
    );
  }

  @Sse('cpu-usage')
  sendCpuUsage(): Observable<any> {
    return interval(3000).pipe(
      map(async () => {
        const usage = await this.monitoringService.getCpuUsage();
        const timestamp = new Date().toISOString();
        return { data: { timestamp, usage } };
      }),
    );
  }
}
