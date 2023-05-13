import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';
import { set_habit } from "../../lib/database";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (!session) {
      res.status(200).json({ success: false, msg: "You have to be logged in!", data: null });
      return;
    }
    const email = session.user.email;
    const name = session.user.name;
    const title = req.body.title;
    const habit = await set_habit(email, name, title, "Description...", "R:Mo:1")
    if (typeof habit == "string"){
        res.status(200).json({ success: false, msg: habit, data: null });
    } else {
        res.status(200).json({ success: true, msg: null, data: habit });
    }
  } else {
    res.status(200).json({ success: false, msg: "Send a POST request", data: null });
  }
}