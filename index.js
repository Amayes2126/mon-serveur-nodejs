const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser JSON
app.use(express.json());

// Stockage en mémoire des données reçues
let donnees = [];

// Route POST pour recevoir les données depuis l'ESP32
app.post('/api/data', (req, res) => {
    const { niveau, temperature, ph } = req.body;

    if (typeof niveau !== 'number' || typeof temperature !== 'number' || typeof ph !== 'number') {
        return res.status(400).json({ error: 'Données invalides' });
    }

    const timestamp = new Date().toISOString();

    const nouvelleDonnee = { niveau, temperature, ph, timestamp };

    // Stocke la donnée (par exemple, on garde seulement les 100 dernières)
    donnees.push(nouvelleDonnee);
    if (donnees.length > 100) donnees.shift();

    console.log('Données reçues :', nouvelleDonnee);

    res.status(200).json({ message: 'Données reçues avec succès' });
});

// Route GET pour afficher toutes les données reçues (JSON)
app.get('/api/data', (req, res) => {
    res.json(donnees);
});

// Optionnel : page web simple pour visualiser les données dans le navigateur
app.get('/', (req, res) => {
    let html = `<h1>Données recueillies</h1><ul>`;
    donnees.forEach(d => {
        html += `<li>${d.timestamp} - Niveau: ${d.niveau.toFixed(2)}%, Temp: ${d.temperature.toFixed(1)}°C, pH: ${d.ph.toFixed(1)}</li>`;
    });
    html += `</ul>`;
    res.send(html);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

