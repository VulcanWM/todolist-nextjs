import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';
import { edit_title } from "../../lib/database";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (!session) {
      res.status(200).json({ success: false, msg: "You have to be logged in!", data: null });
      return;
    }
    const habit_id = req.body.habit_id;
    const title = req.body.title
    await edit_title(habit_id, title)
    res.status(200).json({ success: true, msg: null, data: null });
  } else {
    res.status(200).json({ success: false, msg: "Send a POST request", data: null });
  }
}