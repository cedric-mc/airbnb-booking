const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Configuration de la connexion PostgreSQL (variables injectées via Docker)
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'airbnb',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// Endpoint de santé (Healthcheck)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// GET /api/logements (avec option de filtre par ville)
app.get('/api/logements', async (req, res) => {
  const { ville } = req.query;
  try {
    let result;
    if (ville) {
      result = await pool.query('SELECT * FROM logements WHERE LOWER(ville) = LOWER($1)', [ville]);
    } else {
      result = await pool.query('SELECT * FROM logements');
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations (Ajout d'une réservation avec calcul du prix total)
app.post('/api/reservations', async (req, res) => {
  const { logement_id, nom_client, date_debut, date_fin } = req.body;
  try {
    // 1. Récupérer le prix par nuit du logement
    const logementRes = await pool.query('SELECT prix_par_nuit FROM logements WHERE id = $1', [logement_id]);
    if (logementRes.rows.length === 0) {
      return res.status(444).json({ error: 'Logement introuvable' });
    }

    const prixParNuit = logementRes.rows[0].prix_par_nuit;

    // 2. Calculer le nombre de nuits
    const debut = new Date(date_debut);
    const fin = new Date(date_fin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début' });
    }

    const prixTotal = diffDays * prixParNuit;

    // 3. Insérer la réservation
    const newReservation = await pool.query(
      'INSERT INTO reservations (logement_id, nom_client, date_debut, date_fin, prix_total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [logement_id, nom_client, date_debut, date_fin, prixTotal]
    );

    res.status(201).json(newReservation.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API démarrée sur le port ${PORT}`);
});