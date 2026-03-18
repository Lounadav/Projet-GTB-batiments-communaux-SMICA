document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. BASE DE DONNÉES SIMULÉE
    // ==========================================
    const db_utilisateurs = [
        { email: "admin@smica.fr", mdp: "1234", role: "admin", nom: "Admin SMICA", batiments_autorises: [1, 2] },
        { email: "resp@mairie.fr", mdp: "1234", role: "responsable", nom: "Resp Mairie", batiments_autorises: [1, 2] },
        { email: "elu@smica.fr", mdp: "1234", role: "utilisateur", nom: "Maire de Rodez", batiments_autorises: [1] }
    ];

    const db_batiments = [
        { id: 1, nom: "Mairie Rodez" },
        { id: 2, nom: "Lycée Charles Carnus" }
    ];

    const db_pieces = [
        { id: 1, batiment_id: 1, nom: "Salle du Conseil" },
        { id: 2, batiment_id: 1, nom: "Bureau du Maire" },
        { id: 3, batiment_id: 2, nom: "Classe Ciel" },
        { id: 4, batiment_id: 2, nom: "Foyer" }
    ];

    const db_mesures = {
        1: { temp: 22.5, consigne: 20, air: 450, chauffage: false, historique: [20, 21, 21.5, 22, 22.3, 22.5] },
        2: { temp: 21.0, consigne: 22, air: 410, chauffage: true, historique: [19, 19.5, 20, 20.5, 21, 21] },
        3: { temp: 19.5, consigne: 21, air: 600, chauffage: true, historique: [18, 18.5, 19, 19.2, 19.4, 19.5] },
        4: { temp: 20.2, consigne: 19, air: 350, chauffage: false, historique: [20, 20, 20.1, 20.2, 20.2, 20.2] }
    };

    let myChart = null;

    // ==========================================
    // 2. PAGE DE CONNEXION ET DOUBLE AUTH
    // ==========================================
    
    // Si tu appelles forcerConnexion(event) depuis ton HTML (ex: onclick="forcerConnexion(event)"), 
    // on la rend disponible globalement ici en utilisant la bonne base de données.
    window.forcerConnexion = function(event) {
        // 1. On bloque le rechargement de la page qui vide tout
        event.preventDefault(); 
        
        // 2. On récupère ce que tu as tapé
        const emailSaisi = document.getElementById('username').value.trim();
        const mdpSaisi = document.getElementById('password').value.trim();

        // 3. On vérifie si l'utilisateur existe dans notre base principale
        const utilisateurTrouve = db_utilisateurs.find(u => u.email === emailSaisi && u.mdp === mdpSaisi);

        if (utilisateurTrouve) {
            // 4. On sauvegarde les infos dans le navigateur
            localStorage.setItem('userEmail', utilisateurTrouve.email);
            localStorage.setItem('userRole', utilisateurTrouve.role);
            localStorage.setItem('userNom', utilisateurTrouve.nom);
            
            // 5. On t'envoie de force vers la double authentification !
            window.location.href = 'double-auth.html';
        } else {
            alert("Identifiant ou mot de passe incorrect ! (Essayez avec elu@smica.fr et 1234)");
        }
    };

    // On attache aussi cette logique au formulaire s'il est soumis par la touche "Entrée"
    const formConnexion = document.querySelector('.login-card form');
    if (formConnexion) {
        formConnexion.addEventListener('submit', window.forcerConnexion);
    }

    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        const btnAuth = authCard.querySelector('button');
        if (btnAuth) {
            btnAuth.addEventListener('click', function(event) {
                event.preventDefault();
                const role = localStorage.getItem('userRole');
                if (role === 'admin') window.location.href = 'Visualisation-Modif_ajout.html';
                else if (role === 'responsable') window.location.href = 'Visualisation-Modif.html';
                else window.location.href = 'Visualisation_only.html';
            });
        }
        const cases = authCard.querySelectorAll('.code-box');
        cases.forEach((c, i) => {
            c.addEventListener('input', () => { if (c.value.length === 1 && i < cases.length - 1) cases[i + 1].focus(); });
            c.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && c.value === '' && i > 0) cases[i - 1].focus(); });
        });
    }

    // ==========================================
    // 3. PAGES DE VISUALISATION (MULTI-PIÈCES COMPACT)
    // ==========================================
    const selBat = document.getElementById('select-batiment');
    const dynamicRooms = document.getElementById('dynamic-rooms');

    if (selBat && dynamicRooms) {
        const userEmail = localStorage.getItem('userEmail');
        const userNom = localStorage.getItem('userNom');
        const userRole = localStorage.getItem('userRole');

        if (!userEmail) { window.location.href = 'Connexion.html'; return; }

        const greet = document.querySelector('.user-greeting-text, .greeting');
        if (greet) greet.textContent = `Bonjour, ${userNom}`;

        // Initialisation Graphique
        const ctx = document.getElementById('tempChart');
        if (ctx && typeof Chart !== 'undefined') {
            myChart = new Chart(ctx, {
                type: 'line',
                data: { labels: ['10h', '11h', '12h', '13h', '14h', '15h'], datasets: [] },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 10 } } },
                    scales: { x: { grid: { display: false } } } 
                }
            });
        }

        // Génération des pièces
        function renderRooms(bId) {
            const rooms = db_pieces.filter(p => p.batiment_id === bId);
            dynamicRooms.innerHTML = '';

            if(rooms.length === 0) {
                dynamicRooms.innerHTML = '<p style="text-align:center; color: white;">Aucune pièce trouvée pour ce bâtiment.</p>';
                if(myChart) { myChart.data.datasets = []; myChart.update(); }
                return;
            }

            rooms.forEach(room => {
                const data = db_mesures[room.id] || { temp: '--', consigne: '--', air: '--', chauffage: false };
                
                let html = `
                <div class="room-block" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed rgba(255,255,255,0.3);">
                    <h2 style="text-align:center; color: var(--primary-orange, #b85b31); margin-bottom: 15px; font-size: 1.3rem; text-transform: uppercase; letter-spacing: 1px;">${room.nom}</h2>
                    <div class="widgets-container">
                `;

                if (userRole === 'utilisateur') {
                    // Visu Only : Pas de modification
                    html += `
                        <div class="widget-box dark-widget">
                            <h2>Température</h2>
                            <p style="font-size: 1.4rem; font-weight: bold; margin-top: 10px;">${data.temp} °C</p>
                        </div>
                        <div class="widget-box dark-widget">
                            <h2>Qualité de l'air</h2>
                            <p style="font-size: 1.4rem; font-weight: bold; margin-top: 10px;">${data.air} µg/m³</p>
                        </div>
                    `;
                } else {
                    // Admin & Responsable : Avec réglages
                    html += `
                        <div class="widget-box dark-widget">
                            <h2>Température</h2>
                            <div class="temp-display" style="margin-top: 10px;">
                                <p style="font-size: 1.2rem;">${data.temp} °C</p>
                                <input type="number" step="0.5" class="temp-input" data-piece-id="${room.id}" value="${data.consigne}">
                            </div>
                        </div>
                        <div class="widget-box middle-widget">
                            <h2>Chauffage</h2>
                            <div class="toggle-switch ${data.chauffage ? 'active' : ''}" data-piece-id="${room.id}">
                                <div class="toggle-circle"></div>
                            </div>
                        </div>
                        <div class="widget-box dark-widget">
                            <h2>Qualité de l'air</h2>
                            <p style="font-size: 1.2rem; font-weight: bold; margin-top: 10px;">${data.air} µg/m³</p>
                        </div>
                    `;
                }

                html += `</div></div>`;
                dynamicRooms.innerHTML += html;
            });

            // Attacher les événements aux nouveaux boutons
            if (userRole !== 'utilisateur') {
                document.querySelectorAll('.temp-input').forEach(input => {
                    input.addEventListener('change', function() {
                        const pId = parseInt(this.getAttribute('data-piece-id'));
                        const consigne = parseFloat(this.value);
                        if (!isNaN(consigne) && pId) {
                            db_mesures[pId].consigne = consigne;
                            db_mesures[pId].chauffage = (db_mesures[pId].temp < consigne);
                            renderRooms(bId); 
                        }
                    });
                });

                document.querySelectorAll('.toggle-switch').forEach(toggle => {
                    toggle.addEventListener('click', function() {
                        const pId = parseInt(this.getAttribute('data-piece-id'));
                        if (pId) {
                            db_mesures[pId].chauffage = !db_mesures[pId].chauffage;
                            renderRooms(bId);
                        }
                    });
                });
            }

            // Mise à jour du graphique multi-lignes
            if (myChart) {
                const colors = ['#b85b31', '#2196f3', '#4caf50', '#9c27b0'];
                myChart.data.datasets = rooms.map((room, idx) => {
                    const hist = db_mesures[room.id] ? db_mesures[room.id].historique : [0,0,0,0,0,0];
                    return {
                        label: room.nom,
                        data: hist,
                        borderColor: colors[idx % colors.length],
                        backgroundColor: colors[idx % colors.length] + '33',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2
                    };
                });
                myChart.update();
            }
        }

        // Remplissage menu bâtiment
        const user = db_utilisateurs.find(u => u.email === userEmail);
        
        // Sécurité supplémentaire : si l'utilisateur n'est pas trouvé (ex: cache corrompu)
        if(user) {
            const autorises = db_batiments.filter(b => user.batiments_autorises.includes(b.id));

            selBat.innerHTML = '<option value="">Choisir un bâtiment</option>';
            autorises.forEach(b => {
                const opt = document.createElement('option'); opt.value = b.id; opt.textContent = b.nom; selBat.appendChild(opt);
            });

            selBat.addEventListener('change', () => {
                const bId = parseInt(selBat.value);
                if (!isNaN(bId)) renderRooms(bId);
                else { dynamicRooms.innerHTML = ''; if(myChart) { myChart.data.datasets = []; myChart.update(); } }
            });

            if (autorises.length > 0) {
                selBat.value = autorises[0].id;
                renderRooms(autorises[0].id);
            }
        }
    }

    // ==========================================
    // 4. BOUTONS D'ACTION JS
    // ==========================================
    const boutonsAction = document.querySelectorAll('.btn-action');
    if (boutonsAction.length > 0) {
        boutonsAction.forEach(bouton => {
            bouton.addEventListener('click', function(event) {
                event.preventDefault();
                const texteBouton = this.textContent.trim().toLowerCase();
                if (texteBouton.includes('batiment') || texteBouton.includes('bâtiment')) {
                    window.location.href = 'ajout_batiment.html';
                } else if (texteBouton.includes('capteur')) {
                    window.location.href = 'ajout_capteur.html';
                }
            });
        });
    }

    document.querySelectorAll('.logout-icon').forEach(icon => {
        icon.addEventListener('click', () => { localStorage.clear(); window.location.href = 'Connexion.html'; });
    });
});