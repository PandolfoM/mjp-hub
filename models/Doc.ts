import mongoose from "mongoose";

export interface PagesI {
  name: string;
  route: string;
  content: string;
}

export interface Doc extends mongoose.Document {
  _id: string;
  category: string;
  categoryRoute: string;
  pages: PagesI[];
}

const docSchema = new mongoose.Schema({
  category: { type: String, required: true },
  categoryRoute: { type: String, required: true },
  pages: [
    {
      name: { type: String, required: true },
      route: { type: String, required: true, unique: true },
      content: { type: String, default: "" },
    },
  ],
});

export default mongoose.models.Doc || mongoose.model<Doc>("Doc", docSchema);
