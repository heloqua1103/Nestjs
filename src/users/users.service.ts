import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel
      .findOne()
      .where('email')
      .equals(createUserDto.email);
    if (isExist)
      throw new BadRequestException(`Email ${createUserDto.email} is exist`);
    const hashPassword = this.hashPassword(createUserDto.password);
    const result = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return {
      _id: result?._id,
      createdAt: result?.createdAt,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const hashPassword = this.hashPassword(registerUserDto.password);
    const isExist = await this.userModel
      .findOne()
      .where('email')
      .equals(registerUserDto.email);
    if (isExist)
      throw new BadRequestException(`Email ${registerUserDto.email} is exist`);
    const result = await this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: 'USER',
    });
    return result;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population, sort } = aqp(qs);
    delete filter.limit;
    delete filter.page;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .select('-password')
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.findOne({ _id: id }).select('-password');
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }

  isValidPassword(password: string, hashPassword: string) {
    return bcrypt.compareSync(password, hashPassword);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: id },
      {
        ...updateUserDto,
        updatedBy: { _id: user._id, email: user.email },
        updatedAt: new Date(),
      },
    );
  }
  remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: { _id: user._id, email: user.email },
      },
    );
  }
}
