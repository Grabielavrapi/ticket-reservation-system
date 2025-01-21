const axios = require('axios');

test('GET /api/reservations duhet të kthejë një listë bosh fillimisht', async () => {
    const response = await axios.get('http://localhost:3000/api/reservations');
    expect(response.status).toBe(200);
    expect(response.data).toEqual([]);
});

test('POST /api/reservations duhet të ruajë një rezervim dhe ta kthejë me sukses', async () => {
    const reservation = { name: 'Test', email: 'test@example.com', event: 'kino', date: new Date().toISOString() };
    const postResponse = await axios.post('http://localhost:3000/api/reservations', reservation);
    expect(postResponse.status).toBe(201);

    const getResponse = await axios.get('http://localhost:3000/api/reservations');
    expect(getResponse.data).toContainEqual(expect.objectContaining(reservation));
});
