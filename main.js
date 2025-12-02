// Enhanced Main JavaScript for Sunstone Platform with Loading States and Error Handling
class SunstoneApp {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 3;
        this.projects = [];
        this.currentProject = null;
        this.isLoading = false;
        this.loadingTimeout = null;

        this.step1InitialHTML = '';  // 👈 add this line

        this.init();
    }

    init() {
        // Store original Step 1 HTML so we can restore it later
        const step1 = document.getElementById('step1');
        if (step1) {
            this.step1InitialHTML = step1.innerHTML;
        }

        this.bindEvents();
        this.loadProjects();
        this.renderProjects();
        this.setupErrorHandling();
    }


    bindEvents() {
        // Modal events
        const newProjectBtn = document.getElementById('newProjectBtn');
        const newProjectModal = document.getElementById('newProjectModal');
        const closeModal = document.getElementById('closeModal');
        const nextStep = document.getElementById('nextStep');

        if (newProjectBtn) {
            newProjectBtn.addEventListener('click', () => this.openModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (nextStep) {
            nextStep.addEventListener('click', () => this.handleNextStep());
        }

        // Close modal on outside click
        if (newProjectModal) {
            newProjectModal.addEventListener('click', (e) => {
                if (e.target === newProjectModal) {
                    this.closeModal();
                }
            });
        }

        // Project card clicks
        this.bindProjectCardEvents();
    }

    bindProjectCardEvents() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !this.isLoading) {
                    this.openProject(card);
                }
            });
        });
    }

    // Loading state management
    showLoading(message = 'Cargando...') {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        // Create loading overlay if it doesn't exist
        let loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            loadingOverlay.innerHTML = `
                <div class="bg-white rounded-lg p-6 text-center shadow-xl">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p class="text-gray-700 font-medium">${message}</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        } else {
            loadingOverlay.querySelector('p').textContent = message;
        }
        
        loadingOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Set timeout for long operations
        this.loadingTimeout = setTimeout(() => {
            this.hideLoading();
            this.showNotification('La operación está tomando más tiempo de lo esperado', 'warning');
        }, 15000);
    }

    hideLoading() {
        if (!this.isLoading) return;
        
        this.isLoading = false;
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        document.body.style.overflow = 'auto';
        
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
    }

    // Enhanced error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            this.showNotification('Ha ocurrido un error inesperado', 'error');
            this.hideLoading();
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
            this.showNotification('Error de conexión o procesamiento', 'error');
            this.hideLoading();
        });
    }

    // Safe localStorage operations
    safeLocalStorageGet(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            this.showNotification('Error al cargar datos guardados', 'error');
            return defaultValue;
        }
    }

    safeLocalStorageSet(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            this.showNotification('Error al guardar datos', 'error');
            return false;
        }
    }

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;

        this.showLoading('Cargando proyectos...');

        try {
            projectsGrid.innerHTML = '';

            if (this.projects.length === 0) {
                this.showEmptyState(projectsGrid);
            } else {
                this.projects.forEach(project => {
                    const projectCard = this.createProjectCard(project);
                    projectsGrid.appendChild(projectCard);
                });
            }

            // Update stats
            this.updateStats();
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showNotification('Error al renderizar proyectos', 'error');
            console.error('Render error:', error);
        }
    }

    showEmptyState(container) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-rocket text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">No hay proyectos aún</h3>
                <p class="text-gray-500 mb-6">Crea tu primer proyecto para comenzar con el discovery y estrategia</p>
                <button onclick="window.sunstoneApp.openModal()" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    <i class="fas fa-plus mr-2"></i>Crear primer proyecto
                </button>
            </div>
        `;
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 card-hover project-card';
        card.onclick = () => this.openProject(project);

        // Determine status badge color and text
        let statusBadgeClass = 'bg-gray-100 text-gray-800';
        let statusText = project.status || 'Nuevo';
        let progressText = 'Progreso';
        let progressWidth = project.progress || 0;

        if (project.status === 'En Discovery') {
            statusBadgeClass = 'bg-blue-100 text-blue-800';
            progressText = 'Discovery';
        } else if (project.status === 'En Estrategia') {
            statusBadgeClass = 'bg-green-100 text-green-800';
            progressText = 'Estrategia';
        } else if (project.status === 'Exploración') {
            statusBadgeClass = 'bg-purple-100 text-purple-800';
            progressText = 'Exploración';
        }

        // Format last session date
        const lastSession = new Date(project.created);
        const today = new Date();
        const diffTime = Math.abs(today - lastSession);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let lastSessionText = 'Hoy';
        
        if (diffDays === 1) {
            lastSessionText = 'Ayer';
        } else if (diffDays <= 7) {
            lastSessionText = `Hace ${diffDays} días`;
        } else {
            lastSessionText = lastSession.toLocaleDateString('es-ES');
        }

        card.innerHTML = `
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900">${project.name}</h3>
                <span class="status-badge ${statusBadgeClass}">${project.modelType || 'SaaS'}</span>
            </div>
            <p class="text-gray-600 text-sm mb-4">${project.mainConcerns || 'Proyecto de Discovery y Estrategia'}</p>
            <div class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>${progressText}</span>
                    <span>${progressWidth}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="progress-bar h-2 rounded-full" style="width: ${progressWidth}%"></div>
                </div>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-500">
                <span>Última sesión: ${lastSessionText}</span>
                <i class="fas fa-arrow-right text-indigo-600"></i>
            </div>
        `;

        return card;
    }

    updateStats() {
        const totalProjects = this.projects.length;
        const discoveryProjects = this.projects.filter(p => p.status === 'En Discovery').length;
        const strategyProjects = this.projects.filter(p => p.status === 'En Estrategia').length;
        const successRate = Math.round((this.projects.filter(p => p.progress >= 75).length / totalProjects) * 100) || 85;

        // Update stats if elements exist
        const statsElements = document.querySelectorAll('.text-2xl.font-bold');
        if (statsElements.length >= 4) {
            statsElements[0].textContent = totalProjects;
            statsElements[1].textContent = discoveryProjects;
            statsElements[2].textContent = strategyProjects;
            statsElements[3].textContent = successRate + '%';
        }
    }

    openProject(projectData) {
        if (this.isLoading) return;
        
        this.showLoading('Abriendo proyecto...');
        
        try {
            if (typeof projectData === 'object') {
                this.currentProject = projectData;
                this.safeLocalStorageSet('sunstone_current_project', projectData);
            }
            
            this.showNotification(`Abriendo proyecto: ${projectData.name}`, 'info');
            
            setTimeout(() => {
                this.hideLoading();
                window.location.href = 'project.html';
            }, 800);
        } catch (error) {
            this.hideLoading();
            this.showNotification('Error al abrir proyecto', 'error');
            console.error('Open project error:', error);
        }
    }

    openModal() {
        if (this.isLoading) return;
        
        const modal = document.getElementById('newProjectModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            this.resetWizard();
        }
    }

    closeModal() {
        const modal = document.getElementById('newProjectModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            this.resetWizard();
        }
    }

    resetWizard() {
        this.currentStep = 1;
        this.updateStepIndicator();
        this.showStep(1);
    }

    handleNextStep() {
        if (this.isLoading) return;
        
        if (this.currentStep < this.maxSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateStepIndicator();
                this.showStep(this.currentStep);
            }
        } else {
            this.createProject();
        }
    }

    validateCurrentStep() {
        if (this.currentStep === 1) {
            const projectName = document.getElementById('projectNameInput')?.value;
            if (!projectName || projectName.trim().length < 3) {
                this.showNotification('Por favor ingresa un nombre de proyecto válido', 'error');
                return false;
            }
        }

        if (this.currentStep === 2) {
            const concerns = document.getElementById('mainConcerns')?.value;
            if (!concerns || concerns.trim().length < 10) {
                this.showNotification('Por favor describe tus preocupaciones principales', 'error');
                return false;
            }
        }

        if (this.currentStep === 3) {
            const duration = document.getElementById('duration')?.value;
            const deliverable = document.getElementById('deliverable')?.value;
            if (!duration || !deliverable) {
                this.showNotification('Por favor completa todos los campos', 'error');
                return false;
            }
        }

        return true;
    }


    updateStepIndicator() {
        const steps = document.querySelectorAll('.flex.items-center .flex.items-center');
        steps.forEach((step, index) => {
            const circle = step.querySelector('.w-8');
            const text = step.querySelector('span');
            
            if (index + 1 <= this.currentStep) {
                circle.classList.remove('bg-gray-300', 'text-gray-600');
                circle.classList.add('bg-indigo-600', 'text-white');
                text.classList.remove('text-gray-500');
                text.classList.add('text-indigo-600', 'font-medium');
            } else {
                circle.classList.add('bg-gray-300', 'text-gray-600');
                circle.classList.remove('bg-indigo-600', 'text-white');
                text.classList.add('text-gray-500');
                text.classList.remove('text-indigo-600', 'font-medium');
            }
        });
    }

    showStep(stepNumber) {
        const step1 = document.getElementById('step1');
        const nextBtn = document.getElementById('nextStep');

        if (!step1) return;

        // always show the container
        step1.style.display = 'block';

        switch (stepNumber) {
            case 1:
                // Restore original Step 1 HTML
                if (this.step1InitialHTML) {
                    step1.innerHTML = this.step1InitialHTML;
                }
                if (nextBtn) {
                    nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right ml-2"></i>';
                }
                break;

            case 2:
                // Render Step 2 into the same container
                this.renderStep2();
                if (nextBtn) {
                    nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right ml-2"></i>';
                }
                break;

            case 3:
                // Render Step 3 into the same container
                this.renderStep3();
                if (nextBtn) {
                    nextBtn.innerHTML = 'Crear proyecto <i class="fas fa-check ml-2"></i>';
                }
                break;
        }
    }



    renderStep2() {
        const step1 = document.getElementById('step1');
        if (!step1) return;

        step1.innerHTML = `
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Objetivo principal de la intervención (puedes marcar varias)</label>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="funding" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Conseguir funding</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="pmf" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Encontrar PMF</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="launch" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Lanzar producto</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="repositioning" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Reposicionar marca/narrativa</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="gtm" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Diseñar GTM</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="objectives" value="new-segment" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <span class="ml-3 text-gray-700">Entrar en nuevo segmento</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">¿Qué te preocupa más ahora mismo?</label>
                    <textarea id="mainConcerns" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows="4" placeholder="Describe brevemente tus principales preocupaciones..."></textarea>
                </div>
            </div>
        `;
        step1.style.display = 'block';
    }

    renderStep3() {
        const step1 = document.getElementById('step1');
        if (!step1) return;

        step1.innerHTML = `
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Duración estimada</label>
                    <select id="duration" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Selecciona duración</option>
                        <option value="2-3-weeks">2-3 semanas</option>
                        <option value="4-6-weeks-discovery">4-6 semanas Discovery</option>
                        <option value="8-10-weeks-full">8-10 semanas Discovery + Estrategia</option>
                        <option value="12plus-weeks-complete">12+ semanas Proyecto completo</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de entregable esperado</label>
                    <select id="deliverable" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Selecciona entregable</option>
                        <option value="discovery-only">Solo Discovery</option>
                        <option value="discovery-strategy">Discovery + Estrategia</option>
                        <option value="full-gtm">GTM completo</option>
                        <option value="end-to-end">Proyecto end-to-end</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Presupuesto aproximado</label>
                    <select id="budget" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Selecciona rango</option>
                        <option value="5k-10k">5K - 10K EUR</option>
                        <option value="10k-25k">10K - 25K EUR</option>
                        <option value="25k-50k">25K - 50K EUR</option>
                        <option value="50k-plus">50K+ EUR</option>
                    </select>
                </div>
            </div>
        `;
        step1.style.display = 'block';
    }

    async createProject() {
        // Collect data from wizard fields
        const projectName = document.querySelector('#projectNameInput')?.value || '';
        const industry = document.querySelector('#industrySelect')?.value || '';
        const modelType = document.querySelector('#modelTypeSelect')?.value || '';
        const phase = document.querySelector('#phaseSelect')?.value || '';
        const region = document.querySelector('#regionInput')?.value || '';
        const mainConcerns = document.querySelector('#mainConcerns')?.value || '';
        const mainOpportunities = document.querySelector('#mainOpportunities')?.value || '';
        const duration = document.querySelector('#duration')?.value || '';
        const deliverable = document.querySelector('#deliverable')?.value || '';

        const newProject = {
            id: crypto.randomUUID(),
            name: projectName,
            industry,
            modelType,
            phase,
            region,
            mainConcerns,
            mainOpportunities,
            duration,
            deliverable,
            discovery: {},         // ready for intake/jtbd/etc
            strategy: {},          // ready for roadmap/etc
            createdAt: new Date().toISOString()
        };

        // 🔥 FIRST: save to Supabase
        try {
            const { data, error } = await window.supabase
            .from("projects")
            .insert({
                id: newProject.id,
                name: newProject.name,
                industry: newProject.industry,
                phase: newProject.phase,
                modelType: newProject.modelType || null,
                region: newProject.region || null,
                data: {}   // backend JSON structure starts empty
            });

            if (error) {
            console.error("Supabase insert error:", error);
            this.showNotification("No se pudo guardar el proyecto en Supabase", "error");
            } else {
            this.showNotification("Proyecto guardado en la nube", "success");
            }
        } catch (e) {
            console.error("Supabase: unexpected error", e);
        }

        // SECOND: still save locally (for speed & caching)
        localStorage.setItem("sunstone_current_project", JSON.stringify(newProject));

        const allProjects = JSON.parse(localStorage.getItem("sunstone_projects") || "[]");
        allProjects.unshift(newProject);
        localStorage.setItem("sunstone_projects", JSON.stringify(allProjects));

        // Show new project in the UI
        this.projects = allProjects;
        this.renderProjects();

        // Close modal & go to project page
        this.closeModal();
        setTimeout(() => {
            window.location.href = "project.html";
        }, 300);
    }


    loadProjects() {
        this.showLoading('Cargando proyectos...');
        
        try {
            // Load projects from localStorage or use default
            const saved = this.safeLocalStorageGet('sunstone_projects');
            if (saved && saved.length > 0) {
                this.projects = saved;
            } else {
                // Default projects for demo
                this.projects = this.getDefaultProjects();
                this.saveProjects();
            }
            
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showNotification('Error al cargar proyectos', 'error');
            console.error('Load projects error:', error);
            this.projects = this.getDefaultProjects();
        }
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                name: 'TechFlow Solutions',
                industry: 'Tecnología/SaaS',
                modelType: 'SaaS',
                phase: 'Pre-PMF',
                region: 'España',
                objectives: ['pmf', 'gtm'],
                mainConcerns: 'Necesitamos encontrar PMF antes del próximo funding round',
                duration: '4-6-weeks-discovery',
                deliverable: 'discovery-strategy',
                budget: '25k-50k',
                status: 'En Discovery',
                progress: 75,
                created: new Date('2025-11-24'),
                discovery: {
                    intake: { completed: true, data: {} },
                    jtbd: { completed: true, data: [] },
                    tensiones: { completed: false, data: {} },
                    audiencias: { completed: false, data: [] }
                },
                strategy: {
                    valor: { completed: false, data: {} },
                    narrativa: { completed: false, data: {} }
                },
                roadmap: {
                    initiatives: []
                }
            },
            {
                id: 2,
                name: 'MarketPlace Pro',
                industry: 'E-commerce',
                modelType: 'Marketplace',
                phase: 'Post-PMF',
                region: 'Latinoamérica',
                objectives: ['funding', 'new-segment'],
                mainConcerns: 'Necesitamos escalar a nuevos mercados',
                duration: '8-10-weeks-full',
                deliverable: 'full-gtm',
                budget: '50k-plus',
                status: 'En Estrategia',
                progress: 45,
                created: new Date('2025-11-20'),
                discovery: {
                    intake: { completed: true, data: {} },
                    jtbd: { completed: true, data: [] },
                    tensiones: { completed: true, data: {} },
                    audiencias: { completed: true, data: [] }
                },
                strategy: {
                    valor: { completed: true, data: {} },
                    narrativa: { completed: false, data: {} }
                },
                roadmap: {
                    initiatives: []
                }
            }
        ];
    }

    saveProjects() {
        this.safeLocalStorageSet('sunstone_projects', this.projects);
    }

    // Enhanced notification system
    showNotification(message, type = 'info', duration = 3000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification-toast');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification-toast fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle'
                } mr-3"></i>
                <span class="font-medium">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
        
        // Add entrance animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sunstoneApp = new SunstoneApp();
});

// Utility functions for other modules
window.SunstoneUtils = {
    showNotification: (message, type = 'info') => {
        if (window.sunstoneApp) {
            window.sunstoneApp.showNotification(message, type);
        } else {
            alert(message);
        }
    },
    
    showLoading: (message) => {
        if (window.sunstoneApp) {
            window.sunstoneApp.showLoading(message);
        }
    },
    
    hideLoading: () => {
        if (window.sunstoneApp) {
            window.sunstoneApp.hideLoading();
        }
    },
    
    safeLocalStorageGet: (key, defaultValue) => {
        if (window.sunstoneApp) {
            return window.sunstoneApp.safeLocalStorageGet(key, defaultValue);
        }
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    safeLocalStorageSet: (key, value) => {
        if (window.sunstoneApp) {
            return window.sunstoneApp.safeLocalStorageSet(key, value);
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }
};