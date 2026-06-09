class Product {
    constructor(id, name, description, category, price, image, restaurantID) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.image = image;
        this.restaurantID = restaurantID;
        this.views = 0;
    }
}


module.exports = Product;