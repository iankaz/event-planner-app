document.addEventListener('DOMContentLoaded', () => {
    const createEventForm = document.getElementById('create-event-form');

    if (createEventForm) {
        createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('event-title').value;
            const date = document.getElementById('event-date').value;
            const category = document.getElementById('event-category').value;
            const description = document.getElementById('event-description').value;

            eventManager.addEvent(title, date, category, description);
            
            // Reset form and redirect to home page
            createEventForm.reset();
            window.location.href = 'index.html';
        });
    }
}); 