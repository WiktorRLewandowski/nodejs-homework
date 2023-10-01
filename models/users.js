const User = require('../service/schemas/usersSchema')
const gravatar = require('gravatar')
const fs = require('fs').promises
const jimp = require('jimp')


const ListUsers = async () => {
    return await User.find()
}

const AddUser = async (body) => {
    const { email, password } = body
    const avatarUrl = gravatar.url(email, { s: '250', d: 'retro' })

    return await User.create({ email, password, avatarUrl })
}

const logOut = userId => {
    return User.findByIdAndUpdate(userId, { token: null }, { new:true })
}

const currentUser = userId => {
    return User.findById(userId)
} 

const addAvatar = async (filePath, userId) => {
    const localPath = `public/avatars/avatar-${userId}.jpg`
    const serverPath = `${localPath.replace(/^public/, '')}`

    try {
        jimp.read(filePath).then(img => {
            img.autocrop().resize(250, 250).writeAsync(localPath)
        })

        await User.findByIdAndUpdate(
            userId,
            { $set: { avatarUrl: localPath } },
            { new: true },
        )

        fs.unlink(filePath)

        return serverPath
    } catch(e) {
        console.log("Can not update your avatar, sorry!", e.message)
    }
}

module.exports = {
    ListUsers,
    AddUser,
    logOut,
    currentUser,
    addAvatar
}
