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
    { title: 'Birthday Party', date: '2024-12-20', location: '123 Party Lane', guests: [], tasks: [] },
    { title: 'Conference', date: '2024-12-25', location: '456 Conference Center', guests: [], tasks: [] },
  ];

  function renderEvents(events) {
    eventList.innerHTML = events.map((event, index) => `
      <li data-index="${index}">
        <h3>${event.title}</h3>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
        <button onclick="viewEventDetails(${index})">View Details</button>
      </li>
    `).join('');
  }

  renderEvents(events);
}

function handleCreateEventPage() {
  const eventForm = document.getElementById('event-form');
  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value;
    const newEvent = { title, date, location, guests: [], tasks: [] };

    let events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(newEvent);
    localStorage.setItem('events', JSON.stringify(events));

    alert(`Event Created: ${title} on ${date} at ${location}`);
    eventForm.reset();
  });
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
      'Authorization': `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`,
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

// Function to view event details (guests and tasks) of a specific event
function viewEventDetails(eventIndex) {
  localStorage.setItem('currentEventIndex', eventIndex);
  window.location.href = 'eventdetails.html';
}
