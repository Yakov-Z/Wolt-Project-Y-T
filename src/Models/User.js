class User {
    constructor(id, username, password, realname, phonenumber, mail, image, address) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.realname = realname;
        this.phonenumber = phonenumber;
        this.mail = mail;
        this.image = image;
        this.address = address;
        this.orders = []; 
        this.userview = [];
    }
}

module.exports = User;

