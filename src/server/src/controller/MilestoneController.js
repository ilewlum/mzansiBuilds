// Controller for handling HTTP requests related to milestones, including creating, retrieving, updating, and deleting milestones. It interacts with the MilestoneService to perform these operations and sends appropriate JSON responses back to the client.
import Milestone from "../model/Milestone.js"

export default class MilestoneController{
    constructor(milestoneService){
        this.milestoneService = milestoneService;
    }

    // Creates a new milestone with the provided details and sends the created milestone as a JSON response with a 201 status code.
    createMilestone = async (req, res) => {
        try{
            const {projectId, title, description} = req.body;
            const newMilestone = Milestone.createMilestone(projectId, title, description);
            const milestone = await this.milestoneService.addMilestone(newMilestone.toJSON(), req.supabase);
            res.status(201).json(milestone);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Get all milestones for a project by the project's unique identifier and send them as a JSON response.
    getMilestoneById = async (req, res) => {
        try {
            const { id } = req.params;
            const milestone = await this.milestoneService.getMilestoneById(id, req.supabase);
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Get all milestones for a project
    getMilestoneByProjectId = async (req, res) => {
        try {
            const { id } = req.params;
            const milestone = await this.milestoneService.getMilestoneByProjectId(id, req.supabase);
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    //  Update a milestone's description by its unique identifier and send the updated milestone as a JSON response.
    updateMilestone = async (req, res) => {
        try {
            const { id } = req.params;
            const { description} = req.body;
            const milestone = await this.milestoneService.updateMilestone(
                id,
                description,
                req.supabase
            );
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Delete a milestone by its unique identifier and send a 204 No Content response if successful.
    deleteMilestone = async (req, res) => {
        try {
            const { id } = req.params;
            await this.milestoneService.deleteMilestone(id, req.supabase);
            res.status(204).send();
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }
    };
}