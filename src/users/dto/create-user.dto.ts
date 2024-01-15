import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
  name: string;
}
