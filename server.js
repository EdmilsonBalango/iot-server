const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { default: db, client } = require('./DBconnection');

const hostname = process.env.HOSTNAME || '127.0.0.1'
const port = process.env.PORT || 3001
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(morgan('combined'));


async function getData(table) {
    const devices = client.db('IOT').collection(table).find().toArray((err, result) => {
        if (err) throw err;
        return result;
    });
    return devices;
}

//route to get all data from a devices from the table
app.get('/', async (req, res) => {
    const received = req.body.table;
    const data = await getData(received);
    res.status(200).json({server: 'Ok', data});
});

//route to insert data into the table
app.post('/insertData', async (req, res) => {
    const data = req.body;
    await client.db('IOT').collection("sensors").insertOne(data).then(result =>{
        res.status(200).json({server: result.insertedId});
    })
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});