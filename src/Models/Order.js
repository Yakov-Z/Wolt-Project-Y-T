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
OrderSchema.set('toJSON', transformOptions);
OrderSchema.set('toObject', transformOptions);

module.exports = mongoose.model('Order', OrderSchema);