import argon2 from "argon2";

async function hash(value: string) {
  return argon2.hash(value);
}

async function verify(hashed: string, value: string) {
  return argon2.verify(hashed, value);
}

export const PasswordHasherService = { hash, verify };
