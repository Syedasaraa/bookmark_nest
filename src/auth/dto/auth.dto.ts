import {  IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
  
  @IsBoolean()
  rememberMeChecked!: boolean;
  
  @IsString ()
  role!: string;

  @IsString()
  shop !: string;
}
