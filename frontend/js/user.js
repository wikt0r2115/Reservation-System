// 🔧 DOPASUJ TE URL-E DO SWOJEGO API:
const API_URL_RESERVATIONS = "http://localhost:8080/api/reservation";
// np. jesli masz GET /api/reservation/user/{userId}

// 1. Sprawdź, czy użytkownik jest zalogowany
const userJson = localStorage.getItem("user");
if (!userJson) {
    // Brak zalogowanego – wracamy na stronę główną
    window.location.href = "index.html";
}

const user = JSON.parse(userJson);

// 2. Ustaw dane użytkownika w UI
document.getElementById("userButton").textContent = user.login;
document.getElementById("accLogin").textContent = user.login;
document.getElementById("accPrivileges").textContent = user.privileges ? "Administrator" : "Użytkownik";

// Po kliknięciu w nazwę – zostajemy na tej stronie, więc nic nie robimy,
// ale możesz dodać dropdown, jeśli chcesz.

// 3. Wylogowanie
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
});

// 4. Pobranie rezerwacji użytkownika
async function loadReservations() {
    const container = document.getElementById("reservationsContainer");
    const info = document.getElementById("resInfo");

    container.innerHTML = "<div class='text-muted'>Ładowanie rezerwacji...</div>";

    try {
        const url = `${API_URL_RESERVATIONS}/user/${user.id}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Błąd pobierania rezerwacji: " + res.status);
        }

        let data = await res.json();
        console.log("Odpowiedz z API:", data);

        let reservations;

        // Obsługa różnych formatów odpowiedzi
        if (Array.isArray(data)) {
            reservations = data;
        } else if (data && Array.isArray(data.content)) {
            reservations = data.content;
        } else if (data) {
            reservations = [data];
        } else {
            reservations = [];
        }

        if (reservations.length === 0) {
            container.innerHTML = "<div class='text-muted'>Brak rezerwacji.</div>";
            info.textContent = "";
            return;
        }

        info.textContent = `Łącznie: ${reservations.length}`;
        container.innerHTML = "";


        reservations.forEach(r => {
            console.log(r);
            const startDate = r.startDate || r.dateFrom || "";
            const endDate = r.endDate || r.dateTo || "";
            const title = r.locationName
                || (r.accommodation && r.accommodation.location_name)
                || "Rezerwacja";

            const item = document.createElement("div");
            item.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-start";

            item.innerHTML = `
                    <div class="ms-2 me-auto">
                        <div class="fw-semibold">${title} </div>
                        <div class="small text-muted">
                            Od: ${startDate} &nbsp;&nbsp; Do: ${endDate}
                        </div>
                    </div>
                    <button
                        onclick="openModificationModal(${r.id},'${startDate}','${endDate}')"
                        data-bs-toggle="modal" 
                        data-bs-target="#modificationModal"
                        type = "button"
                        class = "btn btn-sm">
                        Modyfikuj                      
                    </button>
                    <button 
                        type="button"
                        class="btn btn-sm btn-outline-danger cancel-btn"
                        data-id="${r.id}">
                        Anuluj
                    </button>
                `;

            container.appendChild(item);
        });

    } catch (err) {
        console.error(err);
        container.innerHTML = "<div class='text-danger'>Nie udało się pobrać rezerwacji.</div>";
        info.textContent = "";
    }
}
document
    .getElementById("reservationsContainer")
    .addEventListener("click", async (e) => {
        const btn = e.target.closest(".cancel-btn");
        if (!btn) return;

        const id = btn.dataset.id;
        console.log("Klik anulowania, id =", id);

        const url = `http://localhost:8080/api/reservation/${id}`;
        console.log("DELETE URL:", url);

        try {
            const res = await fetch(url, {
                method: "DELETE"
            });

            console.log("DELETE status:", res.status);

            const bodyText = await res.text();
            console.log("DELETE response body:", bodyText);

            if (!res.ok) {
                throw new Error("Błąd anulowania rezerwacji (status " + res.status + ")");
            }

            alert("Rezerwacja anulowana");
            loadReservations();
        } catch (err) {
            console.error(err);
            alert("Wystąpił błąd: " + err.message);
        }
    });
function openModificationModal(id, startDateStr, endDateStr) {
    //console.log("klik");
    //console.log(startDateStr);
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    //console.log(startDate.toISOString().split("T")[0],startDate.toISOString().split("T")[0]);
    const modificationForm = document.getElementById("modificationForm");
    modificationForm.dataset.startDate = startDate.toISOString().split("T")[0];
    modificationForm.dataset.endDate = endDate.toISOString().split("T")[0];
    modificationForm.dataset.reservationId = id;

    const startDateBtn = document.getElementById("startDate");
    const endDateBtn = document.getElementById("endDate");
    startDateBtn.value = startDate.toISOString().split("T")[0];
    endDateBtn.value = endDate.toISOString().split("T")[0];
}

//Obsluga zmiany dat rezerwacji
document.getElementById("modificationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const reservationId = form.dataset.reservationId;

    const newStart = document.getElementById("startDate").value;
    const newEnd = document.getElementById("endDate").value;

    if (!newStart || !newEnd) {
        alert("Podaj obie daty.");
        return;
    }

    try {
        // 1. USUNIĘCIE starej rezerwacji
        const del = await fetch(`${API_URL_RESERVATIONS}/${reservationId}`, {
            method: "DELETE"
        });

        if (!del.ok) {
            throw new Error("Błąd podczas usuwania rezerwacji.");
        }

        // 2. UTWORZENIE nowej rezerwacji z nowymi datami
        const newReservation = {
            startDate: newStart,
            endDate: newEnd,
            userId: user.id,
            // jeśli backend wymaga jeszcze np. accommodationId to dodaj tu:
            // accommodationId: form.dataset.accId
        };

        const create = await fetch(API_URL_RESERVATIONS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReservation)
        });

        if (!create.ok) {
            throw new Error("Nie udało się stworzyć nowej rezerwacji.");
        }

        alert("Daty rezerwacji zostały zmienione.");

        // zamknięcie modala
        const modalEl = document.getElementById("modificationModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        loadReservations();

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

loadReservations();