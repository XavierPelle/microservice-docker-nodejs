class Admin {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    // Method to save the admin to the database
    save() {
        // Logic to save the admin to the database
    }

    // Method to update the admin details
    update() {
        // Logic to update the admin details in the database
    }

    // Method to delete the admin
    delete() {
        // Logic to delete the admin from the database
    }

    // Method to find an admin by ID
    static findById(id) {
        // Logic to find an admin by ID in the database
    }

    // Method to find an admin by username
    static findByUsername(username) {
        // Logic to find an admin by username in the database
    }
}

module.exports = Admin;