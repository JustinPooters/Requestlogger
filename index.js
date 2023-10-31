const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Variables
let domain = `https://reqlog.someserver.nl`;
let port = 80;

app.use(express.json());
app.use('/logs', express.static('logs'));

app.all('*', (req, res) => {
    const id = uuidv4();
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