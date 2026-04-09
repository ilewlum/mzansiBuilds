import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './route/index.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())


// mount routes
routes(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})