class Restaurant {
    constructor(id, name, address) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.viewedBy = []; 
        this.menu = []; 
    }

   
    addProduct(product) {
        this.menu.push(product);
    }
}

module.exports = Restaurant;