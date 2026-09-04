const mongoose = require('mongoose');
const AddressData = require('./address');
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
const transformOptions = {
    virtuals: true,
    transform: (doc, ret) => {
        // Map the internal MongoDB _id to standard id
        ret.id = ret._id;
        
        // Remove the internal MongoDB _id
        delete ret._id;
        
        // Remove the internal version key
        delete ret.__v;
    }
};
UserSchema.set('toJSON', transformOptions);
UserSchema.set('toObject', transformOptions);

module.exports = mongoose.model('User', UserSchema);