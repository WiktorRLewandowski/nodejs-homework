const User = require('../service/schemas/usersSchema')
// const bcrypt = require('bcrypt')

const ListUsers = async () => {
    return await User.find()
}

const AddUser = async (body) => {
    const { email, password } = body

    return await User.create({ email, password })
}

const logOut = userId => {

    return User.findByIdAndUpdate(userId, { token: null }, { new:true })
}

const currentUser = userId => {
    return User.findById(userId)
} 

module.exports = {
    ListUsers,
    AddUser,
    logOut,
    currentUser
}
