const { error } = require('console')
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
    const parsedData = JSON.parse(data)
    res.json(parsedData.investments)
  } catch (error) {
    console.error('Failed to read data.', error)
  }
})

app.post('/api/investments', (req, res) => {
  try {

    // read current data
    const data = fs.readFileSync(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // create new investment
    const newInvestment = {
      id: parsedData.investments.length + 1,
      ...req.body
    }

    // push to the array
    parsedData.investments.push(newInvestment)

    // write into db.json
    fs.writeFileSync(dbPath, JSON.stringify(parsedData, null, 2))

    // return created data
    res.status(201).json(newInvestment)
  } catch (error) {
    console.error('Failed to create data.', error)
    res.status(500).json({ error: 'Failed to create investment' })
  }
})

app.delete('/api/investments/:id', (req, res) => {
  try {
    
    // read current data
    const data = fs.readFileSync(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // find index of target investment
    const index = parsedData.investments.findIndex(investment => investment.id === parseInt(req.params.id))

    // if not exist, return 404
    if (index === -1) {
      return res.status(404).json({ error: 'Investment does not exist' })
    }

    // delete investment
    const deletedInvestment = parsedData.investments.splice(index, 1)[0]

    // write into db.json
    fs.writeFileSync(dbPath, JSON.stringify(parsedData, null, 2))

    // return deleted investment
    res.json({
      message: 'Investment has been deleted',
      deletedInvestment
    })

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete investment', message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})