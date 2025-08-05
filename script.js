
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Menu Mobile Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Toggle menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Previne scroll quando menu está aberto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Fechar menu ao clicar em link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona classe scrolled quando rola a página
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveLink() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Chama na inicialização

    // Smooth scrolling para links internos
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Validação básica
            if (!name || !phone || !service || !message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Simular envio
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Sistema de notificações
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--accent-color)' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Animações de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .about-stat, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));

    // Contadores animados
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // WhatsApp floating button
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const phone = '5511999999999'; // Substitua pelo número real
            const message = 'Olá! Gostaria de solicitar um orçamento para os serviços da Stone Zeladoria.';
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }

    // Inicializa a galeria automática
    let autoGalleryInstance;

    window.openGallery = function() {
        const gallerySection = document.getElementById("galeria-jardinagem");
        const servicesSection = document.getElementById("services");
        
        servicesSection.style.display = "none";
        gallerySection.style.display = "block";
        
        gallerySection.scrollIntoView({ 
            behavior: "smooth",
            block: "start"
        });
        
        setTimeout(() => {
            gallerySection.style.opacity = "0";
            gallerySection.style.transform = "translateY(30px)";
            gallerySection.style.transition = "all 0.6s ease";
            
            setTimeout(() => {
                gallerySection.style.opacity = "1";
                gallerySection.style.transform = "translateY(0)";
            }, 100);
        }, 100);

        if (!autoGalleryInstance) {
            autoGalleryInstance = new AutoGallery();
        } else {
            autoGalleryInstance.loadImages(); // Recarrega as imagens caso a pasta tenha sido atualizada
        }
    };

    window.closeGallery = function() {
        const gallerySection = document.getElementById("galeria-jardinagem");
        const servicesSection = document.getElementById("services");
        
        gallerySection.style.opacity = "0";
        gallerySection.style.transform = "translateY(-30px)";
        
        setTimeout(() => {
            gallerySection.style.display = "none";
            servicesSection.style.display = "block";
            
            servicesSection.scrollIntoView({ 
                behavior: "smooth",
                block: "start"
            });
            
            gallerySection.style.opacity = "";
            gallerySection.style.transform = "";
        }, 300);
    };

});

// Sistema de Galeria Automática
class AutoGallery {
    constructor() {
        this.galleryContainer = document.getElementById("galeria-jardinagem").querySelector(".gallery-grid");
        this.modal = null;
        this.currentImageIndex = 0;
        this.validImages = [];
        this.init();
    }

    init() {
        this.createModal();
        this.loadImages();
    }

    createModal() {
        this.modal = document.createElement("div");
        this.modal.className = "modal";
        this.modal.id = "imageModal";
        this.modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img id="modalImage" src="" alt="">
                <div class="modal-nav">
                    <button id="prevBtn"><i class="fas fa-chevron-left"></i></button>
                    <button id="nextBtn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        const closeModalBtn = this.modal.querySelector(".close-modal");
        closeModalBtn.addEventListener("click", () => this.closeModal());

        const prevBtn = this.modal.querySelector("#prevBtn");
        prevBtn.addEventListener("click", () => this.prevImage());

        const nextBtn = this.modal.querySelector("#nextBtn");
        nextBtn.addEventListener("click", () => this.nextImage());
        
        this.modal.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.addEventListener("keydown", (e) => this.handleModalKeydown(e));
    }

    async loadImages() {
        const specificImages = [
            '1.zlt.jpg', '2.zlt.jpg', '3.zlt.jpg', '4.zlt.jpg', '5.zlt.jpg',
            '6.zlt.jpg', '7.zlt.jpg', '8.zlt.jpg', '9.zlt.jpg', '10.zlt.jpg'
        ];

        this.validImages = [];

        for (const imageName of specificImages) {
            try {
                const response = await fetch(`galeria/${imageName}`, { method: 'HEAD' });
                if (response.ok) {
                    this.validImages.push(imageName);
                }
            } catch (error) {
                // Imagem não existe, continuar
            }
        }

        if (this.validImages.length === 0) {
            this.showEmptyMessage();
            return;
        }

        const galleryGrid = this.galleryContainer;
        galleryGrid.innerHTML = "";

        this.validImages.forEach(imageName => {
            const galleryItem = document.createElement("div");
            galleryItem.className = "gallery-item";
            galleryItem.onclick = () => this.openModal(`galeria/${imageName}`);
            galleryItem.innerHTML = `
                <img src="galeria/${imageName}" alt="Galeria Stone Zeladoria - ${imageName}">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;
            galleryGrid.appendChild(galleryItem);
        });
    }

    showEmptyMessage() {
        const gallerySection = document.getElementById("galeria-jardinagem");
        gallerySection.innerHTML = `
            <div class="container">
                <h2>Galeria de Jardinagem</h2>
                <p class="gallery-subtitle">Nenhuma imagem encontrada na pasta galeria.</p>
                <button class="close-gallery-btn" onclick="closeGallery()">
                    <i class="fas fa-times"></i> Fechar Galeria
                </button>
            </div>
        `;
    }

    openModal(imageSrc) {
        const modalImage = document.getElementById("modalImage");
        this.currentImageIndex = this.validImages.indexOf(imageSrc.replace("galeria/", ""));
        modalImage.src = imageSrc;
        this.modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    closeModal() {
        this.modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.validImages.length) % this.validImages.length;
        document.getElementById("modalImage").src = `galeria/${this.validImages[this.currentImageIndex]}`;
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.validImages.length;
        document.getElementById("modalImage").src = `galeria/${this.validImages[this.currentImageIndex]}`;
    }

    handleModalKeydown(e) {
        switch(e.key) {
            case 'Escape':
                this.closeModal();
                break;
            case 'ArrowLeft':
                this.prevImage();
                break;
            case 'ArrowRight':
                this.nextImage();
                break;
        }
    }
}





    window.openTrabalhoGallery = function() {
        const section = document.getElementById("galeria-trabalhos");
        section.style.display = "block";
        section.scrollIntoView({ behavior: "smooth" });

        const grid = section.querySelector(".gallery-trabalho-grid");
        grid.innerHTML = "";
        for (let i = 1; i <= 10; i++) {
            const img = document.createElement("div");
            img.className = "gallery-item";
            img.innerHTML = `
                <img src="trabalho${i}.jpg" alt="Trabalho ${i}">
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                </div>
            `;
            grid.appendChild(img);
        }
    };

    window.closeTrabalhoGallery = function() {
        const section = document.getElementById("galeria-trabalhos");
        section.style.display = "none";
    };
