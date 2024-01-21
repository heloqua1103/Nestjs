import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Subcriber } from './schemas/subscriber.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subcriber.name) private subcriberModel: Model<Subcriber>,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const { email, skills, name } = createSubscriberDto;
    const isExist = await this.subcriberModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException('Email is already exist');
    }

    const subscriber = await this.subcriberModel.create({
      email,
      skills,
      name,
      createdBy: { id: user._id, email: user.email },
    });

    return {
      _id: subscriber?._id,
      createdAt: subscriber?.createdAt,
    };
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, projection, population, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.subcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.subcriberModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }
    return await this.subcriberModel.findById(id);
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    const update = await this.subcriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubscriberDto,
        updatedBy: { id: user._id, email: user.email },
      },
      { upsert: true },
    );

    return update;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    await this.subcriberModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
        deletedBy: { id: user._id, email: user.email },
        deletedAt: new Date(),
      },
    );
    return 'Deleted successfully';
  }

  async getSkills(user: IUser) {
    const { email } = user;
    return this.subcriberModel.findOne({ email }, { skills: 1 });
  }
}
