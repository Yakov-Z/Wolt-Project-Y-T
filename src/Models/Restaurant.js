class Restaurant {
    constructor(id, owner, description, name, address, category, image, kosher) {
        this.id = id;
        this.owner = owner;
        this.description = description;
        this.name = name;
        this.address = address;
        this.category = category;
        this.image = image;
        this.kosher = kosher;
        this.menu = [];
        this.views = 0;
    }

   //add a product to the restaurant menu
    addProduct(product) { 
        this.menu.push(product);
        return product;
    }
}

module.exports = Restaurant;