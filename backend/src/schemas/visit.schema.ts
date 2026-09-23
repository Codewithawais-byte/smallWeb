import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type VisitVia =
  | "typed"
  | "link"
  | "back"
  | "forward"
  | "history"
  | "search"
  | "publish";

// A Visit is the atomic fact history is built from. It is written
// even for addresses that don't resolve to a site dead links still
// belong in history we did try to go there.
@Schema()
export class Visit extends Document {
  @Prop({ type: Types.ObjectId, ref: "Person", required: true, index: true })
  personId!: Types.ObjectId;

  @Prop({ required: true, lowercase: true, trim: true })
  address!: string;

  @Prop({ type: Types.ObjectId, ref: "Site", default: null })
  resolvedSiteId!: Types.ObjectId | null;

  @Prop({
    required: true,
    enum: ["typed", "link", "back", "forward", "history", "search", "publish"],
  })
  via!: VisitVia;

  @Prop({ required: true, default: () => new Date() })
  at!: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);
VisitSchema.index({ personId: 1, at: -1 });
