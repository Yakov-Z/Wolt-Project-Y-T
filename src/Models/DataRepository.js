class DataRepository {
    constructor() {
        this.users = new Map();
        this.restaurants = new Map();
        this.orders = new Map();

        this.nextUserId = 1;
        this.nextRestaurantId = 1;
        this.nextOrderId = 1;
    }
    
    addUser(user) {
        user.id = this.nextUserId;
        this.nextUserId++; 
        this.users.set(user.id, user);
        return user; 
    }

    getUser(userId) {
        return this.users.get(userId);
    }

    addRestaurant(restaurant) {
        restaurant.id = this.nextRestaurantId;
        this.nextRestaurantId++;
        this.restaurants.set(restaurant.id, restaurant);
        return restaurant;
    }

    getRestaurant(restaurantId) {
        return this.restaurants.get(restaurantId);
    }

    getAllRestaurants() {
        return Array.from(this.restaurants.values());
    }

    addOrder(order) {
        order.id = this.nextOrderId;
        this.nextOrderId++;
        this.orders.set(order.id, order);
        return order;
    }

    getOrder(orderId) {
        return this.orders.get(orderId);
    }

    getUserOrders(userId) {
        return Array.from(this.orders.values()).filter(order => order.userId === userId);
    }
}

module.exports = new DataRepository();