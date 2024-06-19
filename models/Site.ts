import mongoose from "mongoose";

export interface Site extends mongoose.Document {
  _id: string;
  title: string;
  repo: string;
  env: { key: string; value: string }[];
  testURL: string;
  liveURL: string;
  appId: string;
  testAppId: string;
  deployments: { date: Date; title: string; type: string }[];
  branchCreated: boolean;
}

export const testSite = {
  title: "",
  repo: "",
  liveURL: "",
  testURL: "",
  appId: "",
  testAppId: "",
  env: [],
  deployments: [],
  branchCreated: false,
};

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
  testAppId: { type: String },
  branchCreated: { type: Boolean },
  deployments: [
    {
      date: { type: Date },
      title: { type: String },
      type: { type: String },
    },
  ],
});

export default mongoose.models.Site || mongoose.model<Site>("Site", siteSchema);
