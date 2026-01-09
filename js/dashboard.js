/**
 * Dashboard JavaScript
 * Handles dashboard data loading, analytics, and interactions
 */

$(document).ready(function() {
    'use strict';

    // ===== CHECK AUTHENTICATION =====
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // ===== LOAD USER DATA =====
    loadUserData();
    loadDashboardData();
    loadAnalyticsData();

    // ===== SIDEBAR TOGGLE (MOBILE) =====
    $('.sidebar-toggle').on('click', function() {
        $('.dashboard-sidebar').toggleClass('active');
    });

    // ===== LOAD USER DATA =====
    function loadUserData() {
        const userData = localStorage.getItem('userData');
        const userEmail = localStorage.getItem('userEmail');
        
        if (userData) {
            const user = JSON.parse(userData);
            $('.user-name').text(user.name || 'User');
            $('.user-email').text(user.email || userEmail || 'user@example.com');
        } else if (userEmail) {
            $('.user-name').text(userEmail.split('@')[0]);
            $('.user-email').text(userEmail);
        }
    }

    // ===== LOAD DASHBOARD DATA VIA AJAX =====
    function loadDashboardData() {
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.dashboard) {
                    updateDashboardStats(data.dashboard.stats);
                    updateRecentActivity(data.dashboard.recentActivity);
                }
            },
            error: function() {
                // Use default data if JSON fails
                updateDashboardStats({
                    totalUsers: 1250,
                    activeSessions: 342,
                    revenue: 125000,
                    products: 45
                });
            }
        });
    }

    // ===== UPDATE DASHBOARD STATS =====
    function updateDashboardStats(stats) {
        if (stats.totalUsers) {
            animateValue('.stat-total-users', stats.totalUsers);
        }
        if (stats.activeSessions) {
            animateValue('.stat-active-sessions', stats.activeSessions);
        }
        if (stats.revenue) {
            animateValue('.stat-revenue', stats.revenue, '$');
        }
        if (stats.products) {
            animateValue('.stat-products', stats.products);
        }
    }

    // ===== ANIMATE VALUE COUNTER =====
    function animateValue(selector, endValue, prefix = '') {
        const element = $(selector);
        if (!element.length) return;

        const duration = 2000;
        const startValue = 0;
        const increment = endValue / (duration / 16);
        let current = startValue;

        const timer = setInterval(function() {
            current += increment;
            if (current >= endValue) {
                element.text(prefix + endValue.toLocaleString());
                clearInterval(timer);
            } else {
                element.text(prefix + Math.floor(current).toLocaleString());
            }
        }, 16);
    }

    // ===== UPDATE RECENT ACTIVITY =====
    function updateRecentActivity(activities) {
        const tbody = $('#activity-table tbody');
        if (!tbody.length || !activities) return;

        tbody.empty();
        
        activities.forEach(function(activity) {
            const row = $('<tr>');
            row.append($('<td>').text(activity.date));
            row.append($('<td>').text(activity.user));
            row.append($('<td>').text(activity.action));
            row.append($('<td>').text(activity.status));
            tbody.append(row);
        });
    }

    // ===== LOAD ANALYTICS DATA =====
    function loadAnalyticsData() {
        $.ajax({
            url: 'data/mock-data.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.analytics) {
                    renderCharts(data.analytics);
                }
            },
            error: function() {
                // Render default charts
                renderCharts({
                    userGrowth: [120, 150, 180, 200, 250, 300, 350],
                    revenue: [10000, 15000, 12000, 18000, 20000, 25000, 30000],
                    productViews: [450, 520, 480, 600, 750, 800, 900]
                });
            }
        });
    }

    // ===== RENDER CHARTS =====
    function renderCharts(data) {
        // User Growth Chart
        if (data.userGrowth) {
            renderBarChart('#user-growth-chart', data.userGrowth, 'Users');
        }

        // Revenue Chart
        if (data.revenue) {
            renderLineChart('#revenue-chart', data.revenue, 'Revenue', '$');
        }

        // Product Views Chart
        if (data.productViews) {
            renderBarChart('#product-views-chart', data.productViews, 'Views');
        }
    }

    // ===== BAR CHART RENDERER =====
    function renderBarChart(containerId, data, label) {
        const container = $(containerId);
        if (!container.length) return;

        container.empty();
        const maxValue = Math.max(...data);
        const chartHeight = 200;

        data.forEach(function(value, index) {
            const barHeight = (value / maxValue) * chartHeight;
            const bar = $('<div>')
                .css({
                    display: 'inline-block',
                    width: (100 / data.length) + '%',
                    height: barHeight + 'px',
                    backgroundColor: 'rgba(0, 212, 255, 0.6)',
                    margin: '0 2px',
                    verticalAlign: 'bottom',
                    position: 'relative',
                    borderRadius: '5px 5px 0 0'
                })
                .attr('title', label + ': ' + value);
            
            const labelDiv = $('<div>')
                .text(value)
                .css({
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: '#00d4ff'
                });
            
            bar.append(labelDiv);
            container.append(bar);
        });
    }

    // ===== LINE CHART RENDERER =====
    function renderLineChart(containerId, data, label, prefix = '') {
        const container = $(containerId);
        if (!container.length) return;

        container.empty();
        const maxValue = Math.max(...data);
        const chartHeight = 200;
        const chartWidth = container.width() || 600;
        const pointSpacing = chartWidth / data.length;

        const svg = $('<svg>')
            .attr('width', chartWidth)
            .attr('height', chartHeight)
            .css('display', 'block');

        let pathData = '';
        data.forEach(function(value, index) {
            const x = index * pointSpacing;
            const y = chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                pathData += 'M ' + x + ' ' + y;
            } else {
                pathData += ' L ' + x + ' ' + y;
            }

            // Add circle at each point
            const circle = $('<circle>')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 4)
                .attr('fill', '#00d4ff')
                .attr('title', prefix + value);
            svg.append(circle);
        });

        const path = $('<path>')
            .attr('d', pathData)
            .attr('stroke', '#00d4ff')
            .attr('stroke-width', '2')
            .attr('fill', 'none');
        
        svg.prepend(path);
        container.append(svg);
    }

    // ===== DATE FILTER =====
    $('.date-filter').on('change', function() {
        const filter = $(this).val();
        loadAnalyticsData(); // Reload with filter
    });

    // ===== LOGOUT FUNCTION =====
    $('.logout-btn, .logout-btn-nav').on('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        }
    });

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
});

