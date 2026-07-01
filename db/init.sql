CREATE TABLE IF NOT EXISTS logements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    ville VARCHAR(100) NOT NULL,
    prix_nuit DECIMAL(10,2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    capacite INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    logement_id INT REFERENCES logements(id),
    nom_client VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données de test
INSERT INTO logements (titre, description, ville, prix_nuit, type, capacite) VALUES
('Appartement cozy au centre de Paris', 'Bel appartement rénové à deux pas du Marais', 'Paris', 120, 'appartement', 4),
('Villa avec piscine à Nice', 'Magnifique villa avec vue sur la mer', 'Nice', 250, 'villa', 8),
('Studio moderne à Lyon', 'Studio parfait pour les déplacements pro', 'Lyon', 80, 'studio', 2),
('Loft industriel à Marseille', 'Ancienne usine réhabilitée', 'Marseille', 150, 'loft', 6),
('Chalet montagnard à Chamonix', 'Chalet authentique au pied des pistes', 'Chamonix', 180, 'chalet', 6);
