import { IsOptional, IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  server_url: string;

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

