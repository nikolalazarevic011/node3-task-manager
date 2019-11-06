const jwt = require ('jsonwebtoken')
const User = require( '../models/user')



const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', "")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token})
        // tokens.token da bi nasao taj token iz tokens array is propertija token, sa modela User(iz foldera models)

        if (!user) {
            throw new Error()
        }

        req.token = token //da bi drugi route handlers imali acces za tak token i za user dole
        req.user = user 
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
    
}


module.exports = auth