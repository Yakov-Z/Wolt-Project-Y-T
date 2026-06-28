const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AddressSchema = new Schema({
    city: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { _id: false }); 

module.exports = AddressSchema;