import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Site extends Document {
  // The only thing typed into the address bar, and the only thing
  // a site author can point at. Lowercased + trimmed on write so
  // lookups are consistent.
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  address!: string;

  @Prop({ required: true })
  title!: string;

  // Sanitized HTML — never trust this at render time either;
  // sanitize on write AND treat as untrusted on read (defense in depth).
  @Prop({ required: true })
  body!: string;

  @Prop({ type: Types.ObjectId, ref: "Person", required: true })
  authorId!: Types.ObjectId;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Full-text search across title + body — this is what makes
// "search by what is written in the page, not just the title" work.
SiteSchema.index({ title: "text", body: "text" });
