const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'jobs';
let db;

async function connect() {
  if (db) return db;
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

async function getJobById(id) {
  const database = await connect();
  try {
    const collection = database.collection('jobs');
    const objId = new ObjectId(id);
    const job = await collection.findOne({ _id: objId });
    return job;
  } catch (err) {
    console.error('Error fetching job by id', err);
    return null;
  }
}

module.exports = { getJobById };
