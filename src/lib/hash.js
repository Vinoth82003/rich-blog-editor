import bcrypt from "bcryptjs";

export const hashPassword = async (plain) => await bcrypt.hash(plain, 12);
export const verifyPassword = async (plain, hash) =>
  await bcrypt.compare(plain, hash);
