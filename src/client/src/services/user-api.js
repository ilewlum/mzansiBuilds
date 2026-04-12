import supabase from '../lib/supabase.js';

// function that hadles user registration
export async function handleRegistration(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error(error.message)
    return
  }

  console.log('User Registered:', data)
}

// function that handles user login
export async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error(error.message)
    return
  }
  console.log('Session:', data.session)
}

// function that handles user logout
export async function handleLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error(error.message)
  } else {
    console.log('User logged out')
  }
}

// function to get current user session info, used for profile loading and onboarding checks
export async function getCurrentUser() {
  const { data } = await supabase.auth.getSession()
  
  return {
    userId: data.session?.user.id,
    email: data.session?.user.email,
  }
}

// function to find user profile data by user ID, used in onboarding checks and profile loading
export async function findUserProfile(userId) {
  const token = await getAccessToken();
  const response = await fetch(`api/users/${userId}`,{
    headers : { Authorization : `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
}

// function to add user profile data after onboarding, called from OnboardingModal
export async function addUserProfile(username, bio) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  const email = sessionData.session?.user.email;
  console.log("Adding user profile for:", { userId, email, username, bio });

  // Attempts to add a user to the  users table in the database, which is used to store additional profile info like username and bio. 
  // This is called after onboarding is completed. If it fails, the error is caught and displayed in the modal.
  try {
    const response = await fetch("api/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, email, username, bio }),
    });

    if (!response.ok) throw new Error("Failed to save profile");

    const result = await response.json();
    console.log("User profile added:", result);
  } catch (error) {
    console.error("Error adding user profile:", error);
    throw error; // re-throw so handleSave() in the modal catches it
  }
}

// function to get user profile by ID, used in various places to load profile data for display and checks.
export async function getUserProfile(userId) {
  const response = await fetch(`api/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
}

// get session access token
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}