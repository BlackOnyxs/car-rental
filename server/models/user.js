const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let validRole = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} is not a valid role.'
};

let userSchema = new Schema({
    names: {
        type: String,
        required: [ true, 'The names is required.']
    },
    lastName: {
        type: String,
        required: [ true, 'The last name is required.']
    },
    cid: {
        type: String,
        required: [ true, 'The cid is required.']
    },
    age:{
        type: Number,
        required: [ true, 'The age is required.']
    },
    email: {
        type: String,
        required: [ true, 'The email is required.']
    },
    password: {
        type: String,
        required: [ true, 'The password is required.']
    },
    cellphone: {
        type: String,
        required: [ true, 'The cellphone is required.']
    },
    history: {
        type: Schema.Types.ObjectId, 
        ref: 'Reserve',
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRole
    }, 
    state: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        required: false
    },
});

userSchema.methods.ToJSON = () => {
    let user = this;
    let userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} must be unique'})

module.exports = mongoose.model('User', userSchema);