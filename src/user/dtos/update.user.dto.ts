import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string
}
