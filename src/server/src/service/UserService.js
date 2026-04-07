import User from "../model/User.js";

export default class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  async createUser({ username, email, bio }) {
    const user = User.create({ username, email, bio });
    const savedUser = await this.userRepo.createUser(user);
    return savedUser;
  }

  async updateUser({ userId,username, email, bio }) {
    const savedUser = await this.userRepo.updateUser({ userId, username, email, bio});
    return savedUser;
  }

  async getUserById(userId){
    const user = await this.userRepo.getUserById(userId);
    return user;
  }

  async getAllUsers(){
    const users = await this.userRepo.getAllUsers();
    return users;
  }

  async deleteUser(userId) {
    const user = await this.userRepo.deleteUser(userId);
    return user;
  }
}