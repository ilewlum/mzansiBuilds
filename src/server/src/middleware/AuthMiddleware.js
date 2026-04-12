import { supabaseAdmin, creatUserClient } from "../config/supabaseClient.js"


export async function requireAuth (req, res,next){
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ error: "Missing authHeader" })
    }

    const token = authHeader.split(' ')[1]
    const {data: {user}, error} = await supabaseAdmin.auth.getUser(token)

    if (error || !user){
        return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user
    req.supabase = creatUserClient(token)
    next()
}