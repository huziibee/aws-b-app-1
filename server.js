const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const history = require('connect-history-api-fallback');

const app = express();
const port = 3008;
app.use(express.static(path.resolve(__dirname, './AWS-APP'), { maxAge : '1y', etag: false}));
app.use(history());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './AWS-APP/Login/index.html'));
});

app.listen( process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
