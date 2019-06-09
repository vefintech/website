'use strict';
const nodemailer = require('nodemailer');
const config = require('../config/config');
const EventEmitter = require('events').EventEmitter;

const events = new EventEmitter;
const email = {
    emit: function(options) {
        events.emit('send',options);
    },
    send: function(options) {
        options = Object.assign(options,{from: config.email.sender});
        
        const transporter = nodemailer.createTransport({
            host: config.email.host,
            port: config.email.port,
            secure: config.email.secure,
            auth: {
                user: config.email.user, 
                pass: config.email.password 
            }
        });
        
        transporter.sendMail(options, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
   
};

events.on('send',email.send);

module.exports = email;