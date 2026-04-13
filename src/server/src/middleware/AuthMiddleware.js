// Middleware to protect routes that require authentication

import { supabaseAdmin, creatUserClient } from "../config/supabaseClient.js"

// Middleware function to verify the presence and validity of a JWT token in the Authorization header of incoming requests.
export async function requireAuth (req, res,next){
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ error: "Missing authHeader" })
    }

    // Extract the token from the Authorization header and verify it using Supabase's authentication service.
    const token = authHeader.split(' ')[1]
    const {data: {user}, error} = await supabaseAdmin.auth.getUser(token)

    if (error || !user){
        return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // If the token is valid, attach the user information and a Supabase client instance to the request object for use in subsequent middleware or route handlers.
    req.user = user
    req.supabase = creatUserClient(token)
    next()
}