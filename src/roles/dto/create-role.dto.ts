import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'description is required',
  })
  description: string;

  @IsNotEmpty({
    message: 'isActive is required',
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  isActive: Boolean;

  @IsNotEmpty({
    message: 'permissions is required',
  })
  @IsArray({ message: 'permissions must be an array' })
  @IsMongoId({ each: true, message: 'permissions must be an array of mongoId' })
  permissions: Array<mongoose.Schema.Types.ObjectId>;
}
