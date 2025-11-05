document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    // Создаем мобильное меню
    const navLinks = [
        { href: '#products', text: 'ПРОДУКТЫ' },
        { href: '#licenses', text: 'ЛИЦЕНЗИИ 1C' },
        { href: '#about', text: 'О НАС' },
        { href: '#contact', text: 'КОНТАКТЫ' }
    ];
    
    navLinks.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        a.className = 'mobile-nav-link';
        mobileMenu.appendChild(a);
    });
    
    document.querySelector('.main-header').appendChild(mobileMenu);
    
    // Обработчик клика по кнопке меню
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('mobile-nav-link')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-container')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Изменение шапки при скролле
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});