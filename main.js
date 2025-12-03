// Simple main JS for Sunstone dashboard (no wizard)

class SunstoneApp {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.isLoading = false;
        this.loadingTimeout = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProjects();
        this.renderProjects();
        this.updateStats();
    }

    // ---------- EVENTS ----------

    bindEvents() {
        const newProjectBtn = document.getElementById('newProjectBtn');
        const newProjectBtnTop = document.getElementById('newProjectBtnTop');
        const modal = document.getElementById('newProjectModal');
        const closeModalBtn = document.getElementById('closeModal');
        const cancelNewProject = document.getElementById('cancelNewProject');
        const newProjectForm = document.getElementById('newProjectForm');
        const projectsGrid = document.getElementById('projectsGrid');

        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.openModal());
        }
        if (newProjectBtnTop) {
            newProjectBtnTop.addEventListener('click', () => this.openModal());
        }
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }
        if (cancelNewProject) {
            cancelNewProject.addEventListener('click', () => this.closeModal());
        }
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }
        if (newProjectForm) {
            newProjectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createProject();
            });
        }

        // Delegate click from cards
        if (projectsGrid) {
            projectsGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.project-card');
                if (!card) return;
                const projectId = card.dataset.projectId;
                if (projectId) this.openProjectById(projectId);
            });
        }
    }

    // ---------- MODAL ----------

    openModal() {
        const modal = document.getElementById('newProjectModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('newProjectModal');
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';

        const form = document.getElementById('newProjectForm');
        if (form) form.reset();
    }

    // ---------- STORAGE ----------

    loadProjects() {
        const stored = window.SunstoneUtils.safeLocalStorageGet('sunstone_projects', []);
        if (Array.isArray(stored)) {
            this.projects = stored;
        } else {
            this.projects = [];
        }
    }

    saveProjects() {
        window.SunstoneUtils.safeLocalStorageSet('sunstone_projects', this.projects);
    }

    // ---------- PROJECT CREATION ----------

    createProject() {
        const name = document.getElementById('projectNameInput')?.value.trim();
        const industry = document.getElementById('industrySelect')?.value || '';
        const modelType = document.getElementById('modelTypeSelect')?.value || '';
        const phase = document.getElementById('phaseSelect')?.value || '';
        const region = document.getElementById('regionInput')?.value || '';
        const mainConcerns = document.getElementById('mainConcerns')?.value || '';
        const duration = document.getElementById('duration')?.value || '';
        const deliverable = document.getElementById('deliverable')?.value || '';
        const budget = document.getElementById('budget')?.value || '';

        if (!name || name.length < 3) {
            this.showNotification('Por favor ingresa un nombre de proyecto válido', 'error');
            return;
        }

        const id = String(Date.now());

        const project = {
            id,
            name,
            industry,
            modelType,
            phase,
            region,
            mainConcerns,
            duration,
            deliverable,
            budget,
            status: 'En Discovery',
            progress: 0,
            created: new Date().toISOString(),
            discovery: {
                intake: { completed: false, data: {} },
                jtbd: { completed: false, data: [] },
                audiences: { completed: false, data: {} },
                tensions: { completed: false, data: {} }
            },
            strategy: {
                value: { completed: false, data: {} },
                narrative: { completed: false, data: {} },
                roadmap: { completed: false, data: {} },
                initiatives: []
            }
        };

        this.projects.push(project);
        this.saveProjects();
        this.renderProjects();
        this.updateStats();

        // set as current project for project.html
        window.SunstoneUtils.safeLocalStorageSet('sunstone_current_project', project);

        this.closeModal();
        this.showNotification('Proyecto creado exitosamente', 'success');

        // Go straight to project page
        setTimeout(() => {
            window.location.href = `project.html?projectId=${encodeURIComponent(projectData.id)}`;
        }, 600);
    }

    // ---------- PROJECT CARDS ----------

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        if (!this.projects || this.projects.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-rocket text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-700 mb-2">No hay proyectos aún</h3>
                    <p class="text-gray-500 mb-6">Crea tu primer proyecto para comenzar con el discovery y estrategia</p>
                    <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        onclick="window.sunstoneApp.openModal()">
                        <i class="fas fa-plus mr-2"></i>Crear primer proyecto
                    </button>
                </div>
            `;
            return;
        }

        this.projects.forEach((project) => {
            const card = this.createProjectCard(project);
            grid.appendChild(card);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 card-hover project-card flex flex-col justify-between';
        card.dataset.projectId = project.id;

        const industry = project.industry || 'Industria no definida';
        const phase = project.phase || 'Fase no definida';
        const modelType = project.modelType || 'Modelo no definido';

        // Status & progress
        let statusBadgeClass = 'bg-blue-100 text-blue-800';
        let statusText = project.status || 'En Discovery';
        let progressWidth = project.progress || 0;

        if (project.status === 'En Estrategia') {
            statusBadgeClass = 'bg-green-100 text-green-800';
        } else if (project.status === 'Exploración') {
            statusBadgeClass = 'bg-purple-100 text-purple-800';
        }

        // Last session text
        let lastSessionText = 'Hoy';
        if (project.created) {
            const last = new Date(project.created);
            const now = new Date();
            const diffDays = Math.round(Math.abs(now - last) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) lastSessionText = 'Ayer';
            else if (diffDays > 1 && diffDays <= 7) lastSessionText = `Hace ${diffDays} días`;
            else if (diffDays > 7) lastSessionText = last.toLocaleDateString('es-ES');
        }

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-semibold text-gray-900">${project.name}</h3>
                    <span class="status-badge ${statusBadgeClass}">
                        ${statusText}
                    </span>
                </div>
                <p class="text-gray-600 text-sm mb-2">${industry} • ${phase}</p>
                <p class="text-xs text-gray-400 mb-4">
                    Modelo: ${modelType}${project.region ? ' • Región: ' + project.region : ''}
                </p>
                <div class="mb-4">
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>${progressWidth}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full bg-indigo-500" style="width: ${progressWidth}%;"></div>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>Última sesión: ${lastSessionText}</span>
                <span class="inline-flex items-center text-indigo-600">
                    Ver detalles
                    <i class="fas fa-arrow-right ml-1"></i>
                </span>
            </div>
        `;

        return card;
    }

    openProjectById(projectId) {
        const project = this.projects.find((p) => p.id === projectId);
        if (!project) {
            this.showNotification('No se encontró el proyecto', 'error');
            return;
        }

        window.SunstoneUtils.safeLocalStorageSet('sunstone_current_project', project);
        this.showNotification(`Abriendo proyecto: ${project.name}`, 'info');

        setTimeout(() => {
            window.location.href = `project.html?projectId=${encodeURIComponent(projectData.id)}`;
        }, 400);
    }

    // ---------- STATS ----------

    updateStats() {
        const total = this.projects.length;
        const discovery = this.projects.filter((p) => p.status === 'En Discovery').length;
        const strategy = this.projects.filter((p) => p.status === 'En Estrategia').length;
        const successRate =
            total === 0
                ? 0
                : Math.round((this.projects.filter((p) => p.progress >= 75).length / total) * 100);

        const totalEl = document.getElementById('totalProjectsStat');
        const discEl = document.getElementById('discoveryProjectsStat');
        const stratEl = document.getElementById('strategyProjectsStat');
        const successEl = document.getElementById('successRateStat');

        if (totalEl) totalEl.textContent = total;
        if (discEl) discEl.textContent = discovery;
        if (stratEl) stratEl.textContent = strategy;
        if (successEl) successEl.textContent = successRate + '%';
    }

    // ---------- NOTIFICATIONS & UTIL ----------

    showNotification(message, type = 'info', duration = 2500) {
        const existing = document.querySelectorAll('.notification-toast');
        existing.forEach((n) => n.remove());

        const notif = document.createElement('div');
        notif.className =
            'notification-toast fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 max-w-sm text-sm flex items-center gap-2 ' +
            (type === 'success'
                ? 'bg-green-600 text-white'
                : type === 'error'
                ? 'bg-red-600 text-white'
                : type === 'warning'
                ? 'bg-yellow-500 text-white'
                : 'bg-indigo-600 text-white');

        const iconClass =
            type === 'success'
                ? 'fa-check-circle'
                : type === 'error'
                ? 'fa-exclamation-circle'
                : type === 'warning'
                ? 'fa-exclamation-triangle'
                : 'fa-info-circle';

        notif.innerHTML = `
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
            <button class="ml-2 text-white/80 hover:text-white">
                <i class="fas fa-times"></i>
            </button>
        `;

        notif.querySelector('button').addEventListener('click', () => notif.remove());

        document.body.appendChild(notif);

        setTimeout(() => {
            notif.classList.add('opacity-0', 'translate-y-1');
            notif.style.transition = 'all 0.2s ease';
            setTimeout(() => notif.remove(), 200);
        }, duration);
    }
}

// ---------- Global utilities for other pages (intake, JTBD, etc.) ----------

window.SunstoneUtils = {
    showNotification(message, type = 'info') {
        if (window.sunstoneApp) {
            window.sunstoneApp.showNotification(message, type);
        } else {
            alert(message);
        }
    },
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Error leyendo localStorage', e);
            return defaultValue;
        }
    },
    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Error escribiendo localStorage', e);
            return false;
        }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.sunstoneApp = new SunstoneApp();
});
