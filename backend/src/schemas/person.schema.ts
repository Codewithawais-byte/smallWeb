import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Person extends Document {
  @Prop({ required: true, unique: true })
  name!: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
