import dbConnect from './mongodb'
import User from '../models/User'

export async function get_user(email, name) {
    await dbConnect()
    const users = await User.find({email: email})
    if (users.length == 0){
        const user = await User.create({email: email, name: name})
        return user
    } else {
        return users[0]
    }
}