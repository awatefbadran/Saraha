import { compareSync, hashSync } from "bcrypt"

export const hash=async(plainText,SALT_ROUNDS=12)=>{
  return await  hashSync(plainText,SALT_ROUNDS)
}

export const compare=async(plainText,cipherText)=>{
  return await  compareSync(plainText,cipherText)
}