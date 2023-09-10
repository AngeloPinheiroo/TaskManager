const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const app = require('../src/app')

const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "AngeloPinheiro",
    age: 23,
    email: "angelojosepinheiro11@gmail.com",
    password: "angelolindo",
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWTKEY)
    }]  
}

beforeEach(async function(){
    await User.deleteMany({})
    await new User(userOne).save();
})

test('Should signup a new user', async function(){
    const response = await request(app).post('/users').send({
        name: "AngeloPinheiro2",
        age: 21,
        email: "angelojosepinheiro112@gmail.com",
        password: "angelolindo123"
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'AngeloPinheiro2', 
            email: 'angelojosepinheiro112@gmail.com'
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async function(){
    await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
})


test('Should get profile for user', async function(){
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async function(){
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async function(){
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200)
})

test('Should not delete account for unauthenticated user', async function(){
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})