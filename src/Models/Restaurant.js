const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressData = require('./Address'); 

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

module.exports = mongoose.model('Restaurant', RestaurantSchema);