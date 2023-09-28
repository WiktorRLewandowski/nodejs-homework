const jwt = require('jsonwebtoken')
const User = require('../service/schemas/usersSchema')
const passport = require('passport')
require('dotenv').config()
const secret = process.env.SECRET

const auth = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (!user || err) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: "Unauthorized",
                data: "Unauthorized"
            })
        }
        req.user = user
        next()
    })(req, res, next)
}