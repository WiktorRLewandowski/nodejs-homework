const express = require('express')
const router = express.Router()

const Joi = require('joi')

const {
    ListUsers, 
    AddUser,
} = require('../../models/users')

const User = require('../../service/schemas/usersSchema')

const schema = Joi.object.keys({
    email: Joi.string().email()
})

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

    if(checkUser) {
        return res.status(409).json({
            status: "error",
            code: 409,
            message: "E-mail is already in use!",
            data: "Conflict"
        })
    }

    try {
        const validateBody = schema.validate(req.body)
        
        if(validateBody.error) {
            res.json({
                status: "error",
                code: 400,
                message: "Invalid e-mail format!",
                error: validateBody.error 
            })
        }

        const user = await AddUser({ email, password })
        
        if(user) {
            res.json({
                status: "success",
                code: 200,
                data: {
                    message: 'registration successful',
                    user
                }
            }) 
        } 

    } catch(e) {
        console.log(e.message)
        next(e)
    }
})

// router.post('/login', (req, res, next) => {

// })

module.exports = router