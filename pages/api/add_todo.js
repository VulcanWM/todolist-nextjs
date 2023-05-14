import { getServerSession } from "next-auth/next"
import { authOptions } from './auth/[...nextauth]';
import { add_todo } from "../../lib/database";
import Cookies from 'cookies'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (req.method == 'POST') {
    if (!session) {
      res.status(200).json({ success: false, msg: "You have to be logged in!", data: null });
      return;
    }
    const title = req.body.title;
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
    const todos = await add_todo(username, title)
    if (typeof todos == "string"){
        res.status(200).json({ success: false, msg: todos, data: null });
    } else {
        res.status(200).json({ success: true, msg: null, data: todos });
    }
  } else {
    res.status(200).json({ success: false, msg: "Send a POST request", data: null });
  }
}