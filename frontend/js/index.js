const API_BASE = "http://localhost:8080/api";

const API_URL_LISTING = `${API_BASE}/accommodations`;
const API_URL_LOGIN = `${API_BASE}/users/login`;
const API_URL_REGESTRATION = `${API_BASE}/users`;
const API_URL_BOOKING = `${API_BASE}/reservation`;

console.log(API_URL_LOGIN);
const USERBUTTON = document.getElementById("loggedUser");

document.addEventListener("DOMContentLoaded", loadOffers);

function loadOffers() {
    fetch(API_URL_LISTING)
        .then(res => res.json())
        .then(data => renderOffers(data));
}

function renderOffers(list) {
    const container = document.getElementById("offersContainer");
    container.innerHTML = "";

    list.forEach(o => {
        container.innerHTML += `
                <div class="col-md-4" data-bs-toggle="modal" data-bs-target="#bookingModal"  onclick="openBooking(${o.id},'${o.locationName}')">
                    <div class="card offer-card shadow-sm">
                        <img src="https://picsum.photos/seed/${o.id}/400/250" class="w-100" alt="Zdjęcie">
                        <div class="card-body">
                            <h5 class="card-title">${o.locationName}</h5>
                            <p class="card-text small text-muted">
                                ${o.rooms} pokoje • ${o.beds} miejsca do spania
                            </p>
                            <p>${o.description ?? ""}</p>
                            <p class="price-tag text-primary">${o.price} zł / noc</p>
                        </div>
                    </div>
                </div>
            `;
    });
}

function openBooking(accommodationId, locationName) {
    document.getElementById("bookingForm").dataset.accommodationId = accommodationId;
    document.getElementById("bookingForm").dataset.locationName = locationName;
}



// Obsługa dodawania nowej oferty
document.getElementById("addForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const newOffer = {
        locationName: locationName.value,
        beds: parseInt(beds.value),
        rooms: parseInt(rooms.value),
        description: description.value,
        price: parseFloat(price.value)
    };

    fetch(API_URL_LISTING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOffer)
    })
        .then(res => res.json())
        .then(() => {
            loadOffers();
            document.querySelector('#addModal .btn-close').click();
            this.reset();
        });
});

// Obsługa logowania
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const loginValue = document.getElementById("login").value;
    const passwordValue = document.getElementById("password").value;

    const login = {
        login: loginValue,
        password: passwordValue
    };

    fetch(API_URL_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login)
    }).then(async res => {
        if (!res.ok) {
            let text = await res.text();
            throw new Error(text || "Błąd logowania");
        }
        return res.json();
    }).then(user => {
        alert("Zalogowano jako: " + user.login);
        document.querySelector('#loginModal .btn-close').click();
        localStorage.setItem("user", JSON.stringify(user));
        // pokaż przycisk z nazwą użytkownika
        const userBtn = document.getElementById("loggedUser");
        userBtn.textContent = user.login;
        userBtn.classList.remove("d-none");

        // przejście na stronę konta po kliknięciu
        userBtn.onclick = () => {
            window.location.href = "user.html";
        };
        loadUser();
    }).catch(err => {
        alert("Błąd logowania: " + err.message);
    });
});

//Obsługa rejestracji
document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const loginValue = document.getElementById("loginR").value;
    const passwordValue = document.getElementById("passwordR").value;

    const register = {
        login: loginValue,
        password: passwordValue,
        privileges: false
    };

    fetch(API_URL_REGESTRATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(register)
    }).then(async res => {
        if (!res.ok) {
            let text = await res.text();
            throw new Error(text || "Błąd rejestracji");
        }
        return res.json();
    }).then(user => {
        alert("Zalogowano jako: " + user.login);
        document.querySelector('#registerModal .btn-close').click();
        // pokaż przycisk z nazwą użytkownika
        const userBtn = document.getElementById("loggedUser");
        userBtn.textContent = user.login;
        userBtn.classList.remove("d-none");

        // przejście na stronę konta po kliknięciu
        userBtn.onclick = () => {
            window.location.href = "user.html";
        };

        localStorage.setItem("user", JSON.stringify(user));
        loadUser();
    }).catch(err => {
        alert("Błąd rejestracji: " + err.message);
    });
});

//Obsługa bookowania
document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const d = new Date();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const accommodationId = this.dataset.accommodationId;
    const locationName = this.dataset.locationName;
    console.log(locationName);
    const userId = JSON.parse(localStorage.getItem("user")).id;
    const status = "CONFIRMED";
    const createdAt =
        d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");

    const booking = {
        startDate: startDate,
        endDate: endDate,
        accommodationId: accommodationId,
        userId: userId,
        status: status,
        createdAt: createdAt,
        locationName: locationName
    };

    fetch(API_URL_BOOKING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking)
    })
        .then(async res => {
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Błąd rezerwacji");
            }
            return res.json();
        })
        .then(saved => {
            console.log("Zapisano rezerwację:", saved);
            alert("Rezerwacja utworzona!");
            document.querySelector('#bookingModal .btn-close').click();
        })
        .catch(err => {
            console.error(err);
            alert("Błąd rezerwacji: " + err.message);
        });
});

function loadUser() {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        // brak zalogowanego usera
        USERBUTTON.classList.add("d-none");
        return;
    }

    const user = JSON.parse(userStr);
    USERBUTTON.textContent = user.login;
    USERBUTTON.classList.remove("d-none");
    USERBUTTON.onclick = () => window.location.href = "user.html";
}

// wywołaj po załadowaniu strony
window.addEventListener('load', loadUser);



console.log(localStorage.getItem("user"));