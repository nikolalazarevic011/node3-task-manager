const express = require('express')
const multer = require ('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require ('../middleware/auth')
const { sendWelcomeEmail , sendCancellationEmail} =  require ('../emails/account')
const router = new express.Router()



router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token}) //? ne moze da se senduje ako nije object pa ih sendujes kao properties?
    } catch (e) {
        res.status(400).send(e)
    } 
})

router.post('/users/login',  async(req, res) => { 
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token}) //mora {}zagrade jer su properties
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutALL', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => { //middleware mora pre route handler da se call, zato je auth u sredini
    res.send(req.user)
})


router.patch('/users/me',auth, async(req, res) => {
    const updates = Object.keys(req.body) //!keys vraca array of strings where each is a property on that obj
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))
    //! "every" (funkcija je mora callback) da vidi dal se svi updtates koji si hteo nalaze u allowed updates,i "incluces" da ih primenis 

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }

    try { 
        
        updates.forEach((update) => req.user[update] = req.body[update]) //syntax shortening
        await req.user.save()
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true})
        res.send(req.user)
    }  catch (e) {
        res.status(400).send(e)
    } 
})

router.delete('/users/me',auth,  async(req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id) //mozemo ovaj path jer koristimo auth middleware pa imamo acsess za usera
        // if (!user) {
        //     return res.status(404).send()
        // }
        
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload the image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height:250}).png().toBuffer()
    req.user.avatar =  buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error() 
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send(e)
    }
})

module.exports = router