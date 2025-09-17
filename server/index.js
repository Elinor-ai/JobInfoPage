const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');

const redisClient = require('./redis');
const decider = require('./decider');
const jobRepo = require('./data/jobRepository');

const app = express();
app.use(express.json());
app.use(cookieParser());

function setUserIdCookie(res, userId) {
  const oneYear = 1000 * 60 * 60 * 24 * 365;
  res.cookie('userId', userId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: oneYear,
    // secure: process.env.NODE_ENV === 'production',
  });
}

app.get('/decide', async (req, res) => {
  try {
    let userId = req.cookies?.userId;
    if (!userId) {
      userId = uuidv4();
      setUserIdCookie(res, userId);
    }
    const { flow = 'default', ...metadata } = req.query;
    const variant = await decider.getVariant(userId, { flow, metadata });
    res.json({ userId, variant });
  } catch (err) {
    console.error('Error in /decide:', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/job/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobRepo.getJobById(id);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (err) {
    console.error('Error fetching job:', err);
    res.status(500).json({ message: 'Error fetching job' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
