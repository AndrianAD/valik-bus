/* ========================================
   Валік Бус — Main JavaScript
   ======================================== */

(function () {
    'use strict';

    // --- Data Loading ---
    async function loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error loading data:', err);
            return null;
        }
    }

    // --- Icon Map ---
    const iconMap = {
        clock: 'fas fa-clock',
        wallet: 'fas fa-wallet',
        shield: 'fas fa-shield-halved',
        star: 'fas fa-star',
        bus: 'fas fa-bus',
        map: 'fas fa-map-marker-alt',
    };

    // --- Render Routes ---
    function renderRoutes(routes) {
        const grid = document.getElementById('routes-grid');
        if (!grid || !routes) return;

        grid.innerHTML = routes.map((route, i) => `
            <div class="route-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="route-card-route">
                    <span class="route-card-city">${route.from}</span>
                    <span class="route-card-arrow"><i class="fas fa-arrows-left-right"></i></span>
                    <span class="route-card-city">${route.to}</span>
                </div>
                <div class="route-card-info">
                    <div class="route-card-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${route.schedule}</span>
                    </div>
                    <div class="route-card-detail">
                        <i class="fas fa-clock"></i>
                        <span>${route.duration}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // --- Render Advantages ---
    function renderAdvantages(advantages) {
        const grid = document.getElementById('advantages-grid');
        if (!grid || !advantages) return;

        grid.innerHTML = advantages.map((adv, i) => `
            <div class="advantage-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="advantage-icon">
                    <i class="${iconMap[adv.icon] || 'fas fa-check'}"></i>
                </div>
                <h3>${adv.title}</h3>
                <p>${adv.text}</p>
            </div>
        `).join('');
    }

    // --- Render Stats ---
    function renderStats(stats) {
        const container = document.getElementById('stats');
        if (!container || !stats) return;

        container.innerHTML = stats.map((stat, i) => `
            <div class="stat-item" data-aos="fade-up" data-aos-delay="${i * 100}">
                <div class="stat-value" data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `).join('');
    }

    // --- Render News ---
    function renderNews(news) {
        const grid = document.getElementById('news-grid');
        if (!grid || !news) return;

        grid.innerHTML = news.map((item, i) => {
            const date = new Date(item.date);
            const formatted = date.toLocaleDateString('uk-UA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            return `
                <div class="news-card" data-aos="fade-up" data-aos-delay="${i * 100}">
                    <div class="news-date">
                        <i class="fas fa-calendar"></i>
                        ${formatted}
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            `;
        }).join('');
    }

    // --- Render About ---
    function renderAbout(about) {
        const el = document.getElementById('about-text');
        if (el && about) el.textContent = about;
    }

    // --- Update Contacts ---
    function updateContacts(company) {
        if (!company) return;

        const phone = company.phone;
        const phoneClean = phone.replace(/\s/g, '');

        // Header phone
        const headerPhone = document.getElementById('header-phone-number');
        if (headerPhone) headerPhone.textContent = phone;

        // Hero phone
        const heroPhone = document.getElementById('hero-phone');
        if (heroPhone) heroPhone.textContent = phone;

        // Update all phone links
        document.querySelectorAll('a[href^="tel:"]').forEach(el => {
            el.href = `tel:${phoneClean}`;
        });

        // Viber
        if (company.viber) {
            const viberClean = company.viber.replace(/\s/g, '').replace('+', '%2B');
            const heroViber = document.getElementById('hero-viber-link');
            if (heroViber) heroViber.href = `viber://chat?number=${viberClean}`;
            const contactViber = document.getElementById('contact-viber-card');
            if (contactViber) contactViber.href = `viber://chat?number=${viberClean}`;
        }

        // Telegram
        if (company.telegram) {
            const tgHandle = company.telegram.replace('@', '');
            const heroTg = document.getElementById('hero-telegram-link');
            if (heroTg) heroTg.href = `https://t.me/${tgHandle}`;
            const contactTg = document.getElementById('contact-telegram-card');
            if (contactTg) contactTg.href = `https://t.me/${tgHandle}`;
            const contactTgText = document.getElementById('contact-telegram');
            if (contactTgText) contactTgText.textContent = company.telegram;
        }

        // WhatsApp
        if (company.whatsapp) {
            const waClean = company.whatsapp.replace(/\s/g, '').replace('+', '');
            const heroWa = document.getElementById('hero-whatsapp-link');
            if (heroWa) heroWa.href = `https://wa.me/${waClean}`;
            const contactWa = document.getElementById('contact-whatsapp-card');
            if (contactWa) contactWa.href = `https://wa.me/${waClean}`;
        }

        // Contact phone text
        const contactPhone = document.getElementById('contact-phone');
        if (contactPhone) contactPhone.textContent = phone;
    }

    // --- Animated Counter ---
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-value[data-target]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);

                        if (current >= 1000) {
                            el.textContent = current.toLocaleString('uk-UA') + suffix;
                        } else {
                            el.textContent = current + suffix;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // --- Header Scroll ---
    function initHeader() {
        const header = document.getElementById('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // --- Burger Menu ---
    function initBurger() {
        const burger = document.getElementById('burger');
        const nav = document.getElementById('nav');

        if (!burger || !nav) return;

        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Active Nav Link ---
    function initActiveNav() {
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle('active',
                            link.getAttribute('href') === `#${entry.target.id}`);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // --- Loader ---
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 300);
        }
    }

    // --- Init ---
    async function init() {
        const data = await loadData();

        if (data) {
            renderRoutes(data.routes);
            renderAdvantages(data.advantages);
            renderStats(data.stats);
            renderNews(data.news);
            renderAbout(data.about);
            updateContacts(data.company);
        }

        // Init AOS
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });

        initHeader();
        initBurger();
        initActiveNav();
        animateCounters();
        hideLoader();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
