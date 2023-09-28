const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const contacts = new Schema({
    name: {
        type: String,
        required: [true, 'Set contact name'],
        minlength: [2, "Name must be at least 2 characters long."],
        maxlength: [30, "Name must be no more than 30 characters long."],
    },
    email: {
        type: String,
        unique: [true, 'There already is such e-mail in our database!'],
        required: [true, 'Enter contact e-mail']
    },
    phone: {
        type: String,
        unique: [true, 'There already is such phone number in our database!']
    },
    favourites: {
        type: Boolean,
        default: false,
    },
    
}, { versionKey: false } )

const Contacts = model('contacts', contacts)

module.exports = Contacts