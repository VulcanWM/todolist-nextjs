import dbConnect from './mongodb'
import User from '../models/User'

export async function set_user(username, image) {
    await dbConnect()
    const user = await User.create({username: username, image: image, todo: []})
    return user
}

export async function get_user(username, image) {
    await dbConnect()
    const users = await User.find({username: username})
    if (users.length == 0){
        const user = await set_user(username, image)
        return user
    } else {
        return users[0]
    }
}

export async function get_user_without_set(username){
    await dbConnect()
    const users = await User.find({username: username})
    if (users.length > 0){
        return users[0]
    } else {
        return false
    }

}

export async function add_todo(username, title){
    await dbConnect()
    const users = await User.find({username: username})
    const user = users[0]
    const todos = user.todo
    todos.push({title: title, done: false})
    const filter = { username: username };
    const update = { todo: todos };
    await User.findOneAndUpdate(filter, update);
    return todos
}

export async function delete_todo(username, title){
    await dbConnect()
    const users = await User.find({username: username})
    const user = users[0]
    const oldTodos = user.todo
    const todos = oldTodos.filter((obj) => obj.title !== title);
    const filter = { username: username };
    const update = { todo: todos };
    await User.findOneAndUpdate(filter, update);
    return todos
}

export async function edit_todo(username, oldTitle, newTitle){
    await dbConnect()
    const users = await User.find({username: username})
    const user = users[0]
    const oldTodos = user.todo
    const todos = []
    for (let todo of oldTodos) {
        if (todo.title == oldTitle){
            todos.push({title: newTitle, done: todo.done})
        } else {
            todos.push(todo)
        }
    }
    const filter = { username: username };
    const update = { todo: todos };
    await User.findOneAndUpdate(filter, update);
    return todos
}

export async function change_todo_status(username, title, newStatus){
    await dbConnect()
    const users = await User.find({username: username})
    const user = users[0]
    const oldTodos = user.todo
    const todos = oldTodos.filter((obj) => obj.title !== title);
    todos.push({title: title, done: newStatus})
    // const oldTodos = user.todo
    // const todos = []
    // for (let todo of oldTodos) {
    //     if (todo.title == title){
    //         todos.push({title: title, done: newStatus})
    //     } else {
    //         todos.push(todo)
    //     }
    // }
    const filter = { username: username };
    const update = { todo: todos };
    await User.findOneAndUpdate(filter, update);
    return todos
}