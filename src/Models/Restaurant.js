class Restaurant {
    constructor(id, name, address) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.viewedBy = []; 
        this.menu = []; 
        this.nextProductId = 1;
    }

   
    addProduct(product) {
        product.id = this.nextProductId; 
        this.nextProductId++; 
        this.menu.push(product);
        return product;
    }
}

module.exports = Restaurant;