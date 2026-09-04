const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressData = require('./address'); 

const RestaurantSchema = new Schema({
    owner: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    address: AddressData, 
    category: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        required: true 
    },
    logo: { 
        type: String, 
        required: true 
    },
    kosher: { 
        type: Boolean, 
        required: true 
    },
    menu: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    views: { 
        type: Number, 
        default: 0 
    }
   
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
RestaurantSchema.set('toJSON', transformOptions);
RestaurantSchema.set('toObject', transformOptions);

module.exports = mongoose.model('Restaurant', RestaurantSchema);