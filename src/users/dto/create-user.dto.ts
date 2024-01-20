import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Age is required',
  })
  age: number;

  @IsNotEmpty({
    message: 'Gender is required',
  })
  gender: string;

  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;

  @IsNotEmpty({
    message: 'Role is required',
  })
  @IsMongoId({message: 'Role is invalid'})
  role: mongoose.Schema.Types.ObjectId;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Age is required',
  })
  age: number;

  @IsNotEmpty({
    message: 'Gender is required',
  })
  gender: string;

  @IsNotEmpty({
    message: 'Address is required',
  })
  address: string;
}
