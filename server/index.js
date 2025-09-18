// server/index.js

const express = require('express');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
// const { cookies } = require('next/headers');

const redisClient = require('../src/lib/redis');
const decider = require('../src/lib/decider');
const jobRepo = require('../src/lib/jobRepository');

const app = express();
app.use(express.json());
app.use(cookieParser());

async function setUserIdCookie(res, userId) {
  const oneYear = 1000 * 60 * 60 * 24 * 365;
  // const cookieStore = await cookies();
  // cookieStore.set({
  //   name: 'userId',
  //   value: userId,
  //   httpOnly: true,
  //   sameSite: 'lax',
  //   maxAge: oneYear,
  // })
  await res.cookie('userId', userId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: oneYear,
    // secure: process.env.NODE_ENV === 'production',
  });
}

// Generates or retrieves a userId from cookies and determines which design 
// variant a user should see. It delegates variant selection to a decider. 
// If the user has a varient in the cookie it retrives the varient

app.get('/decide', async (req, res) => {
  let userId = req.cookies?.userId
  console.log('userId', userId) 
  if(!userId) {
    console.log('Here')
    userId = uuidv4();
    await setUserIdCookie(res, userId);
  }

  const flow = req.query.flow || 'default';
  const metadata = req.query;
  const cacheKey = `variant:${userId}:${flow}`;

  console.log('cacheKey', cacheKey)

  let variant;

  try {
    if(redisClient && redisClient.isOpen){
      variant = await redisClient.get(cacheKey);
    }
  } catch (err){
    console.error('Redis get error', err)
  }

  if (!variant) {
    variant = await decider.getVariant(userId, flow, metadata);
    try {
      if (redisClient && redisClient.isOpen) {
        await redisClient.set(cacheKey, variant);
      }
    } catch (err) {
      console.error('Redis set error', err)
    }
  }

  console.log('variant', variant)

  res.json({ userId, flow, variant });

});

// Feteches a job document by ID from MongoDB and return it as JSON.
// The server sets up a middleware to read cookies and defines helpers to 
// set cookies and use environment variables for flexibility.

app.get('/job/:id', async (req, res) => {
  const id  = req.params.id;
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
