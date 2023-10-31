const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use('/logs', express.static('logs'));

app.all('*', (req, res) => {
    const id = uuidv4();
    const logData = {
        url: req.baseUrl + req.url,
        headers: req.headers,
        body: req.body,
        query: req.query,
    };
    if(req.url.startsWith('/logs')) {
    } else {
        fs.writeFile(`./logs/${id}.json`, JSON.stringify(logData, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({"status": "Bad Request", "message": "Error while logging request"});
            } else {
                res.json({
                    "status": "success",
                    "id": id,
                    "url": `http://localhost:3000/logs/${id}.json`,
                    "message": "Request logged successfully"
                });
            }
        });
    }
});

app.listen(3000, () => console.log('Server is running on port 3000'));