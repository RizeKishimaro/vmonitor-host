// src/servers/dto/update-server.dto.ts

import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateServerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  user_id?: number;

  @IsOptional()
  @IsString()
  server_url?: string;

  @IsOptional()
  @IsString()
  ssh_username?: string;

  @IsOptional()
  @IsString()
  ssh_password?: string;

  @IsOptional()
  @IsString()
  ssh_key?: string;

}


