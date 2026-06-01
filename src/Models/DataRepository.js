class DataRepository {
    constructor() {
        //initialize maps to store users, restaurants, and orders in memory
        this.users = new Map();
        this.restaurants = new Map();
        this.orders = new Map();
        this.products = new Map();

        //initialize ID counters for each entity to ensure unique IDs
        this.nextUserId = 1;
        this.nextRestaurantId = 1;
        this.nextOrderId = 1;
        this.nextProductId = 1;
    }
    
    //add a new user to the data repository and ensure it has a unique ID
    addUser(user) {
        user.id = this.nextUserId;
        this.nextUserId++; 
        this.users.set(user.id, user);
        return user; 
    }

    //get a specific user by his ID
    getUser(userId) {
        return this.users.get(userId);
    }

    //get a user by his username and password for login
    getUserByDetails(username, password) {
    // Return early if username or password are null, undefined, or empty strings
    if (!username || !password) {
        return undefined; 
    }
    return Array.from(this.users.values()).find(user => 
        user.username === username && user.password === password
    );
}

    //add a new restaurant to the data repository and ensure it has a unique ID
    addRestaurant(restaurant) {
        restaurant.id = this.nextRestaurantId;
        this.nextRestaurantId++;
        this.restaurants.set(restaurant.id, restaurant);
        return restaurant;
    }

    //get a specific restaurant by its ID
    getRestaurant(restaurantId) {
        return this.restaurants.get(restaurantId);
    }
    //get all the restaurants in the data repository
    getAllRestaurants() {
        return Array.from(this.restaurants.values());
    }
    //delete a restaurant by its ID
    deleteRestaurant(restaurantId) {
    return this.restaurants.delete(restaurantId); 
}

    //add a new order to the data repository and ensure it has a unique ID
    addOrder(order) {
        order.id = this.nextOrderId;
        this.nextOrderId++;
        this.orders.set(order.id, order);
        return order;
    }
    //get a specific order by its ID
    getOrder(orderId) {
        return this.orders.get(orderId);
    }
    //get all orders for a specific user by the user ID
    getUserOrders(userId) {
        return Array.from(this.orders.values()).filter(order => order.userID === userId);
    }
    //delete an order by its ID
    deleteOrder(orderId) {
        return this.orders.delete(orderId);
    }

    addProduct(product) {
        product.id = this.nextProductId;
        this.nextProductId++;
        this.products.set(product.id, product);
        return product;
    }

    //delete a product by its ID
    deleteProduct(productId) {
        return this.products.delete(productId);
    }

}

module.exports = new DataRepository();