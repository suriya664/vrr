/**
 * VR/AR Product Website - Main JavaScript
 * Handles general UI interactions, animations, and AJAX requests
 */

$(document).ready(function() {
    'use strict';

    // ===== NAVBAR SCROLL EFFECT =====
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // ===== MOBILE MENU TOGGLE =====
    $('.mobile-menu-toggle').on('click', function() {
        $('.nav-menu').toggleClass('active');
    });

    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    // ===== TESTIMONIALS SLIDER =====
    let currentTestimonial = 0;
    const testimonials = $('.testimonial-item');
    const totalTestimonials = testimonials.length;

    function showTestimonial(index) {
        testimonials.removeClass('active');
        $('.testimonial-dot').removeClass('active');
        $(testimonials[index]).addClass('active');
        $('.testimonial-dot').eq(index).addClass('active');
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }

    // Auto-rotate testimonials
    if (testimonials.length > 0) {
        setInterval(nextTestimonial, 5000);
        
        // Manual dot navigation
        $('.testimonial-dot').on('click', function() {
            currentTestimonial = $(this).index();
            showTestimonial(currentTestimonial);
        });
    }

    // ===== PRODUCT FILTER =====
    $('.filter-btn').on('click', function() {
        const filter = $(this).data('filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        if (filter === 'all') {
            $('.product-card').fadeIn(300);
        } else {
            $('.product-card').each(function() {
                if ($(this).data('category') === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
        }
    });

    // ===== PRICING TOGGLE (MONTHLY/YEARLY) =====
    $('.toggle-switch').on('click', function() {
        $(this).toggleClass('active');
        const isYearly = $(this).hasClass('active');
        
        $('.pricing-price').each(function() {
            const monthlyPrice = parseFloat($(this).data('monthly'));
            const yearlyPrice = parseFloat($(this).data('yearly'));
            
            if (isYearly) {
                $(this).text('$' + yearlyPrice.toFixed(2));
            } else {
                $(this).text('$' + monthlyPrice.toFixed(2));
            }
        });
    });

    // ===== TABS FUNCTIONALITY =====
    $('.tab-btn').on('click', function() {
        const tabId = $(this).data('tab');
        
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        $('.tab-content').removeClass('active');
        $('#' + tabId).addClass('active');
    });

    // ===== ACCORDION FUNCTIONALITY =====
    $('.accordion-header').on('click', function() {
        const item = $(this).parent('.accordion-item');
        const isActive = item.hasClass('active');
        
        $('.accordion-item').removeClass('active');
        
        if (!isActive) {
            item.addClass('active');
        }
    });

    // ===== FORM VALIDATION =====
    $('form').on('submit', function(e) {
        let isValid = true;
        const form = $(this);
        
        form.find('.form-control[required]').each(function() {
            if (!$(this).val().trim()) {
                isValid = false;
                $(this).addClass('error');
            } else {
                $(this).removeClass('error');
            }
        });

        // Email validation
        const emailInputs = form.find('input[type="email"]');
        emailInputs.each(function() {
            const email = $(this).val();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                isValid = false;
                $(this).addClass('error');
            }
        });

        if (!isValid) {
            e.preventDefault();
            showAlert('Please fill in all required fields correctly.', 'error');
        }
    });

    // ===== AJAX FORM SUBMISSIONS =====
    
    // Newsletter Form
    $('#newsletter-form').on('submit', function(e) {
        e.preventDefault();
        const email = $('#newsletter-email').val();
        
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                // Simulate API call
                setTimeout(function() {
                    showAlert('Thank you for subscribing!', 'success');
                    $('#newsletter-email').val('');
                }, 500);
            },
            error: function() {
                showAlert('Subscription successful!', 'success');
                $('#newsletter-email').val('');
            }
        });
    });

    // Contact Form
    $('#contact-form').on('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: $('#contact-name').val(),
            email: $('#contact-email').val(),
            message: $('#contact-message').val()
        };

        // Simulate AJAX submission
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                setTimeout(function() {
                    showAlert('Thank you for your message! We will get back to you soon.', 'success');
                    $('#contact-form')[0].reset();
                }, 500);
            },
            error: function() {
                showAlert('Message sent successfully!', 'success');
                $('#contact-form')[0].reset();
            }
        });
    });

    // Demo Request Form
    $('#demo-form').on('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: $('#demo-name').val(),
            email: $('#demo-email').val(),
            company: $('#demo-company').val()
        };

        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                setTimeout(function() {
                    showAlert('Demo request submitted! We will contact you shortly.', 'success');
                    $('#demo-form')[0].reset();
                }, 500);
            },
            error: function() {
                showAlert('Demo request submitted successfully!', 'success');
                $('#demo-form')[0].reset();
            }
        });
    });

    // ===== ALERT FUNCTION =====
    function showAlert(message, type) {
        const alert = $('<div>')
            .addClass('alert alert-' + type)
            .text(message);
        
        $('body').prepend(alert);
        
        setTimeout(function() {
            alert.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // ===== ANIMATE ON SCROLL =====
    function animateOnScroll() {
        $('.card, .feature-card, .product-card').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in');
            }
        });
    }

    $(window).on('scroll', animateOnScroll);
    animateOnScroll();

    // ===== PASSWORD STRENGTH INDICATOR =====
    $('#register-password').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    }

    function updatePasswordStrengthIndicator(strength) {
        const indicator = $('#password-strength');
        if (!indicator.length) return;

        indicator.removeClass('weak medium strong');
        indicator.text('');

        if (strength === 0) return;

        if (strength <= 2) {
            indicator.addClass('weak').text('Weak');
        } else if (strength === 3) {
            indicator.addClass('medium').text('Medium');
        } else {
            indicator.addClass('strong').text('Strong');
        }
    }

    // ===== THEME TOGGLE =====
    $('.theme-toggle').on('click', function() {
        $('body').toggleClass('light-mode');
        const isLight = $('body').hasClass('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        $('body').addClass('light-mode');
    }

    // ===== INITIALIZE =====
    console.log('VR/AR Website initialized');
});

