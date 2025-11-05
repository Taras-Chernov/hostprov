document.addEventListener('DOMContentLoaded', function() {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.dot');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            let currentSlide = 0;

            function showSlide(n) {
                slides.forEach(slide => slide.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                currentSlide = (n + slides.length) % slides.length;
                
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }

            function nextSlide() {
                showSlide(currentSlide + 1);
            }

            function prevSlide() {
                showSlide(currentSlide - 1);
            }

            // Автопереключение каждые 8 секунд
            let slideInterval = setInterval(nextSlide, 8000);

            function resetInterval() {
                clearInterval(slideInterval);
                slideInterval = setInterval(nextSlide, 8000);
            }

            // События
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });

            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    showSlide(parseInt(this.getAttribute('data-slide')));
                    resetInterval();
                });
            });

            // Клавиатура
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetInterval();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetInterval();
                }
            });
        });