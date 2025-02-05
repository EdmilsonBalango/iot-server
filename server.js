import express from 'express';
import bodyparser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { client } from './DBconnection';

const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = process.env.PORT || 3001
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('combined'));


async function getData() {
    try {
        const devices = await client.db('IOT').collection("Devices").find().toArray();
        return devices;
    } catch (err) {
        throw err;
    }
}

//route to get all data from a devices from the table
app.get('/', async (req, res) => {
    const data = await getData();
    res.status(200).json(data);
});

//route to insert data into the table
app.post('/insertData', async (req, res) => {
    const data = req.body;
    await client.db('IOT').collection("Devices").insertOne(data).then(result =>{
        res.status(200).json({server: result.insertedId});
        console.log("Device sent something", result.insertedId);
    })
});
app.get('/getBasic', async (req, res) => {
    try {
        const result = await client.db('IOT').collection("Devices").find({ fPort: 100 }).project({ devEUI: 1, deviceName: 1, objectJSON: 1, publishedAt: 1 }).toArray();
        const processedData = result.map(log => ({
            _id: log._id,
            deviceName: log.deviceName,
            devEUI: log.devEUI,
            objectJSON: JSON.parse(log.objectJSON),
            publishedAt: log.publishedAt
        }));
        res.status(200).json(processedData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// app.get('/deleteAll', async (req, res) => {
//     await client.db('IOT').collection("Devices").deleteMany({}).then(result =>{
//         res.status(200).json({server: result.deletedCount});
//     })
// });
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});