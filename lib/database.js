import dbConnect from './mongodb'
import UserModel from '../models/UserModel'

export async function get_user(email, name, image) {
    await dbConnect()
    const users = await UserModel.find({email: email})
    if (users.length == 0){
        console.log("setting")
        const user = await UserModel.create({email: email, name: name, image: image})
        return user
    } else {
        return users[0]
    }
}