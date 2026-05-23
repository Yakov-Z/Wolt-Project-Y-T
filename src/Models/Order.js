class Order {
    constructor(id, user, products, restaurant, totalPrice) {
        this.id = id;
        this.user = user; 
        this.products = products;
        this.restaurant = restaurant; 
        this.totalPrice = totalPrice; 
    }
}

module.exports = Order;