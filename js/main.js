document.addEventListener('DOMContentLoaded', () => {
    const eventList = document.getElementById('event-list');
    const mockEvents = [
      { title: 'Birthday Party', date: '2024-12-20', location: '123 Party Lane' },
      { title: 'Conference', date: '2024-12-25', location: '456 Conference Center' },
    ];
  
    function renderEvents(events) {
      eventList.innerHTML = events.map(event => `
        <li>
          <h3>${event.title}</h3>
          <p>Date: ${event.date}</p>
          <p>Location: ${event.location}</p>
        </li>
      `).join('');
    }
  
    renderEvents(mockEvents);
  });

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
    }
  });
  
  function handleHomePage() {
    const eventList = document.getElementById('event-list');
    const mockEvents = [
      { title: 'Birthday Party', date: '2024-12-20', location: '123 Party Lane' },
      { title: 'Conference', date: '2024-12-25', location: '456 Conference Center' },
    ];
  
    function renderEvents(events) {
      eventList.innerHTML = events.map(event => `
        <li>
          <h3>${event.title}</h3>
          <p>Date: ${event.date}</p>
          <p>Location: ${event.location}</p>
        </li>
      `).join('');
    }
  
    renderEvents(mockEvents);
  }
  
  function handleCreateEventPage() {
    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('event-title').value;
      const date = document.getElementById('event-date').value;
      const location = document.getElementById('event-location').value;
      const newEvent = { title, date, location };
      // Save the event data (mock implementation here)
      alert(`Event Created: ${title} on ${date} at ${location}`);
      eventForm.reset();
    });
  }
  
  function handleGuestListPage() {
    const guestForm = document.getElementById('guest-form');
    const guestListUl = document.getElementById('guest-list-ul');
    const guestList = [];
  
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
      renderGuestList(guestList);
      guestForm.reset();
    });
  
    renderGuestList(guestList);
  }
  
  function handleTasksPage() {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const tasks = [];
  
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
      renderTasks(tasks);
      taskForm.reset();
    });
  
    renderTasks(tasks);
  }

  // Placeholder code for Google Calendar API integration
function loadGoogleCalendar() {
  // Load and authorize the Google Calendar API
  // Fetch and display events from the user's Google Calendar
}

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
javascript
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'iankazembe41@gmail.com', // Change to your recipient
  from: 'kaz23003@byui.edu', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })

  function sendEmailInvitation(guest) {
    const emailData = {
      personalizations: [{ to: [{ email: guest.email }] }],
      from: { email: 'kaz23003@byui.edu' },
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
    }).then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    // ...previous code...
  
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
    const expenses = [];
  
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
      renderExpenses(expenses);
      expenseForm.reset();
    });
  
    renderExpenses(expenses);
  });
  