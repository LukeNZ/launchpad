class User {
    constructor(username, password, permissions) {
        this.username = username;
        this.password = password;
        this.permissions = permissions;
    }
}

module.exports = User;