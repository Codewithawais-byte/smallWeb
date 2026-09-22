import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person } from '../schemas/person.schema';

@Injectable()
export class PeopleService {
  constructor(@InjectModel(Person.name) private personModel: Model<Person>) {}

  findAll() {
    return this.personModel.find().sort({ name: 1 });
  }
}
