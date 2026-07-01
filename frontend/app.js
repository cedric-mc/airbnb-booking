// Charger tous les logements au démarrage
document.addEventListener('DOMContentLoaded', () => {
    rechercherLogements();
});

async function rechercherLogements() {
    const ville = document.getElementById('search-ville').value;
    const url = ville ? `/api/logements?ville=${encodeURIComponent(ville)}` : '/api/logements';

    try {
        const response = await fetch(url);
        const logements = await response.json();
        const listContainer = document.getElementById('logements-list');
        listContainer.innerHTML = '';

        if (logements.length === 0) {
            listContainer.innerHTML = '<p>Aucun logement trouvé pour cette destination.</p>';
            return;
        }

        logements.forEach(logement => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${logement.titre}</h3>
                <p>${logement.description}</p>
                <p><strong>Ville :</strong> ${logement.ville}</p>
                <p class="price">${logement.prix_par_nuit} € / nuit</p>
                <button onclick="ouvrirModal(${logement.id})">Réserver</button>
            `;
            listContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des logements:', error);
    }
}

function ouvrirModal(id) {
    document.getElementById('form-logement-id').value = id;
    document.getElementById('reservation-section').classList.remove('hidden');
}

function fermerModal() {
    document.getElementById('reservation-section').classList.add('hidden');
    document.getElementById('reservation-form').reset();
}

async function soumettreReservation(event) {
    event.preventDefault();
    const logement_id = document.getElementById('form-logement-id').value;
    const nom_client = document.getElementById('form-nom').value;
    const date_debut = document.getElementById('form-debut').value;
    const date_fin = document.getElementById('form-fin').value;

    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logement_id, nom_client, date_debut, date_fin })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Réservation réussie ! Prix total : ${data.prix_total} €`);
            fermerModal();
        } else {
            alert(`Erreur : ${data.error}`);
        }
    } catch (error) {
        alert('Impossible d\'enregistrer la réservation.');
    }
}