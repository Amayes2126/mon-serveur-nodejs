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
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <title>Suivi Tank de Lait</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f8f9fa;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #2c3e50;
        }
        .tank {
          margin: 20px auto;
          width: 200px;
          height: 300px;
          position: relative;
        }
        .tank svg {
          width: 100%;
          height: 100%;
        }
        .info {
          margin-top: 20px;
          font-size: 1.2em;
          color: #333;
        }
        .label {
          font-weight: bold;
          color: #444;
        }
        footer {
          margin-top: 40px;
          color: #999;
        }
      </style>
      <script>
        setTimeout(() => {
          location.reload();
        }, 5000);
      </script>
    </head>
    <body>
      <h1>Suivi du Tank de Lait 🥛</h1>

      <div class="tank">
        <svg viewBox="0 0 100 200">
          <!-- Tank border -->
          <rect x="10" y="10" width="80" height="180" fill="#ccc" stroke="#333" stroke-width="4" rx="10" ry="10"/>
          <!-- Niveau de lait -->
          <rect x="10" y="${190 - ((lastData.niveau || 0) * 1.8)}" width="80" height="${(lastData.niveau || 0) * 1.8}" fill="#aee9f5" rx="10" ry="10"/>
          <text x="50" y="100" dominant-baseline="middle" text-anchor="middle" fill="#333" font-size="16">
            ${(lastData.niveau || 0).toFixed(1)}%
          </text>
        </svg>
      </div>

      <div class="info">
        <p><span class="label">Température :</span> ${(lastData.temperature || 0).toFixed(1)} °C</p>
        <p><span class="label">pH :</span> ${(lastData.ph || 0).toFixed(2)}</p>
        <p><span class="label">Niveau :</span> ${(lastData.niveau || 0).toFixed(1)}%</p>
      </div>

      <footer>Actualisation automatique toutes les 5 secondes</footer>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Serveur en écoute sur http://localhost:${port}`);
});
