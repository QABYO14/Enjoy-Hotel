// Show/hide E-mpesa details based on selection
const mpesaRadio = document.querySelector('input[value="mpesa"]');
const mpesaDetails = document.getElementById('mpesaDetails');
const cardRadio = document.querySelector('input[value="card"]');
if (mpesaRadio && mpesaDetails) {
    mpesaRadio.addEventListener('change', function() {
        if (this.checked) {
            mpesaDetails.style.display = 'block';
        }
    });
}
if (cardRadio && mpesaDetails) {
    cardRadio.addEventListener('change', function() {
        if (this.checked) {
            mpesaDetails.style.display = 'none';
        }
    });
}

// Booking form validation and result
const bookingForm = document.getElementById('bookingForm');
const bookingResult = document.getElementById('bookingResult');
const showBookingsBtn = document.getElementById('showBookings');
const allBookingsDiv = document.getElementById('allBookings');

function getBookings() {
    const data = localStorage.getItem('hotelBookings');
    return data ? JSON.parse(data) : [];
}
function saveBookings(bookings) {
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
}

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Get values
        const name = document.getElementById('name') ? document.getElementById('name').value.trim() : '';
        const date = document.getElementById('date') ? document.getElementById('date').value : '';
        const nights = document.getElementById('nights') ? document.getElementById('nights').value : '';
        const rooms = document.getElementById('rooms') ? document.getElementById('rooms').value : '';
        const paymentInput = document.querySelector('input[name="payment"]:checked');
        const payment = paymentInput ? paymentInput.value : '';
        const paidStatusInput = document.querySelector('input[name="paidStatus"]:checked');
        const paidStatus = paidStatusInput ? paidStatusInput.value : '';
        let mpesaNumber = '';
        if (payment === 'mpesa') {
            mpesaNumber = document.getElementById('mpesaNumber') ? document.getElementById('mpesaNumber').value.trim() : '';
        }
        let valid = true;
        let message = '';
        // Basic validation
        if (!name || !date || !nights || !rooms || !payment || !paidStatus || (payment === 'mpesa' && !mpesaNumber)) {
            valid = false;
            message = 'Please fill in all the important areas.';
        }
        let bookingData = { name, date, nights, rooms, payment, paidStatus };
        if (payment === 'mpesa') {
            bookingData.mpesaNumber = mpesaNumber;
        }
        if (valid) {
            // Calculate checkout date
            const checkinDate = new Date(date);
            const checkoutDate = new Date(checkinDate);
            checkoutDate.setDate(checkinDate.getDate() + parseInt(nights));
            const checkoutStr = checkoutDate.toISOString().split('T')[0];
            // Calculate total price
            const pricePerNight = 50;
            const total = pricePerNight * parseInt(rooms) * parseInt(nights);
            // Save to localStorage
            const bookings = getBookings();
            bookings.push(bookingData);
            saveBookings(bookings);
            // Receipt
            message = `<div id='receiptBox' style='border:2px solid #25D366;padding:1.2rem;border-radius:8px;background:#f6fff8;max-width:400px;margin:auto;'>
                <h3 style='color:#25D366;'>Booking Receipt</h3>
                <b>Name:</b> ${name} <br>
                <b>Rooms:</b> ${rooms} <br>
                <b>Check-in Date:</b> ${date} <br>
                <b>Check-out Date:</b> ${checkoutStr} <br>
                <b>Nights:</b> ${nights} <br>
                <b>Total Price:</b> $${total} <br>
                ${payment === 'mpesa' ? `<b>E-mpesa Number:</b> ${mpesaNumber} <br>` : ''}
                <b>Payment Status:</b> <span style='color:${paidStatus==='paid'?'green':'red'};font-weight:bold;'>${paidStatus==='paid'?'Paid':'Unpaid'}</span> <br>
                <div style='margin:1rem 0;'><button onclick='window.print()' style='background:#25D366;color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:5px;font-size:1rem;cursor:pointer;'>Print Receipt</button></div>
                <div style='color:#0077b6;font-weight:bold;'>Thank you! We look forward to your stay. You can print or screenshot this receipt.</div>
            </div>`;
            bookingForm.reset();
            if(mpesaDetails) mpesaDetails.style.display = 'none';
            bookingResult.innerHTML = message;
            bookingResult.scrollIntoView({behavior: 'smooth'});
        } else {
            bookingResult.textContent = message;
        }
    });
}

// Show all bookings
if (showBookingsBtn && allBookingsDiv) {
    showBookingsBtn.addEventListener('click', function() {
        const bookings = getBookings();
        if (bookings.length === 0) {
            allBookingsDiv.innerHTML = '<p>No bookings saved yet.</p>';
            return;
        }
        let html = '<h3>Saved Bookings</h3><ul style="padding:0;list-style:none;">';
        bookings.forEach((b, i) => {
            html += `<li style='margin-bottom:1rem;border-bottom:1px solid #eee;padding-bottom:0.7rem;'>
                <b>#${i+1}</b> - <b>Name:</b> ${b.name} <br>
                <b>Check-in:</b> ${b.date} <br>
                <b>Nights:</b> ${b.nights} <br>
                <b>Rooms:</b> ${b.rooms} <br>
                <b>Payment:</b> ${b.payment === 'card' ? 'Card Bank' : 'E-mpesa'} <br>
                ${b.payment === 'mpesa' && b.mpesaNumber ? `<b>E-mpesa Number:</b> ${b.mpesaNumber} <br>` : ''}
                <b>Payment Status:</b> <span style='color:${b.paidStatus==='paid'?'green':'red'};font-weight:bold;'>${b.paidStatus==='paid'?'Paid':'Unpaid'}</span> <br>
            </li>`;
        });
        html += '</ul>';
        allBookingsDiv.innerHTML = html;
    });
}
