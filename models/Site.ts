import mongoose from "mongoose";

export interface Site extends mongoose.Document {
  _id: string;
  title: string;
  repo: string;
  env: Object;
  testURL: string;
  liveURL: string;
}

const siteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  repo: { type: String },
  env: { type: String },
});

export default mongoose.models.Site || mongoose.model<Site>("Site", siteSchema);
