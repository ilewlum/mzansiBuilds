// Collaboration model class, represents a collaboration relationship between users within projects.
// It includes getters and setters for each property, as well as a toJSON method for easy serialization.
import { v4 as uuidv4 } from 'uuid';

export default class Collaboration{

    constructor (collaborationId, projectId, requestingUserId, title, message){
        this.collaborationId = collaborationId;
        this.projectId = projectId;
        this.requestingUserId = requestingUserId;
        this.title = title;
        this.message = message;
    }

    static createCollaboration( projectId, requestingUserId, title, message, ){
        const collaborationId = uuidv4()
        return new Collaboration(collaborationId, projectId, requestingUserId,title,message)
    }

    // Getters
    get collaborationId() {
        return this._collaborationId;
    }

    get projectId() {
        return this._projectId;
    }

    get requestingUserId() {
        return this._requestingUserId;
    }

    get title() {
        return this._title;
    }

    get message() {
        return this._message;
    }

    get status() {
        return this._status;
    }

    get createdAt() {
        return this._createdAt;
    }

    //Setters

    set collaborationId(value) {
        this._collaborationId = value;
    }
    set projectId(value) {
        this._projectId = value;
    }

    set requestingUserId(value) {
        this._requestingUserId = value;
    }

    set title(value) {
        this._title = value;
    }

    set message(value) {
        this._message = value;
    }

    set status(value) {
        this._status = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    toJSON() {
        return {
            collaborationId: this._collaborationId,
            projectId: this._projectId,
            requestingUserId: this._requestingUserId,
            title: this._title,
            message: this._message,
            status: this._status,
            createdAt: this._createdAt
        };
    }
}