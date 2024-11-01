
import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServerDto, UpdateServerDto } from './dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { randomBytes } from 'crypto';
import path from 'path';
import * as fs from 'fs';
import { CPUinfo } from '@prisma/client';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateServerDto) {
    const userId = await this.prisma.user.findUnique({
      where: { id: +data.user_id },
      select: { id: true },
    });

    if (!userId) {
      throw new Error("User not found");
    }

    const api_key = randomBytes(32).toString('hex');

    let sshKeyPath = null;
    if (data.ssh_key) {
      const fileName = `${Date.now()}-${data.ssh_key.originalname}`;
      const filePath = path.join(process.cwd(), 'ssl', fileName);

      const dir = path.join(process.cwd(), 'ssl');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const fileBuffer = await data.ssh_key.buffer;
      fs.writeFileSync(filePath, fileBuffer);

      sshKeyPath = filePath;
    }

    return this.prisma.server.create({
      data: {
        name: data.name,
        user_id: +userId.id,
        server_url: data.server_url,
        ssh_username: data.ssh_username,
        ssh_password: data.ssh_password,
        ssh_host: data.ssh_host,
        ssh_port: +data.ssh_port,
        ssh_key: sshKeyPath,
        api_key: api_key,
      },
    });
  }
  async getCPUUsage(id: string) {
    try {
      const data = await this.prisma.cPUinfo.findMany({
        where: {
          server_id: id,
        },
      });


      return {
        statusCode: HttpStatus.OK,
        message: "Successfully fetched",
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong while fetching data. Please try again later.");
    }
  }
  async getRAMUsage(id: string) {
    try {
      const data = await this.prisma.rAMinfo.findMany({
        where: {
          server_id: id,
        },
      });


      return {
        statusCode: HttpStatus.OK,
        message: "Successfully fetched",
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong while fetching data. Please try again later.");
    }
  }

  async getNetworkUsage(id: string) {
    try {
      const data = await this.prisma.networkInfo.findMany({
        where: {
          server_id: id,
        },
      });

      // Convert BigInt values to string
      const serializedData = data.map(item => {
        return {
          ...item,
          upload_network_usage: item.upload_network_usage.toString(),
          download_network_usage: item.download_network_usage.toString(),
        };
      });

      return {
        statusCode: HttpStatus.OK,
        message: "Successfully fetched",
        data: serializedData,
      };
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong while fetching data. Please try again later.");
    }
  }
  async findAll() {
    try {
      const servers = await this.prisma.server.findMany();

      const maskedServers = servers.map(server => {
        return {
          ...server,
          ssh_username: server.ssh_username ? `${server.ssh_username.slice(0, 3)}***` : null,
          ssh_password: server.ssh_password ? `${server.ssh_password.slice(0, 3)}***` : null,
        };
      });

      return maskedServers;
    } catch (error) {
      console.error('Error fetching servers:', error);
      throw new Error('Failed to retrieve servers. Please try again later.');
    }
  }

  async findOne(id: string) {
    try {
      const server = await this.prisma.server.findUnique({ where: { id } });
      if (!server) {
        throw new NotFoundException(`Server with id ${id} not found`);
      }
      return server;

    } catch (err) {
      throw new InternalServerErrorException("Something went wrong while updating data Please try again later")
    }
  }

  async update(id: string, data: UpdateServerDto) {
    const server = await this.prisma.server.update({ where: { id }, data });
    if (!server) {
      throw new NotFoundException(`Server with id ${id} not found`);
    }
    return server;
  }

  async remove(id: string) {
    const server = await this.prisma.server.findUnique({ where: { id } });
    if (!server) {
      throw new NotFoundException(`Server with id ${id} not found`);
    }
    return this.prisma.server.delete({ where: { id } });
  }
  async insertCpuLogs(cpuData: any) {
    const data = await this.prisma.cPUinfo.create({
      data: cpuData
    });
    return data;
  }
  async insertRAMLogs(ramData: any) {
    const data = await this.prisma.rAMinfo.create({
      data: ramData
    });
    return data;
  }
  async insertNetworkLogs(networkData: any) {
    const data = await this.prisma.cPUinfo.create({
      data: networkData
    });
    return data;
  }
  async getPreviousCPULog(serverId: string) {
    const data = await this.prisma.cPUinfo.findMany({
      where: {
        server_id: serverId,
        end_time: null,
      },
      orderBy: {
        id: 'desc',
      },

    });
    return data;
  }
  async getRAMLog(serverId: string) {
    const data = await this.prisma.rAMinfo.findMany({
      where: {
        server_id: serverId,
        end_time: null,
      },
      orderBy: {
        id: 'desc',
      },
    });
    return data;
  }
  async getNetworkLog(serverId: string) {
    const data = await this.prisma.networkInfo.findMany({
      where: {
        server_id: serverId,
        end_time: null,
      },
      orderBy: {
        id: 'desc',
      },
    })
    return data;
  }
  async updateCPULogs(id: string) {
    const server = await this.prisma.server.findFirst({
      where: { id },
      select: { id: true },
    });
    if (!server) {
      return;
    }

    const ramInfo = await this.prisma.cPUinfo.findFirst({
      where: { server_id: server.id, end_time: null },
    });
    if (!ramInfo) {
      return;
    }

    const data = await this.prisma.cPUinfo.update({
      where: { id: ramInfo.id },
      data: { end_time: new Date() },
    });
    return data;
  }

  async updateRAMLogs(serverId: string) {
    console.log("called update RAM logs");
    const server = await this.prisma.server.findFirst({
      where: { id: serverId },
      select: { id: true },
    });
    if (!server) {
      return;
    }

    const ramInfo = await this.prisma.rAMinfo.findFirst({
      where: { server_id: server.id, end_time: null },
    });
    if (!ramInfo) {
      return;
    }

    const data = await this.prisma.rAMinfo.update({
      where: { id: ramInfo.id },
      data: { end_time: new Date() },
    });
    return data;
  }
  async updateNetworkLogs(id: string) {
    console.log(id)
    const server = await this.prisma.server.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      }
    })
    if (!server) {
      return;
    }
    const data = await this.prisma.networkInfo.update({
      where: {
        id: server.id
      },
      data: {
        end_time: new Date()
      }
    })
    return data;

  }
}

