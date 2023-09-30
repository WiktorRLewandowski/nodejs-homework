const passport = require('passport')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.SECRET

const auth = (req, res, next) => {

    // // eslint-disable-next-line dot-notation
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    
    // if (token == null) return res.status(401).json({
    //     status: 'error',
    //     code: 401,
    //     message: 'bad token'
    // })

    // jwt.verify(token, secret, (err, user) => {
    //     if (err) return res.sendStatus(403)
    //     req.user = user
    // })

    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (!user || err) {
            return res.status(401).json({
                status: 'error',
                code: 401,
                message: "Unauthorized",
                data: "Unauthorized",
                error: err
            })
        }

        req.user = user
        next()
    })(req, res, next)
}

module.exports = auth