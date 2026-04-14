// Controller layer for user-related operations, handling HTTP requests and responses, 
// and delegating business logic to the UserService.

export default class UserController{
    constructor(userService){
        this.userService = userService;
    }

    // Creates a new user with the provided details and sends the created user as a JSON response with a 201 status code.
    createUser = async (req, res) => {
        try {
            const { userId,username, email, bio } = req.body;
            const user = await this.userService.createUser({ userId, username, email, bio }, req.supabase);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Updates an existing user's details based on the provided information and sends the updated user as a JSON response.
    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { username, email, bio } = req.body;

            const user = await this.userService.updateUser({
                userId: id,
                username,
                email,
                bio,
            }, req.supabase);

            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Retrieves a user by their unique identifier and sends the user as a JSON response.
    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id, req.supabase);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Retrieves all users and sends them as a JSON response.
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers(req.supabase);
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };  

    // Deletes a user by their unique identifier and sends a 204 No Content response if successful.
    deleteUser = async (req, res) => {
        try {
            const { id } = req.params;
            await this.userService.deleteUser(id, req.supabase);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}