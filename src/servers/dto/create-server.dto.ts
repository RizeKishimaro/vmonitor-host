
import { IsNotEmpty, IsNumber, IsNumberString, IsString } from 'class-validator';

export class CreateServerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumberString()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  server_url: string;
  @IsNotEmpty()
  @IsString()
  ssh_host: string;

  @IsNotEmpty()
  @IsNumberString()
  ssh_port: number;


  @IsString()
  ssh_username?: string;

  @IsString()
  ssh_password?: string;

  ssh_key?: Express.Multer.File;
}

