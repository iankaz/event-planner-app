document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  if (currentPath.endsWith('index.html') || currentPath === '/') {
    handleHomePage();
  } else if (currentPath.endsWith('createevent.html')) {
    handleCreateEventPage();
  } else if (currentPath.endsWith('guestlist.html')) {
    handleGuestListPage();
  } else if (currentPath.endsWith('tasks.html')) {
    handleTasksPage();
  } else if (currentPath.endsWith('expenses.html')) {
    handleExpensesPage();
  }
});

function handleHomePage() {
  const eventList = document.getElementById('event-list');
  const events = JSON.parse(localStorage.getItem('events')) || [
    { title: 'Birthday Party', date: '2024-12-20', location: '123 Party Lane', guests: [], tasks: [], comments: [] },
    { title: 'Conference', date: '2024-12-25', location: '456 Conference Center', guests: [], tasks: [], comments: [] },
  ];

  function renderEvents(events) {
    eventList.innerHTML = events.map((event, index) => `
      <li data-index="${index}">
        <h3>${event.title}</h3>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
        <button onclick="viewEventDetails(${index})">View Details</button>
        <button onclick="deleteEvent(${index})">Delete</button>
      </li>
    `).join('');
  }

  renderEvents(events);
}

let currentEventGuests = [];

function handleCreateEventPage() {
  const eventForm = document.getElementById('event-form');
  const guestForm = document.getElementById('guest-form');
  const guestListUl = document.getElementById('guest-list-ul');

  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;
    const newEvent = { title, date, location, guests: currentEventGuests, tasks: [], comments: [] };

    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(newEvent);
    try {
      localStorage.setItem('events', JSON.stringify(events));
      console.log('Events saved:', events);
    } catch (error) {
      console.error('Error saving events:', error);
    }

    alert(`Event Created: ${title} on ${date} at ${location}`);
    eventForm.reset();
    currentEventGuests = []; // Reset the guest list for the next event
    guestListUl.innerHTML = ''; // Clear the displayed guest list
  });

  guestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const newGuest = { name, email };
    currentEventGuests.push(newGuest);
    renderGuestList(currentEventGuests);
    guestForm.reset();
  });

  function renderGuestList(guests) {
    guestListUl.innerHTML = guests.map(guest => `
      <li>
        <p>Name: ${guest.name}</p>
        <p>Email: ${guest.email}</p>
      </li>
    `).join('');
  }
}

function handleGuestListPage() {
  const eventIndex = localStorage.getItem('currentEventIndex');
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events[eventIndex];
  const guestForm = document.getElementById('guest-form');
  const guestListUl = document.getElementById('guest-list-ul');
  let guestList = event.guests;

  function renderGuestList(guests) {
    guestListUl.innerHTML = guests.map(guest => `
      <li>
        <p>Name: ${guest.name}</p>
        <p>Email: ${guest.email}</p>
      </li>
    `).join('');
  }

  guestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guest-name').value;
    const email = document.getElementById('guest-email').value;
    const newGuest = { name, email };
    guestList.push(newGuest);
    localStorage.setItem('events', JSON.stringify(events));
    renderGuestList(guestList);
    sendEmailNotification(newGuest); // Send email notification to the guest
    guestForm.reset();
  });

  renderGuestList(guestList);
}

function handleTasksPage() {
  const eventIndex = localStorage.getItem('currentEventIndex');
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const event = events[eventIndex];
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  let tasks = event.tasks;

  function renderTasks(tasks) {
    taskList.innerHTML = tasks.map(task => `
      <li>
        <p>Task: ${task.name}</p>
        <p>Deadline: ${task.deadline}</p>
      </li>
    `).join('');
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('task-name').value;
    const deadline = document.getElementById('task-deadline').value;
    const newTask = { name, deadline };
    tasks.push(newTask);
    localStorage.setItem('events', JSON.stringify(events));
    renderTasks(tasks);
    taskForm.reset();
  });

  renderTasks(tasks);
}

function handleExpensesPage() {
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');
  const totalAmount = document.getElementById('total-amount');
  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  function renderExpenses(expenses) {
    expenseList.innerHTML = expenses.map(expense => `
      <li>
        <p>${expense.name}: $${expense.amount}</p>
      </li>
    `).join('');
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmount.textContent = total;
  }

  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const newExpense = { name, amount };
    expenses.push(newExpense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderExpenses(expenses);
    expenseForm.reset();
  });

  renderExpenses(expenses);
}

// Function to send email notifications using SendGrid API
function sendEmailNotification(guest) {
  const emailData = {
    personalizations: [{ to: [{ email: guest.email }] }],
    from: { email: 'kaz23003@byui.edu' }, // Change to your verified sender email
    subject: 'Event Invitation',
    content: [{ type: 'text/plain', value: `Hi ${guest.name}, you are invited to our event.` }],
  };

  fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_SENDGRID_API_KEY`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return response.json();
  }).then(data => {
    console.log('Email sent successfully:', data);
  }).catch(error => {
    console.error('Error sending email:', error);
  });
}

// Function to delete an event
function deleteEvent(eventIndex) {
  let events = JSON.parse(localStorage.getItem('events')) || [];
  events.splice(eventIndex, 1);
  localStorage.setItem('events', JSON.stringify(events));
  handleHomePage(); // Re-render the home page to reflect the deletion
}

// Function to add a comment to an event
function addComment(eventIndex, comment) {
  let events = JSON.parse(localStorage.getItem('events')) || [];
  events[eventIndex].comments.push(comment);
  localStorage.setItem('events', JSON.stringify(events));
}

// Function to view event details (guests, tasks, comments) of a specific event
function viewEventDetails(eventIndex) {
  localStorage.setItem('currentEventIndex', eventIndex);
  window.location.href = 'eventdetails.html';
}

// Event class to create event objects
class Event {
    constructor(id, title, date, category, description) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.category = category;
        this.description = description;
    }
}

// EventManager class to handle all event operations
class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('events')) || [];
        this.loadEvents();
        this.setupEventListeners();
    }

    loadEvents() {
        const eventList = document.getElementById('event-list');
        if (!eventList) return;

        eventList.innerHTML = '';
        this.events.forEach(event => {
            const li = this.createEventElement(event);
            eventList.appendChild(li);
        });
    }

    createEventElement(event) {
        const li = document.createElement('li');
        li.className = 'event-item';
        li.innerHTML = `
            <h3>${event.title}</h3>
            <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
            <p>Category: ${event.category}</p>
            <p>${event.description}</p>
            <button onclick="eventManager.deleteEvent('${event.id}')">Delete</button>
        `;
        return li;
    }

    addEvent(title, date, category, description) {
        const event = new Event(
            Date.now().toString(),
            title,
            date,
            category,
            description
        );
        this.events.push(event);
        this.saveEvents();
        this.loadEvents();
    }

    deleteEvent(id) {
        this.events = this.events.filter(event => event.id !== id);
        this.saveEvents();
        this.loadEvents();
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    setupEventListeners() {
        const searchInput = document.getElementById('search-events');
        const categoryFilter = document.getElementById('filter-category');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterEvents());
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterEvents());
        }
    }

    filterEvents() {
        const searchTerm = document.getElementById('search-events').value.toLowerCase();
        const category = document.getElementById('filter-category').value;

        const filteredEvents = this.events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || event.category === category;
            return matchesSearch && matchesCategory;
        });

        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '';
        filteredEvents.forEach(event => {
            const li = this.createEventElement(event);
            eventList.appendChild(li);
        });
    }
}

// Initialize the event manager
const eventManager = new EventManager();
