// Controller for handling HTTP requests related to collaborations, including creating, retrieving, updating, 
// and deleting collaborations. It interacts with the CollaborationService to perform these operations and 
// sends appropriate JSON responses back to the client.

import Collaboration from "../model/Collaboration.js"

export default class CollaborationController{
    constructor(collaborationService){
        this.collaborationService = collaborationService;
    }

    // Creates a new collaboration request with the provided details and sends the created collaboration as a JSON response with a 201 status code.
    requestCollaboration = async (req, res) => {
        try{
            const {projectId, requestingUserId, title, message } = req.body;
            const newCollaboration = Collaboration.createCollaboration(projectId,requestingUserId,title,message)
            const collaboration = await this.collaborationService.addCollaboration(newCollaboration.toJSON(), req.supabase);
            res.status(201).json(collaboration);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Get a collaboration by its unique identifier and send the collaboration as a JSON response.
    getCollaborationById = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationById(id, req.supabase);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Get all collaborations for a project by the project's unique identifier and send them as a JSON response.
    getProjectCollaborations = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationByProjectId(id, req.supabase);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Get all collaborations for a user by the user's unique identifier and send them as a JSON response.
    getUserCollaborations = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationsByUserId(id, req.supabase);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Update a collaboration's status by its unique identifier and send the updated collaboration as a JSON response.
    updateCollaboration = async (req, res) => {
        try {
            const { id } = req.params;
            const { status} = req.body;
            console.log("Controller layer: ", id, status)
            const collaboration = await this.collaborationService.updateCollaboration(id,status, req.supabase);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Delete a collaboration by its unique identifier and send a 204 No Content response if successful.
    deleteCollaboration = async (req, res) => {
        try {
            const { id } = req.params;
            await this.collaborationService.deleteCollaboration(id, req.supabase);
            res.status(204).send();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };
}