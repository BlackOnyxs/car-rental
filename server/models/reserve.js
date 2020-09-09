const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reserveSchema = new Schema({
    pickupLocation: {
        type: String,
        required: [ true, 'The pickup location is required.']
    },
    returnLocation: {
        type: String,
        required: [ true, 'The return location is required.']
    },
    pickupDate: {
        type: String,
        required: [ true, 'The pickup date is required.']
    },
    returnDate: {
        type: String,
        required: [ true, 'The return date is required.']
    },
    totalCost: {
        type: String,
        required: [ true, 'The total cost is required.']
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: [ true, 'The car is required.']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'The user is required.']
    },
    state: {
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model('Reserve', reserveSchema);