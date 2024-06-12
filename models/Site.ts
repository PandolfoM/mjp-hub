import mongoose from "mongoose";

export interface Site extends mongoose.Document {
  _id: string;
  title: string;
  repo: string;
  env: { key: string; value: string }[];
  testURL: string;
  liveURL: string;
  appId: string;
}

// const EnvSchema = new mongoose.Schema({ key: String, value: String });

const siteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  repo: { type: String },
  env: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  testURL: { type: String },
  liveURL: { type: String },
  appId: { type: String },
});

export default mongoose.models.Site || mongoose.model<Site>("Site", siteSchema);
