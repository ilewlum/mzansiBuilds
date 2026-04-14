// Service layer for user-related operations, handling business logic and interactions with the UserRepository.
import User from "../model/User.js"

export default class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  // Creates a new user with the provided details and saves it to the repository.
  async createUser({ userId,username, email, bio }, client) {
    const user = new User(userId, username, email, bio);
    const savedUser = await this.userRepo.createUser(user, client);
    return savedUser;
  }

  // Updates an existing user's details based on the provided information and saves the changes to the repository.
  async updateUser({ userId,username, email, bio }, client) {
    const savedUser = await this.userRepo.updateUser({ userId, username, email, bio}, client);
    return savedUser;
  }

  // Retrieves a user by their unique identifier from the repository.
  async getUserById(userId, client){
    const user = await this.userRepo.getUserById(userId, client);
    return user;
  }

  // Retrieves all users from the repository.
  async getAllUsers(client){
    const users = await this.userRepo.getAllUsers(client);
    return users;
  }

  // Deletes a user by their unique identifier from the repository and returns the deleted user.
  async deleteUser(userId, client) {
    const user = await this.userRepo.deleteUser(userId, client);
    return user;
  }
}