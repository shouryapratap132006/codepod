import mongoose from "../configuration/dbConfig.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ["admin", "customer"],
    default: "customer",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
