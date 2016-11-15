class User {
    constructor(username, password, privileges) {
        this.username = username;
        this.password = password;
        this.privileges = privileges;
    }
}

module.exports = User;