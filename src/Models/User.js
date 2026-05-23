class User {
    constructor(id, username, password, address) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.address = address;
        this.orders = []; 
    }
}

module.exports = User;