import Milestone from "../model/Milestone.js"

export default class MilestoneController{
    constructor(milestoneService){
        this.milestoneService = milestoneService;
    }

    createMilestone = async (req, res) => {
        try{
            const {projectId, title, description} = req.body;
            const newMilestone = Milestone.createMilestone(projectId, title, description);
            const milestone = await this.milestoneService.addMilestone(newMilestone.toJSON());
            res.status(201).json(milestone);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    getMilestoneById = async (req, res) => {
        try {
            const { id } = req.params;
            const milestone = await this.milestoneService.getMilestoneById(id);
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getMilestoneByProjectId = async (req, res) => {
        try {
            const { id } = req.params;
            const milestone = await this.milestoneService.getMilestoneByProjectId(id);
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    updateMilestone = async (req, res) => {
        try {
            const { id } = req.params;
            const { description} = req.body;
            const milestone = await this.milestoneService.updateMilestone(
                id,
                description
            );
            res.json(milestone);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    deleteMilestone = async (req, res) => {
        try {
            const { id } = req.params;
            console.log(id);
            await this.milestoneService.deleteMilestone(id);
            res.status(204).send();
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }
    };
}