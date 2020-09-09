const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

let carSchema = new Schema({
    title: {
        type: String,
        required: [true, 'The title is required.'],
    },
    name: {
        type: String,
        required: [true, 'The name is required.'],
    },
    img: {
        type: String,
        required: false
    },
    engine: {
        type: String,
        required: [true, 'The engine is required.'],
    },
    passenger: {
        type: String,
        required: [true, 'The passenger is required.'],
    },
    dailyRate: {
        type: String,
        required: [true, 'The daily rate is required.'],
    },
    weeklyRate: {
        type: String,
        required: [true, 'The daily rate is required.'],
    },
    collisionCoverage: {
        type: String,
        required: [true, 'The collision coverage is required.'],
    },
    thirdDamage: {
        type: String,
        required: [true, 'The third damage is required.'],
    },
    type: {
        type: Array,
        required: [true, 'The type is required.'],
    },
    features: {
        type: String,
        required: [true, 'The features is required.'],
    },
    description: {
        type: String,
        required: [true, 'The description is required. ']
    },
    state: {
        type: Boolean,
        default: true
    },

});

module.exports = mongoose.model('Car', carSchema);