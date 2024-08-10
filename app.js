

const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const path = require('path');

const app = express();



app.use(cors());

app.use(bodyParser.json({
    limit: '10000mb'
}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10000mb'
}));

app.use(express.urlencoded({ extended: true }));




app.use(express.static(__dirname + '/web/'));



app.get('*', (req, res) => res.sendFile(path.resolve('web/index.html')));




app.listen(7200, () => {
    console.log(`Server started on 7200`);
});