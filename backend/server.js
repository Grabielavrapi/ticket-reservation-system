const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise'); // Use mysql2 for async queries
const app = express();
const PORT = 3000;

// MySQL Database Configuration
const dbConfig = {
    host: 'localhost', // MySQL server address
    user: 'root',      // MySQL user
    password: 'root',  // MySQL password
    database: 'mydb',  // MySQL database name
};
app.locals.dbConfig = dbConfig;
// Chaos Monkey middleware
const enableChaosMonkey = process.env.CHAOS_MONKEY === 'true'; // Aktivizo Chaos Monkey nga environment
app.use((req, res, next) => {
    if (enableChaosMonkey && Math.random() < 0.3) { // 30% mundësi për të simuluar gabim
        console.error('Chaos Monkey activated: Simulating a server error.');
        return res.status(500).json({ message: 'Simulated server error by Chaos Monkey.' });
    }
    next();
});

// Middleware for parsing JSON
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint for fetching reservations
app.get('/api/reservations', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(app.locals.dbConfig);
        const [rows] = await connection.execute('SELECT * FROM rezervime');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error while fetching reservations:', err);
        res.status(500).json({ message: 'Gabim në server.' });
    } finally {
        if (connection) {
            await connection.end(); // Ensure the connection is closed
        }
    }
});

// Endpoint for creating reservations
app.post('/api/reservations', async (req, res) => {
    const { perdorues, email, eventi } = req.body;

    // Input validation
    if (!perdorues || !email || !eventi || !email.includes('@')) {
        return res.status(400).json({ message: 'Të dhëna të pavlefshme!' });
    }

    const queryMain = `INSERT INTO rezervime (perdorues, email, eventi) VALUES (?, ?, ?)`;
    const queryBackup = `INSERT INTO rezervime_rezerve (perdorues, email, eventi) VALUES (?, ?, ?)`;

    let connection;
    try {
        connection = await mysql.createConnection(app.locals.dbConfig);
        await connection.execute(queryMain, [perdorues, email, eventi]);
        res.status(201).json({ message: 'Rezervimi u ruajt në tabelën kryesore!' });
    } catch (error) {
        console.warn('Error in the main table, switching to the backup table:', error);

        try {
            connection = await mysql.createConnection(app.locals.dbConfig);
            await connection.execute(queryBackup, [perdorues, email, eventi]);
            res.status(201).json({ message: 'Rezervimi u ruajt në tabelën rezervë!' });
        } catch (backupError) {
            console.error('Error in the backup table:', backupError);
            res.status(500).json({ message: 'Error while saving the reservation in both tables.' });
        }
    } finally {
        if (connection) {
            await connection.end(); // Ensure the connection is closed
        }
    }
});

// Start the server only when it's the main module
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// Export the app for testing purposes
module.exports = app;
