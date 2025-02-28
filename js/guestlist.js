class GuestManager {
    constructor() {
        this.guests = JSON.parse(localStorage.getItem('guests')) || [];
        this.form = document.getElementById('guest-form');
        this.guestList = document.getElementById('guest-list');
        this.statusFilter = document.getElementById('status-filter');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.statusFilter.addEventListener('change', () => this.renderGuests());
        this.renderGuests();
    }

    handleSubmit(e) {
        e.preventDefault();
        const guest = {
            id: Date.now(),
            name: document.getElementById('guest-name').value,
            email: document.getElementById('guest-email').value,
            status: document.getElementById('guest-status').value,
            dateAdded: new Date().toISOString()
        };

        this.guests.push(guest);
        this.saveGuests();
        this.renderGuests();
        this.form.reset();
    }

    saveGuests() {
        localStorage.setItem('guests', JSON.stringify(this.guests));
    }

    renderGuests() {
        const filterValue = this.statusFilter.value;
        const filteredGuests = filterValue === 'all' 
            ? this.guests 
            : this.guests.filter(guest => guest.status === filterValue);

        this.guestList.innerHTML = filteredGuests.map(guest => `
            <li class="guest-item" data-id="${guest.id}">
                <div class="guest-info">
                    <h4>${guest.name}</h4>
                    <p>${guest.email}</p>
                    <p class="status ${guest.status}">${guest.status}</p>
                </div>
                <div class="guest-actions">
                    <select onchange="guestManager.updateStatus('${guest.id}', this.value)">
                        <option value="pending" ${guest.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${guest.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="declined" ${guest.status === 'declined' ? 'selected' : ''}>Declined</option>
                    </select>
                    <button onclick="guestManager.removeGuest('${guest.id}')">Remove</button>
                </div>
            </li>
        `).join('');
    }

    updateStatus(guestId, newStatus) {
        const guest = this.guests.find(g => g.id.toString() === guestId);
        if (guest) {
            guest.status = newStatus;
            this.saveGuests();
            this.renderGuests();
        }
    }

    removeGuest(guestId) {
        this.guests = this.guests.filter(g => g.id.toString() !== guestId);
        this.saveGuests();
        this.renderGuests();
    }
}

// Initialize guest manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.guestManager = new GuestManager();
}); 