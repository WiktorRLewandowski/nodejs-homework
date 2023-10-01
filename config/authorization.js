const passport = require('passport')

require('dotenv').config()

const auth = (req, res, next) => {

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