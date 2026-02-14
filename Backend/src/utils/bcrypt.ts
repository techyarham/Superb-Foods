import bcrypt from 'bcrypt';

export const hashPass = async (pass: string) => {
  return await bcrypt.hash(pass, 10);
};

export const verifyPass = async (plainPass: string, hashedPass: string) => {
  return await bcrypt.compare(plainPass, hashedPass);
};
