import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Site extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  address!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ type: Types.ObjectId, ref: "Person", required: true })
  authorId!: Types.ObjectId;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Full-text search across title + body
// search by what is written in the page, not just the title work.
SiteSchema.index({ title: "text", body: "text" });
