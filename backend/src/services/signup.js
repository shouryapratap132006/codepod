import User from "../models/user.js";
import bcrypt from "bcrypt";

export async function createUser(userData) {
  const { name, email, password } = userData;

  // ✅ Hash password properly
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Create new user instance
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  });

  // ✅ Save to database
  const savedUser = await user.save();
  return savedUser;
}

// Optional: default export for convenience
export default { createUser };
