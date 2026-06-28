const mongoose = require('mongoose');
const AddressData = require('./Address');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    realname: { 
        type: String, 
        required: true 
    },
    phonenumber: { 
        type: String, 
        required: true 
    },
    mail: { 
        type: String, 
        required: true, 
        unique: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    address: AddressData,
    isadmin: { 
        type: Boolean, 
        default: false 
    },
    orders: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Order' 
    }],
    userview: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }]
});

module.exports = mongoose.model('User', UserSchema);