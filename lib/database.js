import dbConnect from './mongodb'
import UserModel from '../models/UserModel'
import HabitModel from '../models/HabitModel'

export async function set_user(email, name, image) {
    await dbConnect()
    const user = await UserModel.create({email: email, name: name, image: image})
    return user
}

export async function get_user(email, name, image) {
    await dbConnect()
    const users = await UserModel.find({email: email})
    if (users.length == 0){
        console.log("setting")
        const user = await set_user(email, name, image)
        return user
    } else {
        return users[0]
    }
}

export async function get_habits(email) {
    await dbConnect()
    const habits = await HabitModel.find({email: email})
    return habits
}

export async function set_habit(email, name, title, desc, days) {
    const habits = await get_habits(email)
    if (habits.length >= 20){
        return "You cannot have more than 20 habits!"
    } else {
        await HabitModel.create({
            name: name,
            email: email,
            title: title,
            days: days,
            desc: desc,
            active: false,
        })
        return true
    }
}