const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

let investments = [
  {
    id: 1,
    name: "Apple",
    type: "stock",
    amount: 1000,
    currency: "USD"
  }
]

app.get('/api/investments', (req, res) => {
  res.json(investments)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})