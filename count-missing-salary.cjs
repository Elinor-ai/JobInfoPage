// count-missing-salary.js
const { MongoClient, ReadPreference } = require("mongodb");

// const uri =  "mongodb+srv://jobs:yRN2Atm27RLdZ1cV@jobs-v2.oo6rx.mongodb.net/?retryWrites=true&appName=Jobs"
const uri =  "mongodb+srv://jobs:yRN2Atm27RLdZ1cV@jobs-v2.oo6rx.mongodb.net/?retryWrites=true&appName=Jobs"
const dbName = "botson";
const collName =  "elinor_jobs";


const now = new Date();
const oneMonthAgo = new Date(now)
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 24)

const filter = {
  status: "ready",
  $or: [
    { "job_metadata_v2._salary": "cant_determine" },
    { "job_metadata_v2._salary": { $exists: false } },
    { "job_metadata_v2._salary": null },
    { "job_metadata_v2._salary": "" }
  ],
  "job_metadata_v2._benefits": {$exists:false},
  // date_posted: {$gte: oneMonthAgo, $lte : now }
};


async function main() {
  console.log('main')
  const client = new MongoClient(uri, {
    // Offload from primary if you can read from secondaries:
    readPreference: ReadPreference.secondaryPreferred,
    // Longer socket/timeout limits than Compass defaults:
    connectTimeoutMS: 60_000,
    socketTimeoutMS: 300_000,
    serverSelectionTimeoutMS: 60_000,
  });



  await client.connect();
  const col = client.db(dbName).collection(collName);
  console.log('connect')

  // Exact count with generous maxTimeMS
  const missing = await col.countDocuments(filter, { maxTimeMS: 300_000 });

  console.log('missing')


  const totalReady = await col.countDocuments({ status: "ready" }, { maxTimeMS: 300_000 });
      console.log('totalReady')


  console.log({
    missing,
  });

  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
