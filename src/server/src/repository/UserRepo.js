// Repository for user-related database operations using Supabase

export default class UserRepo {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create a new user in the database
  async createUser(user) {
    console.log("Repo - Creating user:", user);
    const { data, error } = await this.supabase
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
  async getUserById(userId) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("userId", userId)
      .single();    

    if (error) throw error;
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
  async updateUser({ userId, username, email, bio}){
    const { data, error } = await this.supabase
        .from("users")
        .update({ username, email, bio })
        .eq("userId", userId)
        .select()
        .single(); 

    if (error) throw error;
    return data;
  }

  // Delete a user from the database by their unique ID
  async deleteUser(userId) {
    const { data, error } = await this.supabase
      .from("users")
      .delete()
      .eq("userId", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}