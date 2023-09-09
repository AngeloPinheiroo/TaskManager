
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'TaskManager', key: process.env.mailgunAPIKEY});

const sendWelcomeEmail = function(email, name){
    mg.messages.create('sandbox138cfe574129452189df4d718360d84b.mailgun.org', {
        from: "angelojosepinheiro11@gmail.com",
        to: [email],
        subject: "Welcome to TaskManager",
        text: "Welcome to the app, "+ name +". Let me know how you get along with it!",
    })
}

const sendCancelationEmail = function(email, name){
    mg.messages.create('sandbox138cfe574129452189df4d718360d84b.mailgun.org', {
        from: "angelojosepinheiro11@gmail.com",
        to: [email],
        subject: "We're sorry to watch you leave!",
        text: "We're sorry to watch you leave, " + name + "! Please, tell us what we could have done to improve our service.",
    })  
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}