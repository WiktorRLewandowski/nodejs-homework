const User = require('../service/schemas/usersSchema')
const gravatar = require('gravatar')
const fs = require('fs').promises
const jimp = require('jimp')
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const ListUsers = async () => {
    return await User.find()
}

const AddUser = async (body) => {
    const { email, password } = body
    const avatarUrl = gravatar.url(email, { s: '250', d: 'retro' })
    const verificationToken = crypto.randomUUID()

    return await User.create({ email, password, avatarUrl, verificationToken })
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

const verifyUser = async (verificationToken) => {
    return User.findOneAndUpdate(
        { verificationToken },
        { $set: { verificationToken: null, verify: true }},
        { new: true }
    )
}

const verificationEmail = async (email, token) => {
    await sgMail.send({
        to: email,
        from: "scarlet_raven@wp.pl",
        subject: "Contacts API - verification link",
        text: `Click here to verify your account >> http://localhost:3000/api/users/verify/${token}`,
        html: `<a href "http://localhost:3000/api/users/verify/${token}"> >>>Verify your email here!<<<< </a>
        <hr/> or copy this link into your browser - http://localhost:3000/api/users/verify/${token}
        <hr/> Ignore this message if you're not trying to sign in to Contacts API`
    })
}

module.exports = {
    ListUsers,
    AddUser,
    logOut,
    currentUser,
    addAvatar,
    verifyUser,
    verificationEmail
}
