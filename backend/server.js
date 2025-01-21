const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Vendosja e bazës së të dhënave dhe rezervës
const MAIN_DB = './backend/db.json';
const BACKUP_DB = './backend/backup.json';

// Middleware për trajtimin e JSON-it
app.use(express.json());

// Shërbimi i skedarëve të front-end-it
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint për marrjen e rezervimeve
app.get('/api/reservations', (req, res) => {
    fs.readFile(MAIN_DB, (err, data) => {
        if (err) return res.status(500).send('Gabim në server.');
        res.status(200).send(JSON.parse(data));
    });
});

// Endpoint për shtimin e rezervimeve
app.post('/api/reservations', (req, res) => {
    const reservation = req.body;

    fs.readFile(MAIN_DB, (err, data) => {
        if (err) return res.status(500).send('Gabim në server.');

        const reservations = JSON.parse(data);
        reservations.push(reservation);

        // Ruajtja në bazën kryesore
        fs.writeFile(MAIN_DB, JSON.stringify(reservations, null, 2), (err) => {
            if (err) {
                console.error('Gabim gjatë ruajtjes në db.json:', err);
                return res.status(500).send('Gabim gjatë ruajtjes.');
            }
        
            console.log('Rezervimi u ruajt me sukses:', reservation);
            res.status(201).json({ message: 'Rezervimi u ruajt me sukses!' });
        });
        
    });
});

// Funksion për ruajtjen në rezervë
function saveToBackup(reservations) {
    fs.writeFile(BACKUP_DB, JSON.stringify(reservations, null, 2), (err) => {
        if (err) console.error('Gabim gjatë ruajtjes në rezervë:', err);
    });
}

// Startimi i serverit
app.listen(PORT, () => {
    console.log(`Serveri po funksionon në http://localhost:${PORT}`);
});
