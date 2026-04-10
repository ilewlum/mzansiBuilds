import Collaboration from "../model/Collaboration.js"

export default class CollaborationController{
    constructor(collaborationService){
        this.collaborationService = collaborationService;
    }

    requestCollaboration = async (req, res) => {
        try{
            const {projectId, requestingUserId, title, message } = req.body;
            const newCollaboration = Collaboration.createCollaboration(projectId,requestingUserId,title,message)
            const collaboration = await this.collaborationService.addCollaboration(newCollaboration.toJSON());
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
            const collaboration = await this.collaborationService.getCollaborationById(id);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    getProjectCollaborations = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationByProjectId(id);
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    getUserCollaborations = async (req, res) => {
        try {
            const { id } = req.params;
            const collaboration = await this.collaborationService.getCollaborationByUserId(id);
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
            const collaboration = await this.commentService.updateCollaboration(
                id,
                status
            );
            res.json(collaboration);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    deleteCollaboration = async (req, res) => {
        try {
            const { id } = req.params;
            await this.collaborationService.deleteCollaboration(id);
            res.status(204).send();
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };
}