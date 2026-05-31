class Restaurant {
    constructor(id, name, address) {
        this.id = id;
        this.name = name;
        this.address = address; 
        this.menu = []; 
    }

   //add a product to the restaurant menu, and give it a unique ID
    addProduct(product) { 
        this.menu.push(product);
        return product;
    }
}

module.exports = Restaurant;