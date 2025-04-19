require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let accountsCollection, feedCollection;

async function connectDB() {
  try {
    await client.connect();
    const database = client.db('nxtgm');
    accountsCollection = database.collection('accounts');
    feedCollection = database.collection('feed');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('✅ Server is running');
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await accountsCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    await accountsCollection.insertOne({ username, password });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await accountsCollection.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
      message: 'Login successful',
      username: user.username,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Accounts (Get account by username)
app.post('/api/accounts', async (req, res) => {
  const { username } = req.body;
  try {
    const account = await accountsCollection.findOne({ username });
    res.json(account);
  } catch (error) {
    console.error('❌ Accounts error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Feed
app.get('/api/feed', async (req, res) => {
  try {
    const feed = await feedCollection.find({}).toArray();

    const enrichedFeed = await Promise.all(
      feed.map(async (post) => {
        let authorInfo = null;

        try {
          const authorObjectId = new ObjectId(post.author);
          const author = await accountsCollection.findOne({ _id: authorObjectId });
          authorInfo = author ? { username: author.username } : null;
        } catch (err) {
          // Invalid ObjectId — skip author enrichment
          authorInfo = null;
        }

        return {
          ...post,
          author: authorInfo,
        };
      })
    );

    res.json(enrichedFeed);
  } catch (error) {
    console.error('❌ Feed error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/api/post/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const objectId = new ObjectId(id); // This is the author's ID
    const posts = await feedCollection.find({ author: objectId }).toArray();

    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        let authorInfo = null;

        try {
          const author = await accountsCollection.findOne({ _id: objectId });
          authorInfo = author ? { username: author.username } : null;
        } catch (err) {
          authorInfo = null;
        }

        return { ...post, author: authorInfo };
      })
    );

    res.json(enrichedPosts);
  } catch (error) {
    console.error('❌ Posts error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});


app.get('/api/feed/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await feedCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    let authorInfo = null;
    try {
      const authorObjectId = new ObjectId(post.author);
      const author = await accountsCollection.findOne({ _id: authorObjectId });
      authorInfo = author ? { username: author.username } : null;
    } catch (err) {
      // Invalid ObjectId — skip author enrichment
      authorInfo = null;
    }

    res.json({ ...post, author: authorInfo });
  } catch (error) {
    console.error('❌ Post error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Upload post
app.post('/api/upload', async (req, res) => {
  const { author, title, desc, image_uri, createdAt } = req.body;

  if (!author || !title || !desc) {
    return res.status(400).json({ message: 'Title, content, and author are required' });
  }

  try {
    const post = {
      author: new ObjectId(author), // Convert author to ObjectId
      title,
      desc,
      image_uri,
      createdAt: new Date(),
    };

    await feedCollection.insertOne(post);
    res.status(201).json({ message: 'Post uploaded successfully', title });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.delete('/api/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await feedCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
