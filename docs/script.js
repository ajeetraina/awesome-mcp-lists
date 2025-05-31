// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Reset any active filters when switching sections
    resetFilters();
}

// Search functionality
function filterItems(searchTerm, cardClass) {
    const cards = document.querySelectorAll('.' + cardClass);
    const lowerSearchTerm = searchTerm.toLowerCase();

    cards.forEach(card => {
        const title = card.querySelector('.server-title').textContent.toLowerCase();
        const description = card.querySelector('.server-description').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

        if (title.includes(lowerSearchTerm) || 
            description.includes(lowerSearchTerm) || 
            tags.includes(lowerSearchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update visible counts after filtering
    updateVisibleCounts();
}

// Category filtering
function filterByCategory(category, cardClass) {
    const cards = document.querySelectorAll('.' + cardClass);

    cards.forEach(card => {
        if (category === '' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Update visible counts after filtering
    updateVisibleCounts();
}

// Reset all filters
function resetFilters() {
    // Clear search inputs
    const searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(bar => bar.value = '');

    // Reset category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.value = '';
        filter.classList.remove('active');
    });

    // Show all cards
    const allCards = document.querySelectorAll('.server-card, .tool-card');
    allCards.forEach(card => card.style.display = 'block');

    // Update counts
    updateVisibleCounts();
}

// Update visible item counts
function updateVisibleCounts() {
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.server-card, .tool-card');
        const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
        
        // You could add count displays here if needed
        // For now, we'll just ensure the section is visible if it has visible cards
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Smooth scrolling for anchor links
function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle responsive navigation
function handleResponsiveNav() {
    const tabs = document.querySelectorAll('.tab');
    const windowWidth = window.innerWidth;

    if (windowWidth <= 768) {
        // Mobile behavior
        tabs.forEach(tab => {
            tab.style.marginBottom = '10px';
        });
    } else {
        // Desktop behavior
        tabs.forEach(tab => {
            tab.style.marginBottom = '0';
        });
    }
}

// Search suggestions functionality
function initializeSearchSuggestions() {
    const searchBars = document.querySelectorAll('.search-bar');
    
    searchBars.forEach(searchBar => {
        searchBar.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            if (value.length > 0) {
                // Add search suggestions logic here if needed
                this.setAttribute('data-searching', 'true');
            } else {
                this.removeAttribute('data-searching');
            }
        });
    });
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Escape key to clear search
        if (event.key === 'Escape') {
            resetFilters();
        }

        // Tab navigation between sections
        if (event.key === 'Tab' && event.ctrlKey) {
            event.preventDefault();
            const tabs = document.querySelectorAll('.tab');
            const activeTab = document.querySelector('.tab.active');
            const currentIndex = Array.from(tabs).indexOf(activeTab);
            const nextIndex = (currentIndex + 1) % tabs.length;
            
            tabs[nextIndex].click();
        }
    });
}

// Analytics and tracking (placeholder)
function trackInteraction(action, category, label) {
    // Add analytics tracking here if needed
    console.log('Track:', action, category, label);
}

// Initialize tooltips
function initializeTooltips() {
    const cards = document.querySelectorAll('.server-card, .tool-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add hover effects or tooltips
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Handle external link clicks
function handleExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackInteraction('click', 'external_link', this.href);
        });
    });
}

// Initialize lazy loading for better performance
function initializeLazyLoading() {
    const cards = document.querySelectorAll('.server-card, .tool-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize theme switching (future feature)
function initializeTheme() {
    const savedTheme = localStorage.getItem('mcp-portal-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Update statistics dynamically
function updateStatistics() {
    const serverCards = document.querySelectorAll('.server-card').length;
    const clientCards = document.querySelectorAll('#clients .tool-card').length;
    const toolCards = document.querySelectorAll('#tools .tool-card').length;
    
    // Update stat numbers if they exist
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = serverCards + '+';
        statNumbers[1].textContent = clientCards + '+';
        statNumbers[2].textContent = toolCards + '+';
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    handleResponsiveNav();
    initializeSearchSuggestions();
    initializeKeyboardNavigation();
    initializeTooltips();
    handleExternalLinks();
    initializeLazyLoading();
    initializeTheme();
    updateStatistics();
    
    // Set up responsive handler
    window.addEventListener('resize', handleResponsiveNav);
    
    // Initial filter update
    updateVisibleCounts();
    
    console.log('MCP Portal initialized successfully!');
});

// Service worker registration for offline support (future feature)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}