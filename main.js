let villeSelectionnee = ''; // Variable to hold the selected city

// Function to fetch the current date/time
async function time() {
    try {
        const response = await fetch('http://api.aladhan.com/v1/currentDate?zone=Africa/Tunis');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const dateElement = document.getElementById("date");
        dateElement.innerHTML = `
            <h1>Tunis</h1>
            <h3>${data.data}</h3>`;
    } catch (error) {
        console.error('Error with fetch operation:', error);
        document.getElementById("date").innerHTML = '<p>Error loading date</p>';
    }
}

// Function to load city options from JSON file
async function chargerVilles() {
    try {
        const response = await fetch('/villeTunis.json');
        if (!response.ok) throw new Error('Error fetching city data');
        
        const data = await response.json();
        const selectElement = document.getElementById('slects');
        selectElement.innerHTML = ""; // Clear previous options

        data.villes.forEach(ville => {
            const option = document.createElement('option');
            option.value = ville.nom;
            option.textContent = ville.nom;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', () => {
            villeSelectionnee = selectElement.value;
            console.log('Selected city:', villeSelectionnee);
            card(villeSelectionnee); // Call card with the selected city
        });

    } catch (error) {
        console.error('Error:', error);
        document.getElementById("slects").innerHTML = '<option>Error loading cities</option>';
    }
}


async function card(city) {
    try {
        const response = await fetch(`http://api.aladhan.com/v1/calendarByCity?country=TN&city=${city}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const timings = data.data[0].timings;
        const cardElement = document.getElementById("cards");
        cardElement.innerHTML = ""; // Clear previous content

        const prayerTimes = [
            { name: 'Fajr', time: timings.Fajr },
            { name: 'Sunrise', time: timings.Sunrise },
            { name: 'Dhuhr', time: timings.Dhuhr },
            { name: 'Asr', time: timings.Asr },
            { name: 'Maghrib', time: timings.Maghrib },
            { name: 'Isha', time: timings.Isha }
        ];

        prayerTimes.forEach(prayer => {
            cardElement.innerHTML += `
            <div class="card">
                <div class="h2">
                    <h2>${prayer.name}</h2>
                </div>
                <div class="p centr">
                    <p class="time">${prayer.time}</p>
                </div>
            </div>`;
        });

    } catch (error) {
        console.error('Error with fetch operation:', error);
        document.getElementById("cards").innerHTML = '<p>Error loading prayer timings</p>';
    }
}

// Initialize the app on page load
document.addEventListener('DOMContentLoaded', () => {
    chargerVilles();
    time(); // Load time when the page is ready
});
