

import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode } from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto, UpdateServerDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags("servers")
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) { }

  @Post()
  @HttpCode(201)
  async create(@Body() createServerDto: CreateServerDto) {
    const server = await this.serversService.create(createServerDto);
    return {
      message: 'Server created successfully',
      data: server,
    };
  }

  @Get()
  async findAll() {
    const servers = await this.serversService.findAll();
    return {
      message: 'Servers fetched successfully',
      data: servers,
    };
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

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.serversService.remove(id);
    return {
      message: 'Server deleted successfully',
    };
  }
}

