const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // Load .env file
console.log("MONGODB_URI:", process.env.MONGODB_URI); // Debugging

if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined! Check your .env file.");
}
 // Ensure you have a .env file with MONGODB_URI

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}
connectDB();

const database = client.db("nxtgm");
const collection = database.collection("accounts");

// Test route
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  if (!email || !password) {
      console.log('Error: Missing email or password');
      return res.status(400).json({ message: 'Missing email or password' });
  }

  try {
      const user = await collection.findOne({ email });

      if (!user) {
          console.log('Error: User not found');
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.password !== password) {
          console.log('Error: Incorrect password');
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log('Login successful:', user.name);
      res.json({ message: 'Login successful', name: user.name });

  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Something went wrong!' });
  }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
