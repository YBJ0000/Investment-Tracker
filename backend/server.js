import dotenv from 'dotenv'
import express from 'express'
const app = express()
const PORT = process.env.PORT || 3000

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json')

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET

app.use(express.json())

// auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// register: restore user (username + hashed password)
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // read current data
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // check if the user already exist
    const existingUser = parsedData.users.find(user => user.username === username)
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create new user
    const newUser = {
      id: parsedData.users.length + 1,
      username,
      password: hashedPassword
    }

    // push to the array
    parsedData.users.push(newUser)

    // write into database
    await fs.writeFile(dbPath, JSON.stringify(parsedData, null, 2))

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username
      }
    })
  } catch (error) {
    console.error('Failed to register user.', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
})

// login: verify password, return jwt
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // verify input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    // read current data
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // find user
    const user = parsedData.users.find(user => user.username === username)
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username
      }
    })
  } catch (error) {
    console.error('Failed to login.', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

app.get('/profile', authenticateToken, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // current user info
    const currentUser = parsedData.users.find(
      user => user.id === req.user.userId
    )

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(currentUser)
  } catch (error) {
    console.error('Failed to read user profile.', error)
    res.status(500).json({ error: 'Failed to get user profile' })
  }
})

app.get('/investments', authenticateToken, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8')
    // parse json string into a javascript object before sending response
    const parsedData = JSON.parse(data)

    // filter investments by user id
    const userInvestments = parsedData.investments.filter(investment => investment.userId === req.user.userId)

    res.json(userInvestments)
  } catch (error) {
    console.error('Failed to read data.', error)
  }
})

app.post('/investments', authenticateToken, async (req, res) => {
  try {

    // read current data
    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    // create new investment
    const newInvestment = {
      id: parsedData.investments.length + 1,
      userId: req.user.userId,
      ...req.body
    }

    // push to the array
    parsedData.investments.push(newInvestment)

    // write into db.json
    await fs.writeFile(dbPath, JSON.stringify(parsedData, null, 2))

    // return created data
    res.status(201).json(newInvestment)
  } catch (error) {
    console.error('Failed to create data.', error)
    res.status(500).json({ error: 'Failed to create investment' })
  }
})

app.delete('/investments/:id', authenticateToken, async (req, res) => {
  try {

    // read current data
    const data = await fs.readFile(dbPath, 'utf-8')
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
    await fs.writeFile(dbPath, JSON.stringify(parsedData, null, 2))

    // return deleted investment
    res.json({
      message: 'Investment has been deleted',
      deletedInvestment
    })

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete investment', message: error.message })
  }
})

app.put('/investments/:id', authenticateToken, async (req, res) => {
  try {

    const data = await fs.readFile(dbPath, 'utf-8')
    const parsedData = JSON.parse(data)

    const index = parsedData.investments.findIndex(investments => investments.id === parseInt(req.params.id))

    if (index === -1) {
      return res.status(404).json({ error: 'Investment does not exist' })
    }

    parsedData.investments[index] = req.body
    const updatedInvestment = parsedData.investments[index]

    await fs.writeFile(dbPath, JSON.stringify(parsedData, null, 2))

    res.json({
      message: 'Investment has been updated',
      updatedInvestment
    })

  } catch (error) {
    res.status(500).json({ error: 'Failed to update investment', message: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})