export default class UserController{
    constructor(userService){
        this.userService = userService;
    }

    createUser = async (req, res) => {
        try {
            const { username, email, bio } = req.body;
            const user = await this.userService.createUser({ username, email, bio });
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { username, email, bio } = req.body;

            const user = await this.userService.updateUser({
                userId: id,
                username,
                email,
                bio,
            });

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };  

    deleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}