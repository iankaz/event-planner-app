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
  