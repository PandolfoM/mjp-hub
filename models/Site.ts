import mongoose from "mongoose";

export interface DeploymentsI {
  startTime: Date;
  title: string;
  type: string;
  jobId: string;
  endTime?: Date;
  status: string;
  deployedBy: string;
}

export interface Site extends mongoose.Document {
  _id: string;
  title: string;
  repo: string;
  env: { key: string; value: string }[];
  testURL: string;
  liveURL: string;
  appId: string;
  testAppId: string;
  deployments: DeploymentsI[];
  branchCreated: boolean;
  framework: string;
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
  framework: "",
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
  framework: { type: String },
  deployments: [
    {
      startTime: { type: Date },
      title: { type: String },
      type: { type: String },
      jobId: { type: String },
      endTime: { type: Date },
      status: { type: String },
      deployedBy: { type: String },
    },
  ],
});

export default mongoose.models.Site || mongoose.model<Site>("Site", siteSchema);
