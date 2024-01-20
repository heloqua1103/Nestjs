import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsArray, IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateBy {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

class History {
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    updatedAt: Date;

    @ValidateNested()
    @IsNotEmpty()
    @Type(() => UpdateBy)
    updatedBy: UpdateBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @ValidateNested()
    @IsArray({message: 'history must be an array'})
    @IsNotEmpty({message: 'history is required'})
    @Type(() => History)
    history: History[];
}
