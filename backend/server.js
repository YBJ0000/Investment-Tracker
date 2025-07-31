const express = require('express')
const app = express()
const PORT = 3000

const fs = require('fs') // file system
const path = require('path')
const dbPath = path.join(__dirname, 'db.json')

app.use(express.json())

app.get('/api/investments', (req, res) => {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8')
    // parse json string javascript object before response
    const parseData = JSON.parse(data)
    res.json(parseData.investments)
  } catch (error) {
    console.error('Failed to read data.', error)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})