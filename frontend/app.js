document.getElementById('reservation-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const eventSelected = document.getElementById('event').value;

    if (!name || !email || !email.includes('@') || !eventSelected) {
        Toastify({
            text: "Ju lutemi plotësoni të gjitha fushat me të dhëna të vlefshme!",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            duration: 3000
        }).showToast();
        submitButton.disabled = false;
        return;
    }

    const reservation = { name, email, event: eventSelected, date: new Date().toISOString() };

    fetch('/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Gabim gjatë ruajtjes së rezervimit.');
            }
            return response.json();
        })
        .then(data => {
            Toastify({
                text: data.message || "Rezervimi u ruajt me sukses!",
                backgroundColor: "linear-gradient(to right, #56ab2f, #a8e063)",
                duration: 3000
            }).showToast();
            fetchReservations();
        })
        .catch(error => {
            console.error(error);
            Toastify({
                text: "Gabim gjatë ruajtjes së rezervimit!",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
                duration: 3000
            }).showToast();
        })
        .finally(() => {
            submitButton.disabled = false;
        });
});

function fetchReservations() {
    fetch('/api/reservations')
        .then(response => response.json())
        .then(data => {
            const reservationsList = document.getElementById('reservations');
            reservationsList.innerHTML = '';
            data.forEach(reservation => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.textContent = `${reservation.name} rezervoi për ${reservation.event} më ${new Date(reservation.date).toLocaleString()}`;
                reservationsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Gabim gjatë marrjes së rezervimeve:', error);
        });
}

window.onload = fetchReservations;
