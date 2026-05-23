class Restaurant {
    constructor(id, name, address) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.viewedBy = []; 
        this.menu = []; 
        //give ID to the products in the menu
        this.nextProductId = 1;
    }

   //add a product to the restaurant menu, and give it a unique ID
    addProduct(product) {
        product.id = this.nextProductId; 
        this.nextProductId++; 
        this.menu.push(product);
        return product;
    }
}

module.exports = Restaurant;