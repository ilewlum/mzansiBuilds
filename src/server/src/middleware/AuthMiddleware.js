import { createClient } from "@supabase/supabase-js"
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

export async function requireAuth (req, res,next){
    const authHeader = req.headers.authorization
    console.log (authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({ error: "Missing authHeader" })
    }

    const token = authHeader.split(' ')[1]
    const {data: {user}, error} = await supabase.auth.getUser(token)

    if (error || !user){
        return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user // attach user to request
  next()
}