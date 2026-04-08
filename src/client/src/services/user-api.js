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

// get session access token
export async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}