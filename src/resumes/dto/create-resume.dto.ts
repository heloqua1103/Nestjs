import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsNotEmpty({
    message: 'email is required',
  })
  email: string;

  @IsNotEmpty({
    message: 'userId is required',
  })
  @IsMongoId({message: 'userId must be a valid ObjectId'})
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'url is required',
  })
  url: string;

  @IsNotEmpty({
    message: 'status is required',
  })
  status: string;

  @IsNotEmpty({
    message: 'companyId is required',
  })
  @IsMongoId({message: 'companyId must be a valid ObjectId'})
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'jobId is required',
  })
  @IsMongoId({message: 'jobId must be a valid ObjectId'})
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({
    message: 'url is required',
  })
  url: string;

  @IsNotEmpty({
    message: 'companyId is required',
  })
  @IsMongoId({message: 'companyId must be a valid ObjectId'})
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({
    message: 'jobId is required',
  })
  @IsMongoId({message: 'jobId must be a valid ObjectId'})
  jobId: mongoose.Schema.Types.ObjectId;
}
