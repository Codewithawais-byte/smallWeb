import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import sanitizeHtml from "sanitize-html";
import { Site } from "../schemas/site.schema";

// Deliberately small allowlist. Authors can format a page; they
// cannot script it, style-inject, or load external resources.
const SANITIZE_OPTS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "a",
    "b",
    "i",
    "em",
    "strong",
    "br",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "blockquote",
    "code",
    "pre",
  ],
  allowedAttributes: { a: ["href"] },
  allowedSchemes: ["http", "https"],
  disallowedTagsMode: "discard",
};

@Injectable()
export class SitesService {
  constructor(@InjectModel(Site.name) private siteModel: Model<Site>) {}

  async findByAddress(address: string) {
    return this.siteModel.findOne({ address: address.toLowerCase().trim() });
  }

  async search(q: string) {
    return this.siteModel
      .find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(25);
  }

  async publish(params: {
    address: string;
    title: string;
    body: string;
    authorId: string;
  }) {
    const address = params.address.toLowerCase().trim();
    const existing = await this.siteModel.findOne({ address });
    if (existing) {
      throw new ConflictException(`Address "${address}" is already taken`);
    }
    return this.siteModel.create({
      address,
      title: params.title,
      body: sanitizeHtml(params.body, SANITIZE_OPTS),
      authorId: new Types.ObjectId(params.authorId),
    });
  }

  async byAuthor(authorId: string) {
    return this.siteModel.find({ authorId: new Types.ObjectId(authorId) });
  }
}
