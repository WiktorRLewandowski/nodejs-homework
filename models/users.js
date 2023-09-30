const User = require('../service/schemas/usersSchema')
// const bcrypt = require('bcrypt')

const ListUsers = async () => {
    return await User.find()
}

const AddUser = async (body) => {
    const { email, password } = body

    return await User.create({ email, password })
}

module.exports = {
    ListUsers,
    AddUser
}
