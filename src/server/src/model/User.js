
export default class User{

    constructor (userId, username, email, bio ){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.bio = bio;
    }

    // Getters
    get userId() {
        return this._userId;
    }

    get username() {
        return this._username;
    }

    get email() {
        return this._username;
    }

    get bio() {
        return this._username;
    }

    //Setters

    set userId(value) {
        this._userId = value;
    }
    set username(value) {
        this._username = value;
    }

    set email(value) {
        this._email = value;
    }

    set bio(value) {
        this._bio = value;
    }

    toJSON() {
        return {
            userId: this._userId,
            username: this._username,
            email: this._email,
            bio: this._bio
        };
    }
}