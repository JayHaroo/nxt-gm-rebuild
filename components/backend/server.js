require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let database, collection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    database = client.db('nxtgm');
    collection = database.collection('accounts');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.insertOne({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ FIXED Login Route — Now POST + Secure password check
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('🔍 Received Username:', username);
  console.log('🔍 Received Password:', password);

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare plain text passwords directly (⚠️ not safe for production)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
