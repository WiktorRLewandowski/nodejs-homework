const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


const bcrypt = require('bcrypt')
const secret = process.env.SECRET

const {
    ListUsers, 
    AddUser,
    logOut,
    currentUser
} = require('../../models/users')

const User = require('../../service/schemas/usersSchema')
const auth = require('../../config/authorization')

// ===============GET===================

router.get('/', async (req, res, next)=> {
    try {
        const users = await ListUsers()
        res.json({
            status: 'success',
            code: 200,
            message: users
        })
    } catch(e) {
        console.log(e.message)
        next(e)
    }
})

// ==============POST===================

router.post('/signup', async (req, res, next) => {
    const { email, password } = req.body
    const checkUser = await User.findOne({email}).lean()
    console.log(email)
    if(checkUser) {
        return res.status(409).json({
            status: "error",
            code: 409,
            message: "E-mail is already in use!",
            data: "Conflict"
        })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await AddUser({ email, password: hashedPassword })
        if(user) {
            res.json({
                status: "success",
                code: 200,
                data: {
                    message: 'registration successful',
                    user
                }
            }) 
        } else {
            res.json({
                status: "error",
                code: 400,
                message: "Error trying to register user",
            })
        }

    } catch(e) {
        console.log(e.message)
        next(e)
    }
})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const validPassword = await bcrypt.compare(password, user.password)
    if (!user || !validPassword) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: 'Incorrect login or password',
            data: 'bad request'
        })
    }

    const payload = {
        id: user._id,
        username: user.email
    }

    const token = jwt.sign(payload, secret, { expiresIn: '1h' })

    user.token = token
    await user.save()

    res.json({
        status: 'success',
        code: 200,
        data: {
            token
        }
    })
})

router.post('/logout', auth, async (req, res, next) => {
   const { _id } = req.user
   const user = await User.findOne({ _id }).lean()
   try {
        if(user) {
            await logOut(_id)
            res.status(204)
        } else {
            return res.status(401).json({
                status: 'Unauthorized',
                code: 401,
                message: 'Not authorized'
            }) 
        }
   } catch(e) {
        console.log(e.message)
        next(e)
   }
})

router.get('/current', auth, async (req, res, next) => {
    const { email, subscription, _id } = req.user
    const user = await currentUser(_id)
    try {
        if(user) {
            res.json({
                status: "success",
                code: 200,
                message: { email, subscription }
            })
        } else {
            return res.status(401).json({
                status: "Unauthorized",
                code: 401,
                message: 'Not authorized'
            })
        }
    } catch(e){
        console.log(e.message)
        next(e)
    }
})

module.exports = router