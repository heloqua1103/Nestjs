import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { JobsService } from 'src/jobs/jobs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber } from 'src/subscribers/schemas/subscriber.schema';
import { Model } from 'mongoose';
import { Job } from 'src/jobs/schemas/job.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,
    @InjectModel(Subcriber.name)
    private subscriberModel: Model<Subcriber>,
    @InjectModel(Job.name)
    private jobsModel: Model<Job>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  @Cron("* 0 0 * * 0")
  async handleTestEmail() {
    const subscribers = await this.subscriberModel.find({});
    for (const subscriber of subscribers) {
      const subsSkills = subscriber.skills;
      const jobWithMatchingSkills = await this.jobsModel
        .find({ skills: { $in: subsSkills } })
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map((item) => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          };
        });
        await this.mailerService.sendMail({
          to: 'hieu1103.dev.work@gmail.com',
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subscriber.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
