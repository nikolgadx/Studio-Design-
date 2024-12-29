
class AppManager {
    constructor() {
        this.initializeComponents();
    }

    initializeComponents() {
        this.typed = new TypeWriter();
        this.scroll = new ScrollAnimator();
        this.briefing = new BriefingManager();
        this.parallax = new ParallaxEffect();
    }
}


class TypeWriter {
    constructor() {
        this.textElement = document.querySelector('.typed-text');
        this.words = [
            'Sites Profissionais',
            'Lojas Virtuais',
            'Identidades Visuais',
            'Apps Modernos',
            'Designs Únicos',
            'Experiências Incríveis'
        ];
        this.wait = 3000;
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.textElement.textContent = this.txt;

        let typeSpeed = 100;

        if(this.isDeleting) {
            typeSpeed /= 2;
        }

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}


class ScrollAnimator {
    constructor() {
        this.items = document.querySelectorAll('.reveal');
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.checkItems();
            this.highlightNavigation();
        });
        this.checkItems();
    }

    checkItems() {
        const triggerBottom = window.innerHeight * 0.8;

        this.items.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            if(itemTop < triggerBottom) {
                item.classList.add('active');
            }
        });
    }

    highlightNavigation() {
        const scrollPosition = window.scrollY;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.menu-item').forEach(item => {
                    item.classList.remove('active');
                    if(item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
}


class FormManager {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        // Aqui você pode adicionar a lógica de envio do formulário
        this.showNotification('Mensagem enviada com sucesso!');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
}


class ParallaxEffect {
    constructor() {
        this.blobs = document.querySelectorAll('.blob');
        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => this.moveBlobs(e));
    }

    moveBlobs(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        this.blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - window.innerWidth / 2) * speed / 100;
            const y = (mouseY - window.innerHeight / 2) * speed / 100;
            
            blob.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}


class BriefingManager {
    constructor() {
        this.form = document.querySelector('.briefing-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupFormValidation();
        this.setupFloatingLabels();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
        });
    }

    validateField(field) {
        const parent = field.parentElement;
        const errorClass = 'form-error';

        
        const existingError = parent.querySelector('.error-message');
        if (existingError) existingError.remove();

        
        if (field.value.trim() === '') {
            this.showError(field, 'Este campo é obrigatório');
            return false;
        }

        switch (field.id) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    this.showError(field, 'Email inválido');
                    return false;
                }
                break;

            case 'budget':
                if (isNaN(field.value) || field.value <= 0) {
                    this.showError(field, 'Valor inválido');
                    return false;
                }
                break;
        }

        parent.classList.remove(errorClass);
        return true;
    }

    showError(field, message) {
        const parent = field.parentElement;
        parent.classList.add('form-error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        parent.appendChild(errorDiv);
    }

    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });

          
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();

       
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        const formData = new FormData(this.form);
        const briefingData = Object.fromEntries(formData.entries());

        try {
       ;
            
            this.showNotification('Briefing enviado com sucesso! Entraremos em contato em breve.', 'success');
            this.form.reset();
        } catch (error) {
            this.showNotification('Erro ao enviar briefing. Tente novamente.', 'error');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

       
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    
    async sendBriefing(data) {
       
        return new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new AppManager();
});