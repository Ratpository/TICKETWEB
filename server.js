// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleAuth } = require('google-auth-library');
const { Octokit } = require('@octokit/rest');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Google OAuth route
app.post('/api/google-auth', async (req, res) => {
  try {
    const auth = new GoogleAuth({
      credentials: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
      },
      scopes: ['https://www.googleapis.com/auth/userinfo.email'],
    });
    
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    
    // Get user info
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });
    
    res.json({ token, user: userInfo.data });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// GitHub API proxy
app.get('/api/github/tickets', async (req, res) => {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    
    const response = await octokit.repos.getContent({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: 'tickets.json',
      ref: 'main',
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

app.put('/api/github/tickets', async (req, res) => {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const { content, sha } = req.body;
    
    const response = await octokit.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: 'tickets.json',
      message: `Update tickets at ${new Date().toISOString()}`,
      content: Buffer.from(JSON.stringify(content)).toString('base64'),
      sha: sha,
      branch: 'main',
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'Failed to save tickets' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});