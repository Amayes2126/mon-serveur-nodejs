const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

let lastData = {};
let buzzerMuted = false;

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
  lastData = req.body;
  console.log('Données reçues:', lastData);
  buzzerMuted = false; // Remet à zéro après chaque nouvelle mesure
  res.send({ status: 'OK', message: 'Données reçues' });
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Suivi Tank de Lait</title>
  <style>
    body { font-family: Arial; text-align: center; margin: 40px; }
    .info { margin-top: 20px; }
    button { padding: 10px 20px; font-size: 16px; }
  </style>
  <script>
    function muteBuzzer() {
      fetch('/mute', { method: 'POST' })
      .then(r => r.json())
      .then(data => alert(data.message));
    }
    setTimeout(() => location.reload(), 5000);
  </script>
</head>
<body>
  <h1>Suivi Tank de Lait 🥛</h1>
  <p>Température : ${(lastData.temperature || 0).toFixed(1)} °C</p>
  <p>pH : ${(lastData.ph || 0).toFixed(2)}</p>
  <p>Niveau : ${(lastData.niveau || 0).toFixed(1)} %</p>
  <div class="info">
    <button onclick="muteBuzzer()">Désactiver le Buzzer</button>
  </div>
  <footer>Actualisation automatique toutes les 5 sec</footer>
</body>
</html>
  `);
});

// 🔵 Nouvelle route : mute le buzzer
app.post('/mute', (req, res) => {
  buzzerMuted = true;
  console.log('Buzzer désactivé à distance');
  res.send({ status: 'OK', message: 'Buzzer désactivé' });
});

// 🔵 Nouvelle route : donne le status du buzzer
app.get('/config', (req, res) => {
  res.json({ buzzerMuted });
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
