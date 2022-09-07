import express from "express";
import {
  getUser,
  genRandString,
  saveString,
  verifyToken,
  getUserById,
  genHashedPassword,
  savePassword,
} from "../helpers/Helpers.js";
import { mail } from "../helpers/NodeMailer.js";

const route = express.Router();

//Check if user is present
route.get("/", async (req, res, next) => {
  const { email } = req.body;

  const result = await getUser(email);

  if (!result) {
    res.status(404).json({ error: "User not found" });
  } else {
    const randString = await genRandString();

    await saveString(email, randString);

    const mailerOptions = {
      from: `web.dev_test@outlook.com`,
      to: `${email}`,
      subject: `Nodemailer`,
      text: "Mail from nodemailer",
      html: `Click here to <a href="https://password-reset-backend1.herokuapp.com/users/verify/?token=${randString}" target="blank">Verify</a> your email`,
    };

    mail(mailerOptions);
    res.status(200).send({msg:`email sent`});
  }
});

//verify the link sent to users email
route.get("/verify", async (req, res) => {
  const token = req.query.token;
  console.log(token);
  const user = await verifyToken(token);

  if (!user) {
    res.status(400).send({ msg: "account does not exist" });
  }

  res.status(200).redirect(`https://password-reset-backend1.herokuapp.com/reset-password/${user._id}`);
});

//update the password entered by user in Db
route.put("/password", async (req, res) => {
  const { id, password } = req.body;

  const user = await getUserById(id);

  if (!user) {
    res.status(400).send({ msg: "user not found" });
  }

  const hashedPassword = await genHashedPassword(password);
  console.log(hashedPassword);

  await savePassword(id, hashedPassword);
  await saveString(user.email, null);

  res.status(200).send({ msg: `Password saved succesfully` });
});

export const usersRouter = route;
