import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email !: string;

  @IsString()
  @IsNotEmpty()
  password !: string;
  
  @IsBoolean
  rememberMeToken !: boolean;
}
