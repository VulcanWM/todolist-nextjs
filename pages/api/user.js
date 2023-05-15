import { get_user_without_set } from "../../lib/database";

export default async function handler(req, res) {
  if (req.method == 'GET') {
    const username = req.query['username']
    const user = await get_user_without_set(username)
    res.status(200).json({ success: true, msg: null, data: user });
  } else {
    res.status(200).json({ success: false, msg: "Send a GET request", data: null });
  }
}