const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());


const uri = 'mongodb+srv://Sohan:Entrix123@cluster0.ztczrpi.mongodb.net/status?retryWrites=true&w=majority';
const dbName = 'battery';
const collectionName = 'percentage';

const devices = ['8BEBBFF643C6', 'C87BAAF79BEC', 'C50FC97C91E3', '2450378D18E9', '4D66CDFE31E7'];
const port = 3000;

app.post('/battery-status', async (req, res) => {
  const { op } = req.body;

  if (op === 'get_battery_status') {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      const latestBatteryStatus = await collection.find().sort({ _id: -1 }).limit(devices.length).toArray();

      const batteryStatusIST = latestBatteryStatus.map(status => ({
        device: status.device,
        batteryPercentage: status.batteryPercentage,
        timestamp: convertEpochToIST(status.timestamp)
      }));

      res.json(batteryStatusIST);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid operation' });
  }
});


// Converting Epoch to IST to get the response in IST after API call
function convertEpochToIST(epochTimestamp) {
  const date = new Date(epochTimestamp);
  const istTimestamp = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return istTimestamp;
}

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});


