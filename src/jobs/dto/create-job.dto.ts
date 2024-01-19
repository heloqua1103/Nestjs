import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'Skills is required',
  })
  @IsArray({message: 'Skills must be array'})
  @IsString({ each: true, message: 'Skills must be string' })
  skills: Array<string>;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({
    message: 'Salary is required',
  })
  salary: number;

  @IsNotEmpty({
    message: 'Quantity is required',
  })
  quantity: number;

  @IsNotEmpty({
    message: 'Level is required',
  })
  level: string;

  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @IsNotEmpty({
    message: 'StartDate is required',
  })
  @Transform(({ value }) => new Date(value))
  @IsDate({message: 'startDate must be date'})
  startDate: Date;

  @IsNotEmpty({
    message: 'EndDate is required',
  })
  @IsDate({message: 'EndDate must be date'})
  @Transform(({ value }) => new Date(value))
  endDate: Date;
  
  @IsNotEmpty({
    message: 'isActive is required',
  })
  @IsBoolean({message: 'isActive must be boolean'})
  isActive: Boolean;
}
