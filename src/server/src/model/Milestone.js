// Milestone model class, represents a comment in the system with properties 
// It includes getters and setters for each property, as well as a toJSON method for easy serialization.
import { v4 as uuidv4 } from 'uuid';

export default class Milestone{

    constructor (milestoneId, projectId, title, description ){
        this.milestoneId = milestoneId;
        this.projectId = projectId;
        this.title = title;
        this.description = description
    }

    static createMilestone( projectId, title, description){
        const milestoneId = uuidv4();
        return new Milestone( milestoneId, projectId, title, description);
    }

    // Getters
    get milestoneId(){
        return this._milestoneId;
    }

    get projectId(){
        return this._projectId;
    }
    
    get title() {
        return this._title;
    }

    get description(){
        return this._description;
    }

    get createdAt(){
        return this._createdAt;
    }

    //Setters
    set milestoneId(value){
        this._milestoneId = value;
    }

    set projectId(value){
        this._projectId = value;
    }

    set title(value) {
        this._title = value;
    }

    set description(value){
        this._description = value;
    }

    set createdAt(value){
        this._createdAt = value;
    }

    toJSON() {
        return {
            milestoneId: this._milestoneId,
            projectId: this._projectId,
            title: this._title,
            description: this._description,
            createdAt: this._createdAt
        };
    }
}