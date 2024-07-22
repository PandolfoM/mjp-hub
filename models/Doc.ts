import mongoose from "mongoose";

interface PagesI {
  name: string;
  route: string;
  content: string;
}

export interface Doc extends mongoose.Document {
  _id: string;
  category: string;
  pages: PagesI[];
}

const docSchema = new mongoose.Schema({
  category: { type: String },
  pages: [
    {
      name: { type: String },
      route: { type: String, unique: true },
      content: { type: String },
    },
  ],
});

export default mongoose.models.Doc || mongoose.model<Doc>("Doc", docSchema);
