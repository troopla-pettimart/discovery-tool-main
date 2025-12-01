// Sunstone Platform - Functionality Test Suite
// This script tests all major functionality of the application

class SunstoneTester {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
    }

    async runAllTests() {
        console.log('🚀 Iniciando pruebas de funcionalidad Sunstone Platform...\n');
        
        await this.testNavigation();
        await this.testProjectCreation();
        await this.testDiscoveryModules();
        await this.testStrategyModules();
        await this.testRoadmapModule();
        await this.testReportesModule();
        await this.testDataPersistence();
        await this.testErrorHandling();
        
        this.generateReport();
    }

    async testNavigation() {
        console.log('🧭 Probando navegación...');
        
        // Test 1: Check if all navigation links work
        this.currentTest = 'Navegación principal';
        try {
            const navLinks = document.querySelectorAll('nav a, nav button');
            let workingLinks = 0;
            
            navLinks.forEach(link => {
                if (link.href || link.onclick) {
                    workingLinks++;
                }
            });
            
            this.logResult(workingLinks === navLinks.length, 
                `Enlaces de navegación funcionando: ${workingLinks}/${navLinks.length}`);
        } catch (error) {
            this.logResult(false, `Error en navegación: ${error.message}`);
        }
        
        // Test 2: Check project card navigation
        this.currentTest = 'Navegación de proyectos';
        try {
            const projectCards = document.querySelectorAll('.project-card');
            let clickableCards = 0;
            
            projectCards.forEach(card => {
                if (card.onclick || card.addEventListener) {
                    clickableCards++;
                }
            });
            
            this.logResult(clickableCards === projectCards.length, 
                `Tarjetas de proyecto navegables: ${clickableCards}/${projectCards.length}`);
        } catch (error) {
            this.logResult(false, `Error en navegación de proyectos: ${error.message}`);
        }
    }

    async testProjectCreation() {
        console.log('📝 Probando creación de proyectos...');
        
        // Test 1: Check wizard functionality
        this.currentTest = 'Wizard de creación';
        try {
            const wizardSteps = document.querySelectorAll('#newProjectModal [id^="step"]');
            const nextButton = document.getElementById('nextStep');
            
            this.logResult(wizardSteps.length > 0 && nextButton, 
                `Wizard presente: ${wizardSteps.length} pasos, botón siguiente: ${!!nextButton}`);
        } catch (error) {
            this.logResult(false, `Error en wizard: ${error.message}`);
        }
        
        // Test 2: Check form validation
        this.currentTest = 'Validación de formularios';
        try {
            const requiredFields = document.querySelectorAll('#newProjectModal input[required], #newProjectModal select[required]');
            this.logResult(requiredFields.length > 0, 
                `Campos requeridos encontrados: ${requiredFields.length}`);
        } catch (error) {
            this.logResult(false, `Error en validación: ${error.message}`);
        }
    }

    async testDiscoveryModules() {
        console.log('🔍 Probando módulos de Discovery...');
        
        // Test 1: Check Discovery Intake
        this.currentTest = 'Discovery Intake';
        try {
            const intakeForm = document.querySelector('#discovery-intake-form, form[action*="intake"]');
            const autoSaveElements = document.querySelectorAll('[data-autosave]');
            
            this.logResult(!!intakeForm || autoSaveElements.length > 0, 
                `Formulario de intake: ${!!intakeForm}, Auto-guardado: ${autoSaveElements.length} elementos`);
        } catch (error) {
            this.logResult(false, `Error en Discovery Intake: ${error.message}`);
        }
        
        // Test 2: Check JTBD module
        this.currentTest = 'JTBD Module';
        try {
            const jtbdContainer = document.getElementById('jtbd-container') || 
                                document.querySelector('[data-module="jtbd"]');
            const addJtbdButton = document.querySelector('button[onclick*="addJTBD"], button[id*="add-jtbd"]');
            
            this.logResult(!!jtbdContainer || !!addJtbdButton, 
                `Contenedor JTBD: ${!!jtbdContainer}, Botón agregar: ${!!addJtbdButton}`);
        } catch (error) {
            this.logResult(false, `Error en JTBD: ${error.message}`);
        }
        
        // Test 3: Check Tensiones module
        this.currentTest = 'Tensiones Module';
        try {
            const tensionesMatrix = document.getElementById('tensiones-matrix') || 
                                  document.querySelector('.tension-matrix');
            
            this.logResult(!!tensionesMatrix, `Matriz de tensiones: ${!!tensionesMatrix}`);
        } catch (error) {
            this.logResult(false, `Error en Tensiones: ${error.message}`);
        }
        
        // Test 4: Check Audiencias module
        this.currentTest = 'Audiencias Module';
        try {
            const audienciasContainer = document.getElementById('audiencias-container') || 
                                      document.querySelector('[data-module="audiencias"]');
            
            this.logResult(!!audienciasContainer, `Contenedor Audiencias: ${!!audienciasContainer}`);
        } catch (error) {
            this.logResult(false, `Error en Audiencias: ${error.message}`);
        }
    }

    async testStrategyModules() {
        console.log('🎯 Probando módulos de Estrategia...');
        
        // Test 1: Check Strategy Valor
        this.currentTest = 'Strategy Valor';
        try {
            const valorContainer = document.getElementById('valor-container') || 
                                 document.querySelector('[data-module="valor"]');
            const threeColumnLayout = document.querySelector('.three-column-layout, .valor-columns');
            
            this.logResult(!!valorContainer || !!threeColumnLayout, 
                `Contenedor Valor: ${!!valorContainer}, Layout 3-columnas: ${!!threeColumnLayout}`);
        } catch (error) {
            this.logResult(false, `Error en Strategy Valor: ${error.message}`);
        }
    }

    async testRoadmapModule() {
        console.log('🗺️ Probando Roadmap...');
        
        // Test 1: Check Kanban view
        this.currentTest = 'Roadmap Kanban';
        try {
            const kanbanColumns = document.querySelectorAll('.kanban-column');
            const addButtons = document.querySelectorAll('button[onclick*="addInitiative"]');
            
            this.logResult(kanbanColumns.length >= 3, 
                `Columnas Kanban: ${kanbanColumns.length}, Botones agregar: ${addButtons.length}`);
        } catch (error) {
            this.logResult(false, `Error en Roadmap Kanban: ${error.message}`);
        }
        
        // Test 2: Check Timeline view
        this.currentTest = 'Roadmap Timeline';
        try {
            const timelineView = document.getElementById('timelineView') || 
                               document.querySelector('.timeline-view');
            const viewToggle = document.getElementById('timelineToggle') || 
                             document.querySelector('button[onclick*="toggleView"]');
            
            this.logResult(!!timelineView || !!viewToggle, 
                `Vista timeline: ${!!timelineView}, Toggle vista: ${!!viewToggle}`);
        } catch (error) {
            this.logResult(false, `Error en Roadmap Timeline: ${error.message}`);
        }
    }

    async testReportesModule() {
        console.log('📊 Probando Reportes...');
        
        // Test 1: Check section selection
        this.currentTest = 'Reportes - Selección de secciones';
        try {
            const sectionCheckboxes = document.querySelectorAll('.report-section input[type="checkbox"]');
            const previewContainer = document.getElementById('previewContent') || 
                                   document.querySelector('.preview-content');
            
            this.logResult(sectionCheckboxes.length > 0 && !!previewContainer, 
                `Checkboxes secciones: ${sectionCheckboxes.length}, Preview: ${!!previewContainer}`);
        } catch (error) {
            this.logResult(false, `Error en selección de secciones: ${error.message}`);
        }
        
        // Test 2: Check export buttons
        this.currentTest = 'Reportes - Exportación';
        try {
            const exportButtons = document.querySelectorAll('button[onclick*="export"], button[id*="export"]');
            const exportModal = document.getElementById('exportModal');
            
            this.logResult(exportButtons.length >= 3 && !!exportModal, 
                `Botones exportar: ${exportButtons.length}, Modal export: ${!!exportModal}`);
        } catch (error) {
            this.logResult(false, `Error en exportación: ${error.message}`);
        }
    }

    async testDataPersistence() {
        console.log('💾 Probando persistencia de datos...');
        
        // Test 1: Check localStorage functionality
        this.currentTest = 'localStorage';
        try {
            const testKey = 'sunstone_test_' + Date.now();
            const testData = { test: true, timestamp: Date.now() };
            
            localStorage.setItem(testKey, JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            this.logResult(retrieved && retrieved.test === true, 
                `Guardar/Recuperar datos: ${!!retrieved}`);
        } catch (error) {
            this.logResult(false, `Error en localStorage: ${error.message}`);
        }
        
        // Test 2: Check project data structure
        this.currentTest = 'Estructura de datos de proyecto';
        try {
            const currentProject = localStorage.getItem('sunstone_current_project');
            if (currentProject) {
                const project = JSON.parse(currentProject);
                const hasRequiredFields = project.name && project.id && project.created;
                const hasDiscoveryModule = project.discovery;
                const hasStrategyModule = project.strategy;
                
                this.logResult(hasRequiredFields && hasDiscoveryModule && hasStrategyModule, 
                    `Campos requeridos: ${hasRequiredFields}, Discovery: ${!!hasDiscoveryModule}, Strategy: ${!!hasStrategyModule}`);
            } else {
                this.logResult(true, 'No hay proyecto actual, estructura no verificable');
            }
        } catch (error) {
            this.logResult(false, `Error en estructura de datos: ${error.message}`);
        }
    }

    async testErrorHandling() {
        console.log('⚠️ Probando manejo de errores...');
        
        // Test 1: Check notification system
        this.currentTest = 'Sistema de notificaciones';
        try {
            // Test if notification function exists
            const hasNotification = typeof window.SunstoneUtils?.showNotification === 'function' ||
                                  typeof window.sunstoneApp?.showNotification === 'function';
            
            this.logResult(hasNotification, `Función de notificación: ${hasNotification}`);
        } catch (error) {
            this.logResult(false, `Error en notificaciones: ${error.message}`);
        }
        
        // Test 2: Check loading states
        this.currentTest = 'Estados de carga';
        try {
            const hasLoading = typeof window.SunstoneUtils?.showLoading === 'function' ||
                             typeof window.sunstoneApp?.showLoading === 'function';
            
            this.logResult(hasLoading, `Función de loading: ${hasLoading}`);
        } catch (error) {
            this.logResult(false, `Error en loading: ${error.message}`);
        }
    }

    logResult(success, message) {
        const result = {
            test: this.currentTest,
            success: success,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        this.testResults.push(result);
        
        const statusIcon = success ? '✅' : '❌';
        console.log(`${statusIcon} ${this.currentTest}: ${message}`);
    }

    generateReport() {
        console.log('\n📋 Generando reporte de pruebas...\n');
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        
        console.log('📊 RESUMEN DE PRUEBAS');
        console.log('═══════════════════════');
        console.log(`Total de pruebas: ${totalTests}`);
        console.log(`✅ Aprobadas: ${passedTests}`);
        console.log(`❌ Fallidas: ${failedTests}`);
        console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests/totalTests)*100)}%`);
        
        if (failedTests > 0) {
            console.log('\n🔍 PRUEBAS FALLIDAS:');
            console.log('═══════════════════');
            this.testResults
                .filter(r => !r.success)
                .forEach(result => {
                    console.log(`❌ ${result.test}: ${result.message}`);
                });
        }
        
        // Generate HTML report
        this.generateHTMLReport();
        
        console.log('\n🎉 Pruebas completadas!');
        console.log('📄 Reporte HTML generado en la página');
    }

    generateHTMLReport() {
        const reportContainer = document.createElement('div');
        reportContainer.id = 'test-report';
        reportContainer.className = 'fixed top-4 left-4 right-4 bottom-4 bg-white rounded-lg shadow-xl z-50 overflow-auto p-6';
        
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const successRate = Math.round((passedTests/totalTests)*100);
        
        reportContainer.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Reporte de Pruebas - Sunstone Platform</h2>
                <button onclick="this.parentElement.parentElement.remove()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <div class="grid grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-blue-600">${totalTests}</div>
                    <div class="text-sm text-blue-800">Total Pruebas</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${passedTests}</div>
                    <div class="text-sm text-green-800">Aprobadas</div>
                </div>
                <div class="bg-red-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-red-600">${totalTests - passedTests}</div>
                    <div class="text-sm text-red-800">Fallidas</div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-purple-600">${successRate}%</div>
                    <div class="text-sm text-purple-800">Éxito</div>
                </div>
            </div>
            
            <div class="space-y-4">
                ${this.testResults.map(result => `
                    <div class="border rounded-lg p-4 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}">${result.test}</h3>
                            <span class="text-2xl">${result.success ? '✅' : '❌'}</span>
                        </div>
                        <p class="text-sm ${result.success ? 'text-green-700' : 'text-red-700'} mt-2">${result.message}</p>
                        <p class="text-xs text-gray-500 mt-1">${new Date(result.timestamp).toLocaleString()}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(reportContainer);
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add test button to interface
    const testButton = document.createElement('button');
    testButton.innerHTML = '<i class="fas fa-vial mr-2"></i>Ejecutar Pruebas';
    testButton.className = 'fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 z-40';
    testButton.onclick = () => {
        const tester = new SunstoneTester();
        tester.runAllTests();
    };
    
    document.body.appendChild(testButton);
    
    console.log('🧪 Test suite loaded. Click the button to run tests.');
});