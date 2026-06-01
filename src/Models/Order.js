class Order {
    constructor(id, userID, productsIDs, restaurantID, totalPrice) {
        this.id = id;
        this.userID = userID;
        this.productsIDs = productsIDs;
        this.restaurantID = restaurantID; 
        this.totalPrice = totalPrice; 
    }
}

module.exports = Order;