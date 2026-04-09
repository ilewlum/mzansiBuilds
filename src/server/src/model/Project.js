// Project model class, represents a project in the system with properties like projectId, userId, 
// title, description, stage, visibility, techStack, status, createdAt, and support.
// It includes getters and setters for each property, as well as a toJSON method for easy serialization.

import { v4 as uuidv4 } from 'uuid';

export default class Project{

    constructor (projectId , userId, title, description, techStack, createdAt,visibility,stage, status, support){
        this.projectId = projectId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.stage = stage;
        this.visibility = visibility;
        this.techStack = techStack;
        this.status = status;
        this.createdAt = createdAt;
        this.support = support;
    }

    static createProject({userId, title, description, stage, visibility,techStack, status, createdAt,support }) {
        const projectId = uuidv4();
        return new Project(projectId, userId, title, description, techStack, createdAt, visibility, stage, status, support);
    }

    // Getters
    get projectId() {
        return this._projectId;
    }   

    get userId() {
        return this._userId;
    }

    get title() {
        return this._title;
    }

    get description() {
        return this._description;
    }

    get stage() {
        return this._stage;
    }

    get visibility() {
        return this._visibility;
    }

    get techStack() {
        return this._techStack;
    }

    get status() {
        return this._status;
    }

    get support() {
        return this._support;
    }

    get createdAt() {
        return this._createdAt; 
    }

    //Setters

    set projectId(value) {
        this._projectId = value;
    }
    
    set userId(value) {
        this._userId = value;
    }

    set title(value) {
        this._title = value;
    }

    set description(value) {
        this._description = value;
    }

    set stage(value) {
        this._stage = value;
    }

    set visibility(value) {
        this._visibility = value;
    }

    set techStack(value) {
        this._techStack = value;
    }

    set status(value) {
        this._status = value;
    }

    set status(value) {
        this._status = value;
    }

    set support(value) {
        this._support = value;
    }

    set createdAt(value) {
        this._createdAt = value;
    }

    toJSON() {
        return {
            projectId: this._projectId,
            userId: this._userId,
            title: this._title,
            description: this._description,
            stage: this._stage,
            visibility: this._visibility,
            techStack: this._techStack,
            status: this._status,
            createdAt: this._createdAt
        };
    }
}