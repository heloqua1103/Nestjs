import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcriber, SubcriberSchema } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { JobsService } from 'src/jobs/jobs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subcriber.name, schema: SubcriberSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('HOST_EMAIL'),
          secure: false,
          auth: {
            user: configService.get<string>('SENDER_EMAIL'),
            pass: configService.get<string>('PASSWORD_EMAIL'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview:
          configService.get<string>('PREVIEW_EMAIL') === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService, SubscribersService, JobsService],
})
export class MailModule {}
