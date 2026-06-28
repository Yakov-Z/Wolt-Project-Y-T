const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: 0 
    },
    image: { 
        type: String, 
        required: true 
    },
    restaurantID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant',
        required: true 
    },
    views: { 
        type: Number, 
        default: 0 
    }
});

module.exports = mongoose.model('Product', ProductSchema);