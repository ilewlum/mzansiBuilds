// Repository for user-related database operations using Supabase

export default class UserRepo {

  constructor(supabase) {
    this.supabase = supabase; // ✅ this was removed at some point
  }

  getClient(client){
    return client || this.supabase
  }

  // Create a new user in the database
  async createUser(user, client) {
    const { data, error } = await this.getClient(client)
        .from("users")
        .insert([{
            userId: user.userId,
            username: user.username,
            email: user.email,
            bio: user.bio
            }])
        .select()
        .single();

    if (error) throw error;
    return data;
  }

  // Retrieve a user by their unique ID
  async getUserById(userId, client) {
    const { data, error } = await this.getClient(client)
      .from("users")
      .select("*")
      .eq("userId", userId)
      .single();    

    if (error) {
      console.log(error)
      throw error;
    }
    console.log("Done")
    console.log(data)
    return data;
  }

  // Retrieve all users from the database
  async getAllUsers() {
    const { data, error } = await this.supabase
        .from("users")
        .select("*");

    if (error) throw error;
    return data;
  }

  // Update an existing user's information
  async updateUser({ userId, username, email, bio}, client){
    const { data, error } = await this.getClient(client)
        .from("users")
        .update({ username, email, bio })
        .eq("userId", userId)
        .select()
        .single(); 

    if (error) throw error;
    return data;
  }

  // Delete a user from the database by their unique ID
  async deleteUser(userId, client) {
    const { data, error } = await this.getClient(client)
      .from("users")
      .delete()
      .eq("userId", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}