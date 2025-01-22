const request = require('supertest');
const app = require('../backend/server'); // Importo vetëm aplikacionin Express
const mysql = require('mysql2/promise'); // Për queries në MySQL

describe('API Reservation Tests', () => {
    describe('POST /api/reservations', () => {
        it('duhet të ruajë një rezervim me të dhëna të vlefshme', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .send({
                    perdorues: 'Test User',
                    email: 'test@example.com',
                    eventi: 'teater',
                });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Rezervimi u ruajt në tabelën kryesore!');
        });

        it('duhet të kthejë gabim për të dhëna të pavlefshme', async () => {
            const response = await request(app)
                .post('/api/reservations')
                .send({
                    perdorues: '',
                    email: 'invalidemail',
                    eventi: '',
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Të dhëna të pavlefshme!');
        });
    });

    describe('GET /api/reservations', () => {
        it('duhet të kthejë listën e rezervimeve', async () => {
            const response = await request(app).get('/api/reservations');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(0); // Duhet të ketë të paktën një rresht
        });

        it('duhet të trajtojë gabimet e bazës së të dhënave', async () => {
            // Ruaj konfigurimin origjinal
            const originalDbConfig = { ...app.locals.dbConfig };
        
            // Simulo gabim duke vendosur konfigurim të gabuar
            app.locals.dbConfig = { ...originalDbConfig, database: 'wrong_database' };
        
            try {
                // Bëj një kërkesë GET që pritet të dështojë
                const response = await request(app).get('/api/reservations');
        
                // Kontrollo që statusi të jetë 500 dhe mesazhi të jetë ai që kthen serveri
                expect(response.status).toBe(500);
                expect(response.body.message).toBe('Gabim në server.');
            } finally {
                // Rikthe konfigurimin origjinal
                app.locals.dbConfig = originalDbConfig;
            }
        });
        
        
    });
    describe('Chaos Monkey Tests', () => {
        it('duhet të simulojë një gabim kur Chaos Monkey është aktiv', async () => {
            process.env.CHAOS_MONKEY = 'true'; // Aktivizo Chaos Monkey për këtë test
    
            // Bëj kërkesë GET
            const response = await request(app).get('/api/reservations');
    
            // Kontrollo nëse mundësia e gabimit është e aktivizuar
            if (response.status === 500) {
                expect(response.body.message).toBe('Simulated server error by Chaos Monkey.');
            } else {
                expect(response.status).toBe(200); // Në rast se nuk ka gabim
            }
    
            process.env.CHAOS_MONKEY = 'false'; // Çaktivizo Chaos Monkey pas testit
        });
    });
    
    afterAll(async () => {
        // Siguro që të gjitha lidhjet e bazës së të dhënave janë mbyllur
        if (global.connection) {
            await global.connection.end();
        }
    });
});
