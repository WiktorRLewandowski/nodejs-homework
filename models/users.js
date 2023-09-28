const User = require('../service/schemas/usersSchema')
const bcrypt = require('bcrypt')

const ListUsers = async () => {
    return await User.find()
}

const AddUser = async (body) => {
    const { password } = body

    const salt = bcrypt.genSalt()
    const encryptedPass = await bcrypt.hash(password, salt)

    return await User.create({ ...body, password: encryptedPass })
}

module.exports = {
    ListUsers,
    AddUser
}
