const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

let lastData = {};

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
  lastData = req.body;
  console.log('Données reçues:', lastData);
  res.send({ status: 'OK', message: 'Données reçues' });
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Données ESP32</title></head>
      <body>
        <h1>Données reçues</h1>
        <pre>${JSON.stringify(lastData, null, 2)}</pre>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
