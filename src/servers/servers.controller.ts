

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto, UpdateServerDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IsPublic } from 'src/utils/decorators/Public.decorator';


@IsPublic()
@ApiBearerAuth()
@ApiTags("servers")
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) { }

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('ssh_key')) // Specify the field name for the file
  async create(@Body() createServerDto: CreateServerDto, @UploadedFile() file: Express.Multer.File) {
    createServerDto.ssh_key = file;

    const server = await this.serversService.create(createServerDto);
    return {
      message: 'Server created successfully',
      data: server,
    };
  }
  @Get()
  async findAll(@Query("id") id: number) {
    const servers = await this.serversService.findAll(id);
    return {
      message: 'Servers fetched successfully',
      data: servers,
    };
  }
  @Get("insertCpuLog")
  async insertCpuLogs(serverId: string) {
    const servers = await this.serversService.insertCpuLogs(serverId);
    return {
      message: 'Servers fetched successfully',
      data: servers,
    };
  }
  @Get("insertRAMLog")
  async insertRAMLogs(serverId: string) {
    const servers = await this.serversService.insertRAMLogs(serverId);
    return {
      message: 'Servers fetched successfully',
      data: servers,
    };
  }
  @Get("insertNetworkLog")
  async insertNetworkLogs(serverId: string) {
    const servers = await this.serversService.insertNetworkLogs(serverId);
    return {
      message: 'Servers fetched successfully',
      data: servers,
    };
  }
  @Get(":id/getCPULog")
  async getCPULogs(@Param("id") id: string) {
    const servers = await this.serversService.getPreviousCPULog(id);
    return servers;
  }
  @Get(":id/getRAMLog")
  async getRAMLogs(@Param("id") id: string) {
    const servers = await this.serversService.getRAMLog(id);
    return servers;
  }
  @Get(":id/getNetworkLog")
  async getNetworkLogs(@Param("id") id: string) {
    const servers = await this.serversService.getNetworkLog(id);
    return servers;
  }
  @Get(":id/getNetworkUsage")
  async getNetworkUsage(@Param("id") id: string) {
    const data = await this.serversService.getNetworkUsage(id);
    return data
  }
  @Get(":id/getCPUUsage")
  async getCPUUsage(@Param("id") id: string) {
    const data = await this.serversService.getCPUUsage(id);
    return data
  }
  @Get(":id/getRAMUsage")
  async getRAMsage(@Param("id") id: string) {
    const data = await this.serversService.getRAMUsage(id);
    return data
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const server = await this.serversService.findOne(id);
    return {
      message: 'Server fetched successfully',
      data: server,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateServerDto: UpdateServerDto) {
    const server = await this.serversService.update(id, updateServerDto);
    return {
      message: 'Server updated successfully',
      data: server,
    };
  }
  @Put(':id/updateCPULog')
  async updateCPULogs(@Param('id') id: string) {
    const server = await this.serversService.updateCPULogs(id);
    return {
      message: 'Server updated successfully',
      data: server,
    };
  }

  @Put(":id/updateRAMLog")
  async updateRAMLogs(@Param("id") id: string) {
    const server = await this.serversService.updateRAMLogs(id);
    return {
      message: 'Server updated successfully',
      data: server,
    };

  }
  @Put(":id/updateNetworkLog")
  async updateNetworkLogs(@Param("id") id: string) {
    const server = await this.serversService.updateNetworkLogs(id);
    return {
      message: 'Server updated successfully',
      data: server,
    };

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.serversService.remove(id);
    return {
      message: 'Server deleted successfully',
    };
  }

}

