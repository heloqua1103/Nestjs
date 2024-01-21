import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({message: 'name is required'})
    name: string;

    @IsNotEmpty({message: 'Email is required'})
    email: string;

    @IsNotEmpty({message: 'Skill is required'})
    @IsArray({message: 'Skill must be an array'})
    @IsString({ each: true, message: 'Skills must be string' })
    skills: string[];
}
