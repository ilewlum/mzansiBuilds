
export default class UserRepo {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async createUser(user) {
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

  async getUserById(userId) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("userId", userId)
      .single();    

    if (error) throw error;
    return data;
  }

  async getAllUsers() {
    const { data, error } = await this.supabase
        .from("users")
        .select("*");

    if (error) throw error;
    return data;
}

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