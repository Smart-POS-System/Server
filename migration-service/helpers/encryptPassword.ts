import bcrypt from "bcrypt";

async function encryptPassword(password: string): Promise<string> {
  const hash: string = await bcrypt.hash(password, 12);

  return hash;
}

export default encryptPassword;
