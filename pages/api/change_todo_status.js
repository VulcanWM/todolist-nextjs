import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';
import { change_todo_status } from "../../lib/database";
import Cookies from 'cookies'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (!session) {
      res.status(200).json({ success: false, msg: "You have to be logged in!", data: null });
      return;
    }
    const userid = session.user.id
    var username;
    const cookies = new Cookies(req, res)
    if (cookies.get("Username")){
      username = cookies.get("Username");
    } else {
      const resp = await fetch(
        `https://api.github.com/user/${userid}`
      );
      const data = await resp.json();
      username = data['login']
    }
    const title = req.body.title;
    const newStatus = req.body.newStatus
    const todos = await change_todo_status(username, title, newStatus)
    res.status(200).json({ success: true, msg: null, data: todos });
  } else {
    res.status(200).json({ success: false, msg: "Send a POST request", data: null });
  }
}