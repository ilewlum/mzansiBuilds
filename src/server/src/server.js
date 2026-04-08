import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './route/index.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.send('API is running...')
})

// mount routes
routes(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})