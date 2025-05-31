// Global state management
const learningState = {
    currentSection: 'introduction',
    currentPlatform: 'macos',
    completedSections: new Set(),
    totalSections: 0
};

// Initialize the learning interface
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializePlatformSwitching();
    initializeProgressTracking();
    initializeKeyboardShortcuts();
    loadUserProgress();
    updateProgressBar();
    
    console.log('MCP Learning Portal initialized!');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
                updateActiveNavLink(this);
                updateCurrentSection(sectionId);
                scrollToTop();
                trackSectionView(sectionId);
            }
        });
    });

    // Count total sections for progress tracking
    learningState.totalSections = navLinks.length;
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        learningState.currentSection = sectionId;
        
        // Mark section as viewed
        learningState.completedSections.add(sectionId);
        saveUserProgress();
        updateProgressBar();
    }
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

// Update current section display
function updateCurrentSection(sectionId) {
    const currentSectionEl = document.getElementById('current-section');
    if (currentSectionEl) {
        const sectionNames = {
            'introduction': 'Introduction',
            'setup': 'Environment Setup',
            'claude-setup': 'Claude Desktop Setup',
            'server-basics': 'Server Fundamentals',
            'weather-server': 'Weather Server',
            'filesystem-server': 'Filesystem Server',
            'testing-server': 'Testing Server',
            'resources': 'Resources',
            'tools': 'Tools',
            'prompts': 'Prompts',
            'database-integration': 'Database Integration',
            'client-basics': 'Client Fundamentals',
            'build-client': 'Build Client',
            'client-integration': 'Client Integration',
            'debugging': 'Debugging',
            'security': 'Security',
            'deployment': 'Deployment',
            'project-portfolio': 'Portfolio Project',
            'project-chatbot': 'Chatbot Project',
            'project-automation': 'Automation Project'
        };
        
        currentSectionEl.textContent = sectionNames[sectionId] || 'Learning MCP';
    }
}

// Platform switching functionality
function initializePlatformSwitching() {
    // Platform badges in sidebar
    const platformBadges = document.querySelectorAll('.platform-badge');
    platformBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            switchPlatform(platform);
            updateActivePlatformBadge(this);
        });
    });

    // Platform tabs in content
    const platformTabs = document.querySelectorAll('.platform-tab');
    platformTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            switchPlatformContent(platform, this.closest('.section-content'));
            updateActivePlatformTab(this);
        });
    });

    // Auto-detect platform if possible
    autoDetectPlatform();
}

// Switch platform globally
function switchPlatform(platform) {
    learningState.currentPlatform = platform;
    
    // Update all platform content in current section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        switchPlatformContent(platform, currentSection);
    }
    
    // Update platform tabs
    const platformTabs = document.querySelectorAll('.platform-tab');
    platformTabs.forEach(tab => {
        if (tab.getAttribute('data-platform') === platform) {
            updateActivePlatformTab(tab);
        }
    });
    
    saveUserProgress();
    trackPlatformSwitch(platform);
}

// Switch platform content within a section
function switchPlatformContent(platform, container) {
    if (!container) return;
    
    const platformContents = container.querySelectorAll('.platform-content');
    platformContents.forEach(content => {
        content.classList.remove('active');
        if (content.classList.contains(platform)) {
            content.classList.add('active');
        }
    });
}

// Update active platform badge
function updateActivePlatformBadge(activeBadge) {
    const badges = document.querySelectorAll('.platform-badge');
    badges.forEach(badge => badge.classList.remove('active'));
    activeBadge.classList.add('active');
}

// Update active platform tab
function updateActivePlatformTab(activeTab) {
    const section = activeTab.closest('.section-content');
    const tabs = section.querySelectorAll('.platform-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
}

// Auto-detect platform
function autoDetectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    let detectedPlatform = 'macos'; // default
    
    if (userAgent.indexOf('linux') > -1) {
        detectedPlatform = 'linux';
    } else if (userAgent.indexOf('mac') > -1) {
        detectedPlatform = 'macos';
    }
    
    // Only auto-switch if user hasn't manually selected a platform
    if (!localStorage.getItem('mcp-learn-platform')) {
        switchPlatform(detectedPlatform);
        updateActivePlatformBadge(document.querySelector(`[data-platform="${detectedPlatform}"]`));
    }
}

// Progress tracking
function initializeProgressTracking() {
    updateProgressBar();
    
    // Mark sections as completed when scrolled to bottom
    window.addEventListener('scroll', debounce(checkSectionCompletion, 300));
}

// Update progress bar
function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill && learningState.totalSections > 0) {
        const completedCount = learningState.completedSections.size;
        const progressPercentage = (completedCount / learningState.totalSections) * 100;
        progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
    }
}

// Check if user has scrolled to bottom of section (mark as completed)
function checkSectionCompletion() {
    const activeSection = document.querySelector('.content-section.active');
    if (!activeSection) return;
    
    const rect = activeSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // If scrolled past 80% of the section, mark as completed
    if (rect.bottom <= viewportHeight * 1.2) {
        learningState.completedSections.add(learningState.currentSection);
        saveUserProgress();
        updateProgressBar();
    }
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only if not typing in an input
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowRight':
            case 'n':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    goToNextSection();
                }
                break;
            case 'ArrowLeft':
            case 'p':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    goToPrevSection();
                }
                break;
            case '1':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    switchPlatform('macos');
                }
                break;
            case '2':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    switchPlatform('linux');
                }
                break;
            case 'Escape':
                // Close any open modals or overlays
                break;
        }
    });
}

