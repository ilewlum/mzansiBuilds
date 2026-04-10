// Comment model class, represents a comment in the system with properties like commentId, projectId, userId, body, and createdAt 
// It includes getters and setters for each property, as well as a toJSON method for easy serialization.
import { v4 as uuidv4 } from 'uuid';

export default class Comment{

    constructor (commentId, projectId, userId, body, createdAt ){
        console.log("Model - Creating comment:", { commentId, projectId, userId, body});
        this.commentId = commentId;
        this.projectId = projectId;
        this.userId = userId;
        this.body = body;
    }

    static createComment( projectId, userId, body, createdAt){
        const commentId = uuidv4();
        return new Comment(commentId, projectId, userId, body, createdAt);
    }

    // Getters
    get commentId(){
        return this._commentId;
    }

    get projectId(){
        return this._projectId;
    }
    
    get userId() {
        return this._userId;
    }

    get body(){
        return this._body;
    }

    get createdAt(){
        return this._createdAt;
    }

    //Setters
    set commentId(value){
        this._commentId = value;
    }

    set projectId(value){
        this._projectId = value;
    }

    set userId(value) {
        this._userId = value;
    }

    set body(value){
        this._body = value;
    }

    set createdAt(value){
        this._createdAt = value;
    }

    toJSON() {
        return {
            commentId: this._commentId,
            projectId: this._projectId,
            userId: this._userId,
            body: this._body,
            createdAt: this._createdAt
        };
    }
}