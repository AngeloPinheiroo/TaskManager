const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user'); // require the user model (basically a c struct or javascript object)
const Task = require('../models/task'); // require the user model (basically a c struct or javascript object)

const auth = require('../middleware/auth'); // require the auth middleware

const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account');


const router = new express.Router();

router.post('/users', async function(req, res){
    const user = new User(req.body);

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token});
    } catch(error){
        res.status(400).send(error);
    }
})

router.post('/users/login', async function(req, res){
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(error){
        res.status(400).send();
    }
})

router.post('/users/logout', auth, async function(req, res){
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(error){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async function(req, res){
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(error){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async function(req, res){
    res.send(req.user)
})


router.patch('/users/me', auth, async function(req, res){
    const updates = Object.keys(req.body);

    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'});
    }
    try{
        const user = req.user;
        updates.forEach((update) => user[update] = req.body[update])
        await user.save();

        res.send(user);

    } catch(error){
        res.status(400).send(error);
    }
})

router.delete('/users/me', auth, async function(req, res){
    try{
        await Task.deleteMany({owner: req.user._id})
        await req.user.deleteOne();
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(error){
        res.status(500).send();
    }
})


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('The file must be either jpg, jpeg or png'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async function(req, res){
    const user = req.user;

    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    
    user.avatar = buffer;
    await user.save();

    res.send();
}, function(error, req, res, next){
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async function(req, res){
    const user = req.user;

    user.avatar = undefined;
    await user.save();

    res.send();
}, function(error, req, res, next){
    res.status(400).send({error: error.message})
})

router.get('/users/:id/avatar', async function(req, res){
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) throw new Error();

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(error){
        res.status(404).send()
    }
})

module.exports = router