import Collaboration from "../model/Collaboration.js"

export default class CollaborationController{
    constructor(collaborationService){
        this.collaborationService = collaborationService;
    }

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

    getUserCollaborations = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationByUserId(id, req.supabase);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

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