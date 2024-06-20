import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface User extends mongoose.Document {
  _id: string;
  email: string;
  tempPassword: boolean;
}

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tempPassword: { type: Boolean },
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.User || mongoose.model<User>("User", userSchema);