// Navigation functions
function goToNextSection() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.findIndex(link => 
        link.getAttribute('data-section') === learningState.currentSection
    );
    
    if (currentIndex < navLinks.length - 1) {
        const nextLink = navLinks[currentIndex + 1];
        const nextSection = nextLink.getAttribute('data-section');
        showSection(nextSection);
        updateActiveNavLink(nextLink);
        updateCurrentSection(nextSection);
        scrollToTop();
    }
}

function goToPrevSection() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    const currentIndex = navLinks.findIndex(link => 
        link.getAttribute('data-section') === learningState.currentSection
    );
    
    if (currentIndex > 0) {
        const prevLink = navLinks[currentIndex - 1];
        const prevSection = prevLink.getAttribute('data-section');
        showSection(prevSection);
        updateActiveNavLink(prevLink);
        updateCurrentSection(prevSection);
        scrollToTop();
    }
}

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage functions
function saveUserProgress() {
    const progressData = {
        currentSection: learningState.currentSection,
        currentPlatform: learningState.currentPlatform,
        completedSections: Array.from(learningState.completedSections),
        lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem('mcp-learn-progress', JSON.stringify(progressData));
    localStorage.setItem('mcp-learn-platform', learningState.currentPlatform);
}

function loadUserProgress() {
    try {
        const saved = localStorage.getItem('mcp-learn-progress');
        const savedPlatform = localStorage.getItem('mcp-learn-platform');
        
        if (saved) {
            const progressData = JSON.parse(saved);
            learningState.currentSection = progressData.currentSection || 'introduction';
            learningState.completedSections = new Set(progressData.completedSections || []);
            
            // Show the last visited section
            showSection(learningState.currentSection);
            const activeLink = document.querySelector(`[data-section="${learningState.currentSection}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
            updateCurrentSection(learningState.currentSection);
        }
        
        if (savedPlatform) {
            learningState.currentPlatform = savedPlatform;
            switchPlatform(savedPlatform);
            const platformBadge = document.querySelector(`[data-platform="${savedPlatform}"]`);
            if (platformBadge) {
                updateActivePlatformBadge(platformBadge);
            }
        }
    } catch (e) {
        console.warn('Could not load user progress:', e);
    }
}

// Analytics and tracking functions
function trackSectionView(sectionId) {
    // Placeholder for analytics
    console.log('Section viewed:', sectionId);
    
    // You can integrate with analytics services here
    // Example: gtag('event', 'section_view', { section_id: sectionId });
}

function trackPlatformSwitch(platform) {
    console.log('Platform switched to:', platform);
    
    // Analytics integration
    // Example: gtag('event', 'platform_switch', { platform: platform });
}

// Copy code functionality
function initializeCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋 Copy';
        copyButton.title = 'Copy code to clipboard';
        
        // Add button to code block
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        // Copy functionality
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('pre').textContent;
            
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '✅ Copied!';
                copyButton.style.background = '#48bb78';
                
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                    copyButton.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy code:', err);
                copyButton.innerHTML = '❌ Failed';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 Copy';
                }, 2000);
            });
        });
    });
}

// Search functionality (for future enhancement)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.toLowerCase();
        searchContent(query);
    }, 300));
}

function searchContent(query) {
    if (!query) {
        // Show all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.style.display = 'block');
        return;
    }
    
    // Simple content search implementation
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        const content = section.textContent.toLowerCase();
        if (content.includes(query)) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Theme switching (for future enhancement)
function initializeTheme() {
    const theme = localStorage.getItem('mcp-learn-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mcp-learn-theme', newTheme);
}

// Lazy loading for performance
function initializeLazyLoading() {
    const sections = document.querySelectorAll('.content-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                
                // Initialize code copy buttons for this section
                const codeBlocks = entry.target.querySelectorAll('.code-block');
                codeBlocks.forEach(initializeCodeCopyButton);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function initializeCodeCopyButton(codeBlock) {
    if (codeBlock.querySelector('.copy-button')) return; // Already initialized
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = '📋';
    copyButton.title = 'Copy code';
    
    copyButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9em;
    `;
    
    codeBlock.style.position = 'relative';
    codeBlock.appendChild(copyButton);
    
    copyButton.addEventListener('click', function() {
        const code = codeBlock.querySelector('pre').textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '✅';
            setTimeout(() => {
                copyButton.innerHTML = '📋';
            }, 1500);
        }).catch(err => {
            console.error('Copy failed:', err);
            copyButton.innerHTML = '❌';
            setTimeout(() => {
                copyButton.innerHTML = '📋';
            }, 1500);
        });
    });
}

// Touch/mobile enhancements
function initializeMobileEnhancements() {
    if (!('ontouchstart' in window)) return;
    
    // Add touch-friendly navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next section
                goToNextSection();
            } else {
                // Swipe right - previous section
                goToPrevSection();
            }
        }
    }
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCodeCopyButtons();
    initializeLazyLoading();
    initializeMobileEnhancements();
});

// Export functions for global access
window.goToNextSection = goToNextSection;
window.goToPrevSection = goToPrevSection;
window.switchPlatform = switchPlatform;
window.showSection = showSection;