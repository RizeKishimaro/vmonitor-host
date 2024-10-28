import { IsNotEmpty } from "class-validator"

export default class LoginDto {
  @IsNotEmpty()
  email: string
  @IsNotEmpty()
  password: string
}
