import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});

      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
      }

      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin is full permission',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'User is normal permission',
            isActive: true,
            permissions: [],
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            name: 'admin',
            email: 'admin@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 20,
            gender: 'MALE',
            address: 'HCM',
            role: adminRole?._id,
          },
          {
            name: 'Nguyen Trung Hieu',
            email: 'nguyenhieu11032002@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 21,
            gender: 'MALE',
            address: 'HCM',
            role: adminRole?._id,
          },
          {
            name: 'user',
            email: 'user@gmail.com',
            password: this.userService.hashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 30,
            gender: 'FEMALE',
            address: 'DN',
            role: userRole?._id,
          },
        ]);
      }

      if(countUser > 0 && countPermission > 0 && countRole > 0) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...')
      }
    }
  }
}
