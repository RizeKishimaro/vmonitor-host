
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateServerDto, UpdateServerDto } from './dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ServersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: CreateServerDto) {
    const userId = await this.prisma.user.findUnique({
      where: { id: data.user_id },
      select: { id: true }
    });

    if (!userId) {
      throw new Error("User not found");
    }
    const api_key = randomBytes(32).toString('hex');

    return this.prisma.server.create({
      data: {
        name: data.name,
        user_id: userId.id,
        server_url: data.server_url,
        ssh_username: data.ssh_username,
        ssh_password: data.ssh_password,
        ssh_key: data.ssh_key,
        api_key: api_key,
      }
    });
  }

  async findAll() {
    return this.prisma.server.findMany();
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
}

