-- db/init.sql

-- Suppression des tables si elles existent pour repartir sur du propre
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS logements;

-- Création de la table logements avec la colonne type
CREATE TABLE logements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    ville VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Appartement, Maison, Chambre
    prix_par_nuit NUMERIC(10, 2) NOT NULL,
    capacite INT NOT NULL
);

-- Création de la table reservations
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    logement_id INT REFERENCES logements(id) ON DELETE CASCADE,
    nom_client VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    prix_total NUMERIC(10, 2) NOT NULL
);

-- Insertion d'un jeu de données riche et varié (10 logements)
INSERT INTO logements (titre, description, ville, type, prix_par_nuit, capacite) VALUES
('Bel appartement vue Tour Eiffel', 'Un magnifique studio lumineux proche du centre historique.', 'Paris', 'Appartement', 120.00, 2),
('Chambre romantique Marais', 'Chambre chaleureuse chez l''habitant au cœur du Marais.', 'Paris', 'Chambre', 55.00, 1),
('Duplex moderne Canal St-Martin', 'Grand duplex idéal pour les groupes d''amis ou familles.', 'Paris', 'Appartement', 185.00, 5),
('Studio cosy Vieux Port', 'Idéal pour un week-end en amoureux au bord de l''eau.', 'Marseille', 'Appartement', 75.00, 2),
('Maison de pêcheur Estaque', 'Maison typique avec terrasse ombragée et vue sur mer.', 'Marseille', 'Maison', 140.00, 4),
('Villa contemporaine avec piscine', 'Grande maison familiale tout confort avec grand jardin.', 'Lyon', 'Maison', 250.00, 8),
('Loft industriel Confluence', 'Design moderne et épuré à proximité des commerces.', 'Lyon', 'Appartement', 110.00, 3),
('Chambre calme Presqu''île', 'Lit king-size dans un appartement bourgeois très calme.', 'Lyon', 'Chambre', 45.00, 2),
('Échoppe bordelaise avec patio', 'Charme de l''ancien avec un superbe espace extérieur.', 'Bordeaux', 'Maison', 160.00, 4),
('Studio branché St-Pierre', 'Parfait pour découvrir la ville à pied ou en tram.', 'Bordeaux', 'Appartement', 70.00, 2);

-- Insertion de quelques réservations initiales pour simuler l'activité
INSERT INTO reservations (logement_id, nom_client, date_debut, date_fin, prix_total) VALUES
(1, 'Alice Dupont', '2026-07-10', '2026-07-15', 600.00),
(4, 'Bob Martin', '2026-07-05', '2026-07-08', 225.00),
(6, 'Charlie Renard', '2026-08-01', '2026-08-08', 1750.00);