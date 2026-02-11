/**
 * CECyTE 23 Texcalac - Main Script
 * Personalizado con lógica de estado dinámica y contadores.
 */

let statsAnimated = false; 

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INDICADOR DE ESTADO (ABIERTO/CERRADO) ---
    const updateStatus = () => {
        const now = new Date();
        const day = now.getDay(); // 0: Dom, 1: Lun...
        const hour = now.getHours();
        
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('status-text');

        if (!dot || !text) return;

        // Tu mejora: Resetear clases para evitar duplicidad
        dot.className = "w-2 h-2 rounded-full transition-colors duration-500";
        text.classList.remove('text-green-400', 'text-red-400');

        // Horario: Lunes a Viernes de 8:00 a 13:00
        if (day >= 1 && day <= 5 && hour >= 8 && hour < 13) {
            dot.style.backgroundColor = '#4ade80';
            dot.classList.add('shadow-[0_0_10px_#4ade80]');
            text.innerText = 'Plantel Abierto';
            text.classList.add('text-green-400');
        } else {
            dot.style.backgroundColor = '#f87171';
            dot.classList.add('shadow-[0_0_10px_#f87171]');
            text.innerText = 'Cerrado - Lun-Vie 8-13h';
            text.classList.add('text-red-400');
        }
    };

    // --- 2. EFECTO DE CONTADORES ANIMADOS ---
    const animateStats = () => {
        const counters = [
            { id: 'count-estudiantes', target: 397 },
            { id: 'count-personal', target: 23 }
        ];

        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (!element) return;

            let start = 0;
            const duration = 2000; // 2 segundos
            const increment = counter.target / (duration / 16); // Fluidez a 60fps

            const updateCount = () => {
                start += increment;
                if (start < counter.target) {
                    element.innerText = Math.ceil(start);
                    requestAnimationFrame(updateCount);
                } else {
                    element.innerText = counter.target;
                }
            };
            updateCount();
        });
    };

    // --- 3. REVELACIÓN AL HACER SCROLL (Intersection Observer) ---
    const observerOptions = { 
        threshold: 0.2 // Se activa cuando el 20% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añade la clase de Tailwind/CSS para mostrar la tarjeta
                entry.target.classList.add('active');
                
                // Si la tarjeta que entra es la de estadísticas, dispara los contadores
                // BLINDAJE AGREGADO AQUÍ:
                if (entry.target.id === 'stats-trigger' && !statsAnimated) {
                    statsAnimated = true;
                    animateStats();
                    // Dejamos de observar después de la animación para ahorrar recursos
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Aplicar observador a todos los elementos con clase card-reveal
    document.querySelectorAll('.card-reveal').forEach(card => {
        observer.observe(card);
    });

    // --- EJECUCIÓN INICIAL ---
    updateStatus();
    
    // Opcional: Actualizar el estado cada minuto sin recargar
    setInterval(updateStatus, 60000);
});

/* Signature: Spiderweb Code 🕸️
   "El diseño es el embajador silencioso de la marca."
*/
