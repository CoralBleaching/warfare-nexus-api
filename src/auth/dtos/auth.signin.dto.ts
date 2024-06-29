import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AuthSignInDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
  email?: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string
}
