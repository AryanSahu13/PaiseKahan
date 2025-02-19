document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as the minimum and default value for the date input field
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', today);
    dateInput.setAttribute('value', today);
});

document.getElementById('depositForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the default form submission

    const form = event.target;
    const amountInNumbers = parseFloat(form.amountInNumbers.value);
    const totalAmount = parseFloat(form.totalAmount.value);
    const accountNumber = form.accountNumber.value.trim();
    const panNumber = form.panNumber.value.trim();
    const amountInWords = form.amountInWords.value.trim();
    const date = new Date(form.date.value);
    const today = new Date();

    // Basic validation
    if (isNaN(amountInNumbers) || isNaN(totalAmount)) {
        alert('Amount fields must be valid numbers.');
        return;
    }

    if (amountInNumbers <= 0 || totalAmount <= 0) {
        alert('Amount fields must be greater than zero.');
        return;
    }

    if (amountInNumbers !== totalAmount) {
        alert('Amount in Numbers and Total Amount must match.');
        return;
    }

    if (!/^[a-zA-Z0-9]{10,12}$/.test(accountNumber)) {
        alert('Account Number must be alphanumeric and 10 to 12 characters long.');
        return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
        alert('PAN Number must be in the format ABCDE1234F.');
        return;
    }

    if (!isNaN(amountInWords)) {
        alert('Amount in Words must not be an integer.');
        return;
    }

    if (date.toISOString().split('T')[0] !== today.toISOString().split('T')[0]) {
        alert('Date must be today.');
        return;
    }

    // Convert form data to URLSearchParams
    const formData = new URLSearchParams(new FormData(this)).toString();
    console.log('Form Data:', formData);

    fetch('/api/deposit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Deposit received') {
            alert('Deposit successful!');
            form.reset(); // Clear form fields
            window.location.href = '/views/home.html'; // Redirect to home.html
        } else {
            alert('Submission failed: ' + (data.message || 'Unknown error'));
        }
        console.log(data);
    })
    .catch(error => {
        alert('Error submitting deposit');
        console.error('Error:', error);
    });
});
