import mongoose from "mongoose";

export interface MaintenanceI extends mongoose.Document {
  _id: string;
  siteId: string;
  emails: string;
}

const maintSchema = new mongoose.Schema({
  siteId: { type: String, required: true },
  emails: { type: String },
});

export default mongoose.models.Maintenance ||
  mongoose.model<MaintenanceI>("Maintenance", maintSchema);
