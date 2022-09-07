import { client } from "../index.js";
import cryptoRandomString from "crypto-random-string";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

//check if user exists
async function getUser(email) {
  return await client
    .db("Zoiva")
    .collection("users")
    .findOne({ email: email });
}

//get user by id
async function getUserById(id) {
  return await client
    .db("Zoiva")
    .collection("users")
    .findOne({ _id: ObjectId(id) });
}

//generate random string
async function genRandString() {
  return cryptoRandomString({ length: 50, type: "url-safe" });
}

//save the random string in DB
async function saveString(email, string) {
  return await client
    .db("Zoiva")
    .collection("users")
    .updateOne({ email: email }, { $set: { token: `${string}` } });
}

//validate token when user clicks the link
async function verifyToken(token) {
  return await client
    .db("Zoiva")
    .collection("users")
    .findOne({ token: token });
}

//hash the password
async function genHashedPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

//
async function savePassword(id, password) {
  return await client
    .db("Zoiva")
    .collection("users")
    .updateOne({ _id: ObjectId(id) }, { $set: { password: `${password}` } });
}

export {
  getUser,
  genRandString,
  saveString,
  verifyToken,
  getUserById,
  genHashedPassword,
  savePassword,
};
