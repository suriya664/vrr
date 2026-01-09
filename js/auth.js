/**
 * Authentication JavaScript
 * Handles login and registration functionality
 */

$(document).ready(function() {
    'use strict';

    // ===== LOGIN FORM =====
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        
        // Validate inputs
        if (!email || !password) {
            showAlert('Please fill in all fields.', 'error');
            return;
        }

        // Simulate login with AJAX
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                // Simulate authentication check
                setTimeout(function() {
                    // Store user session (simulated)
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    showAlert('Login successful! Redirecting...', 'success');
                    
                    setTimeout(function() {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                }, 500);
            },
            error: function() {
                // Even on error, simulate successful login for demo
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                showAlert('Login successful! Redirecting...', 'success');
                
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }
        });
    });

    // ===== REGISTRATION FORM =====
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#register-name').val();
        const email = $('#register-email').val();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields.', 'error');
            return;
        }

        // Check password match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match.', 'error');
            return;
        }

        // Check password strength
        const strength = calculatePasswordStrength(password);
        if (strength < 2) {
            showAlert('Password is too weak. Please use a stronger password.', 'error');
            return;
        }

        // Simulate registration with AJAX
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                setTimeout(function() {
                    // Store user data (simulated)
                    const userData = {
                        name: name,
                        email: email,
                        registeredAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('userData', JSON.stringify(userData));
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('isLoggedIn', 'true');
                    
                    showAlert('Registration successful! Redirecting to dashboard...', 'success');
                    
                    setTimeout(function() {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                }, 500);
            },
            error: function() {
                // Simulate successful registration
                const userData = {
                    name: name,
                    email: email,
                    registeredAt: new Date().toISOString()
                };
                
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('userEmail', email);
                localStorage.setItem('isLoggedIn', 'true');
                
                showAlert('Registration successful! Redirecting to dashboard...', 'success');
                
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
    });

    // ===== PASSWORD STRENGTH CALCULATOR =====
    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    }

    // ===== PASSWORD STRENGTH INDICATOR =====
    $('#register-password').on('input', function() {
        const password = $(this).val();
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthIndicator(strength);
    });

    function updatePasswordStrengthIndicator(strength) {
        const indicator = $('#password-strength');
        if (!indicator.length) return;

        indicator.removeClass('weak medium strong').text('');

        if (strength === 0) {
            indicator.text('');
            return;
        }

        if (strength <= 2) {
            indicator.addClass('weak').text('Weak Password');
            indicator.css('color', '#ec4899');
        } else if (strength === 3) {
            indicator.addClass('medium').text('Medium Password');
            indicator.css('color', '#f59e0b');
        } else {
            indicator.addClass('strong').text('Strong Password');
            indicator.css('color', '#00d4ff');
        }
    }

    // ===== ALERT FUNCTION =====
    function showAlert(message, type) {
        const alert = $('<div>')
            .addClass('alert alert-' + type)
            .text(message)
            .css({
                position: 'fixed',
                top: '100px',
                right: '20px',
                zIndex: '9999',
                minWidth: '300px'
            });
        
        $('body').append(alert);
        
        setTimeout(function() {
            alert.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // ===== CHECK IF ALREADY LOGGED IN =====
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // Optionally redirect to dashboard
        // window.location.href = 'dashboard.html';
    }
});


