const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var serveIndex = require('serve-index');

const app = express();

// Variables
let domain = `https://reqlog.someserver.nl`;
let port = 80;

app.use(express.json());
app.use('/logs', express.static('logs'));
app.use('/logs', serveIndex (__dirname + '/logs'));

app.all('*', (req, res) => {
    let date_time = new Date();
    // let date = ("0" + date_time.getDate()).slice(-2);
    // let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // let year = date_time.getFullYear();
    // let hours = ("0" + (date_time.getHours())).slice(-2);
    // let minutes = ("0" + (date_time.getMinutes())).slice(-2);
    // let seconds = ("0" + (date_time.getSeconds())).slice(-2);
    let timestammp = `${("0" + date_time.getDate()).slice(-2)}-${("0" + (date_time.getMonth() + 1)).slice(-2)}-${date_time.getFullYear()}-${("0" + (date_time.getHours())).slice(-2)}:${("0" + (date_time.getMinutes())).slice(-2)}:${("0" + (date_time.getSeconds())).slice(-2)}`
    const iid = uuidv4();
    const id = `${timestammp}-${iid}`;
    const logData = {
        url: domain + req.url,
        headers: req.headers,
        body: req.body,
        query: req.query,
    };
    if(req.url.startsWith('/logs')) {
    } else {
        if (!fs.existsSync("./logs")){
            fs.mkdirSync("./logs");
            console.log("directory created")
        }
        
        fs.writeFile(`./logs/${id}.json`, JSON.stringify(logData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({"status": "Bad Request", "message": "Error while logging request"});
            } else {
                res.json({
                    "status": "success",
                    "id": id,
                    "url": `${domain}/logs/${id}.json`,
                    "message": "Request logged successfully"
                });
                console.log("request processed")
            }
        });
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));