/* ==========================================================================
   UTTAR SWEEKAR — SCRIPT.JS
   Vanilla JS only: mobile menu, smooth scroll close, testimonial scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------
       1. MOBILE HAMBURGER MENU
    --------------------------------------------------------- */
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');

    function toggleMenu() {
        var isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', toggleMenu);

        /* Close the mobile menu after a plain nav link (e.g. Home) is clicked */
        var navLinkItems = navLinks.querySelectorAll('.nav-link');
        navLinkItems.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navLinks.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }

    /* ---------------------------------------------------------
       1b. PRODUCTS / SERVICES NAV DROPDOWNS
    --------------------------------------------------------- */
    var dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var item = toggle.closest('.nav-item');
            var isOpen = item.classList.contains('open');

            /* Close any other open dropdown first */
            document.querySelectorAll('.nav-item.open').forEach(function (openItem) {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
                }
            });

            item.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    /* Close dropdowns when clicking anywhere outside them */
    document.addEventListener('click', function () {
        document.querySelectorAll('.nav-item.open').forEach(function (item) {
            item.classList.remove('open');
            item.querySelector('.dropdown-toggle').setAttribute('aria-expanded', 'false');
        });
    });

    /* Close the dropdown and the mobile menu after picking a product/service */
    var dropdownLinkItems = document.querySelectorAll('.dropdown-link');
    dropdownLinkItems.forEach(function (link) {
        link.addEventListener('click', function () {
            document.querySelectorAll('.nav-item.open').forEach(function (item) {
                item.classList.remove('open');
            });
            if (navLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    /* ---------------------------------------------------------
       1c. HERO BANNER SLIDESHOW (smooth crossfade between banners)
    --------------------------------------------------------- */
    var heroSlides = document.querySelectorAll('.hero-slide');
    var currentSlide = 0;
    var slideIntervalMs = 10000; // each banner stays visible for ~10 seconds before crossfading

    if (heroSlides.length > 1) {
        setInterval(function () {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, slideIntervalMs);
    }

    /* ---------------------------------------------------------
       2. TESTIMONIAL HORIZONTAL SCROLL BUTTONS
    --------------------------------------------------------- */
    var track = document.getElementById('testimonialTrack');
    var scrollLeftBtn = document.getElementById('scrollLeft');
    var scrollRightBtn = document.getElementById('scrollRight');
    var scrollAmount = 300; // pixels moved per click

    if (track && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', function () {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', function () {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* Custom moving scrollbar synced to the testimonial track's scroll position */
    var scrollThumb = document.getElementById('testimonialScrollThumb');

    if (track && scrollThumb) {
        var updateScrollThumb = function () {
            var trackRatio = track.clientWidth / track.scrollWidth;
            var thumbWidthPercent = Math.max(trackRatio * 100, 15);
            var maxScroll = track.scrollWidth - track.clientWidth;
            var scrollPercent = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
            var maxTranslatePercent = 100 - thumbWidthPercent;

            scrollThumb.style.width = thumbWidthPercent + '%';
            scrollThumb.style.transform = 'translateX(' + (scrollPercent * maxTranslatePercent) + '%)';
        };

        track.addEventListener('scroll', updateScrollThumb);
        window.addEventListener('resize', updateScrollThumb);
        updateScrollThumb();
    }

    /* ---------------------------------------------------------
       3. CATEGORY PAGE: click-to-expand product/service cards
       (Used on bracelets.html, crystals.html, tarot.html, etc.
       Safe to keep in this shared script.js — does nothing on
       pages that don't have a .category-card / #categoryModal.)
    --------------------------------------------------------- */
    var categoryCards = document.querySelectorAll('.category-card');
    var categoryModal = document.getElementById('categoryModal');

    if (categoryCards.length && categoryModal) {
        var modalImageBox = categoryModal.querySelector('.category-modal-image');
        var modalTitle = categoryModal.querySelector('.category-modal-title');
        var modalDesc = categoryModal.querySelector('.category-modal-desc');
        var modalClose = categoryModal.querySelector('.category-modal-close');

        var closeCategoryModal = function () {
            categoryModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        categoryCards.forEach(function (card) {
            card.addEventListener('click', function () {
                var cardImg = card.querySelector('img');
                var cardTitle = card.querySelector('.category-card-title');
                var cardDesc = card.querySelector('.category-card-desc');

                modalImageBox.innerHTML = cardImg
                    ? '<img src="' + cardImg.getAttribute('src') + '" alt="' + cardImg.getAttribute('alt') + '">'
                    : '';
                modalTitle.textContent = cardTitle ? cardTitle.textContent : '';
                modalDesc.textContent = cardDesc ? cardDesc.textContent : '';

                categoryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', closeCategoryModal);
        }

        /* Close when clicking the dark backdrop, or pressing Escape */
        categoryModal.addEventListener('click', function (e) {
            if (e.target === categoryModal) {
                closeCategoryModal();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && categoryModal.classList.contains('active')) {
                closeCategoryModal();
            }
        });
    }

});

/* ==========================================================================
   PRELOADER: show the logo until the page has fully loaded, then fade out
   (Safe on every page — does nothing if #preloader isn't present.)
   ========================================================================== */
window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (!preloader) {
        return;
    }
    preloader.classList.add('preloader-hidden');
    preloader.addEventListener('transitionend', function () {
        preloader.remove();
    });
});