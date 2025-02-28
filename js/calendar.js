// Google Calendar API configuration
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const API_KEY = 'YOUR_GOOGLE_API_KEY';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.events = [];
        this.init();
    }

    init() {
        this.initializeGoogleAPI();
        this.setupEventListeners();
        this.updateCurrentMonthDisplay();
    }

    initializeGoogleAPI() {
        gapiLoaded();
        gisLoaded();
    }

    setupEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.navigateMonth(1));
        document.getElementById('calendar-view').addEventListener('change', (e) => this.changeView(e.target.value));
        
        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('event-details').style.display = 'none';
        });
    }

    navigateMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.updateCurrentMonthDisplay();
        this.loadEvents();
    }

    updateCurrentMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const month = monthNames[this.currentDate.getMonth()];
        const year = this.currentDate.getFullYear();
        document.getElementById('current-month').textContent = `${month} ${year}`;
    }

    async loadEvents() {
        try {
            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': this.getTimeMin(),
                'timeMax': this.getTimeMax(),
                'showDeleted': false,
                'singleEvents': true,
                'orderBy': 'startTime'
            });

            this.events = response.result.items;
            this.renderCalendar();
        } catch (err) {
            console.error('Error loading calendar events:', err);
        }
    }

    getTimeMin() {
        const date = new Date(this.currentDate);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return date.toISOString();
    }

    getTimeMax() {
        const date = new Date(this.currentDate);
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        date.setHours(23, 59, 59, 999);
        return date.toISOString();
    }

    renderCalendar() {
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = '';

        switch(this.currentView) {
            case 'month':
                this.renderMonthView(grid);
                break;
            case 'week':
                this.renderWeekView(grid);
                break;
            case 'day':
                this.renderDayView(grid);
                break;
        }
    }

    renderMonthView(grid) {
        const daysInMonth = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        ).getDate();

        const firstDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1
        ).getDay();

        // Create header row with day names
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-cell empty';
            grid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            cell.innerHTML = `
                <div class="date">${day}</div>
                <div class="events"></div>
            `;

            // Add events for this day
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayEvents = this.events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date);
                return eventDate.toDateString() === date.toDateString();
            });

            const eventsContainer = cell.querySelector('.events');
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = event.summary;
                eventElement.addEventListener('click', () => this.showEventDetails(event));
                eventsContainer.appendChild(eventElement);
            });

            grid.appendChild(cell);
        }
    }

    showEventDetails(event) {
        const modal = document.getElementById('event-details');
        const info = document.getElementById('event-info');
        
        const startTime = event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : new Date(event.start.date).toLocaleDateString();
        const endTime = event.end.dateTime ? new Date(event.end.dateTime).toLocaleString() : new Date(event.end.date).toLocaleDateString();
        
        info.innerHTML = `
            <h4>${event.summary}</h4>
            <p><strong>Start:</strong> ${startTime}</p>
            <p><strong>End:</strong> ${endTime}</p>
            ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
            ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
        `;
        
        modal.style.display = 'block';
    }

    changeView(view) {
        this.currentView = view;
        this.renderCalendar();
    }
}

// Google Calendar API initialization functions
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.display = 'block';
    }
}

// Handle authorization
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.display = 'block';
        document.getElementById('authorize_button').style.display = 'none';
        await calendarManager.loadEvents();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('authorize_button').style.display = 'block';
        document.getElementById('signout_button').style.display = 'none';
    }
}

// Initialize calendar manager when the page loads
let calendarManager;
document.addEventListener('DOMContentLoaded', () => {
    calendarManager = new CalendarManager();
    
    document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
    document.getElementById('signout_button').addEventListener('click', handleSignoutClick);
}); 