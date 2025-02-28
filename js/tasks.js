class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.form = document.getElementById('task-form');
        this.taskList = document.getElementById('task-list');
        this.priorityFilter = document.getElementById('priority-filter');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.priorityFilter.addEventListener('change', () => this.renderTasks());
        this.renderTasks();
        this.checkDeadlines();
    }

    handleSubmit(e) {
        e.preventDefault();
        const task = {
            id: Date.now(),
            name: document.getElementById('task-name').value,
            description: document.getElementById('task-description').value,
            deadline: document.getElementById('task-deadline').value,
            assignee: document.getElementById('task-assignee').value,
            priority: document.getElementById('task-priority').value,
            status: 'pending',
            dateAdded: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.form.reset();
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const filterValue = this.priorityFilter.value;
        const filteredTasks = filterValue === 'all' 
            ? this.tasks 
            : this.tasks.filter(task => task.priority === filterValue);

        // Sort tasks by deadline
        filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        this.taskList.innerHTML = filteredTasks.map(task => `
            <li class="task-item ${task.status} priority-${task.priority}" data-id="${task.id}">
                <div class="task-info">
                    <h4>${task.name}</h4>
                    <p>${task.description}</p>
                    <p>Deadline: ${new Date(task.deadline).toLocaleString()}</p>
                    <p>Assigned to: ${task.assignee || 'Unassigned'}</p>
                    <p class="status ${task.status}">${task.status}</p>
                </div>
                <div class="task-actions">
                    <select onchange="taskManager.updateStatus('${task.id}', this.value)">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button onclick="taskManager.removeTask('${task.id}')">Delete</button>
                </div>
            </li>
        `).join('');
    }

    updateStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id.toString() === taskId);
        if (task) {
            task.status = newStatus;
            this.saveTasks();
            this.renderTasks();
        }
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id.toString() !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    checkDeadlines() {
        setInterval(() => {
            const now = new Date();
            this.tasks.forEach(task => {
                const deadline = new Date(task.deadline);
                if (deadline - now <= 24 * 60 * 60 * 1000 && task.status !== 'completed') { // 24 hours
                    this.showNotification(task);
                }
            });
        }, 60000); // Check every minute
    }

    showNotification(task) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Task Deadline Approaching', {
                body: `The task "${task.name}" is due in less than 24 hours!`,
                icon: '/icon.png'
            });
        }
    }
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

// Initialize task manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
}); 