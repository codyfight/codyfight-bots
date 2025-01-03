import 'dotenv/config'
import path from 'path'
import routes from './routes.js'

import express, { Response } from 'express'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.resolve('src/client/public')))

app.use(routes)

app.use((err: any, res: Response) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || 'An unknown error occurred' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
