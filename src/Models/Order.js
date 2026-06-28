const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
   
    userID: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },

    productsIDs: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Product' 
    }],

    restaurantID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Restaurant',
        required: true 
    },
    totalPrice: { 
        type: Number 
        
    }
});

module.exports = mongoose.model('Order', OrderSchema);