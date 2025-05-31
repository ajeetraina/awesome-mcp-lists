// Tutorial JavaScript for MCP Learning Portal

// Global state
let currentSection = 'introduction';
let currentOS = 'macos';
let completedSections = new Set();
let totalSections = 16; // Update based on actual number of sections

// Initialize tutorial when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeTutorial();
    updateProgress();
    handleResponsiveNavigation();
    initializeKeyboardShortcuts();
    loadUserProgress();
});

// Initialize tutorial functionality
function initializeTutorial() {
    // Set up navigation event listeners
    setupNavigationListeners();
    
    // Set up OS detection and switching
    detectOperatingSystem();
    
    // Set up code copy functionality
    initializeCodeCopying();
    
    // Set up smooth scrolling
    initializeSmoothScrolling();
    
    // Set up section completion tracking
    initializeSectionTracking();
    
    console.log('MCP Tutorial initialized successfully!');
}

// Navigation Functions
function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            if (sectionId) {
                navigateToSection(sectionId);
            }
        });
    });
}

function navigateToSection(sectionId) {
    // Mark current section as completed
    if (currentSection) {
        markSectionCompleted(currentSection);
    }
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
        
        // Update active nav link
        const activeNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
        // Scroll to top of content
        const tutorialContent = document.querySelector('.tutorial-content');
        if (tutorialContent) {
            tutorialContent.scrollTop = 0;
        }
        
        // Update progress
        updateProgress();
        
        // Save progress
        saveUserProgress();
        
        // Track analytics
        trackSectionView(sectionId);
    }
}

// Progress tracking
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const completionPercentage = Math.round((completedSections.size / totalSections) * 100);
        progressFill.style.width = `${completionPercentage}%`;
        progressText.textContent = `${completionPercentage}% Complete`;
    }
}

function markSectionCompleted(sectionId) {
    completedSections.add(sectionId);
    
    // Add visual indicator to completed sections
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink && !navLink.classList.contains('completed')) {
        navLink.classList.add('completed');
        
        // Add checkmark
        const checkmark = document.createElement('span');
        checkmark.innerHTML = ' ✓';
        checkmark.style.color = '#10b981';
        navLink.appendChild(checkmark);
    }
}

// Operating System Functions
function detectOperatingSystem() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
        currentOS = 'macos';
    } else if (userAgent.includes('linux')) {
        currentOS = 'linux';
    }
    
    // Update UI
    updateOSDisplay();
    switchOS(currentOS);
}

function toggleOS() {
    currentOS = currentOS === 'macos' ? 'linux' : 'macos';
    updateOSDisplay();
    switchOS(currentOS);
}

function updateOSDisplay() {
    const osToggle = document.getElementById('current-os');
    if (osToggle) {
        osToggle.textContent = currentOS === 'macos' ? 'macOS' : 'Linux';
    }
}

function switchOS(os) {
    currentOS = os;
    
    // Update OS buttons
    const osButtons = document.querySelectorAll('.os-button');
    osButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.os === os) {
            button.classList.add('active');
        }
    });
    
    // Update OS content
    const osContents = document.querySelectorAll('.os-content');
    osContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeOSContent = document.getElementById(`${os}-content`);
    if (activeOSContent) {
        activeOSContent.classList.add('active');
    }
    
    updateOSDisplay();
    saveUserProgress();
}

// Distribution switching for Linux
function switchDistro(distro) {
    // Update distro tabs
    const distroTabs = document.querySelectorAll('.distro-tab');
    distroTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.distro === distro) {
            tab.classList.add('active');
        }
    });
    
    // Update distro content
    const distroContents = document.querySelectorAll('.distro-content');
    distroContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeDistroContent = document.getElementById(`${distro}-commands`);
    if (activeDistroContent) {
        activeDistroContent.classList.add('active');
    }
}

// Code copying functionality
function initializeCodeCopying() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            copyCode(this);
        });
    });
}

function copyCode(button) {
    const codeBlock = button.parentElement;
    const code = codeBlock.querySelector('code');
    
    if (code) {
        // Get the text content, removing any extra whitespace
        const textToCopy = code.textContent.trim();
        
        // Use modern clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showCopySuccess(button);
            }).catch(err => {
                fallbackCopyText(textToCopy, button);
            });
        } else {
            fallbackCopyText(textToCopy, button);
        }
    }
}

function fallbackCopyText(text, button) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        showCopyError(button);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

function showCopyError(button) {
    const originalText = button.textContent;
    button.textContent = 'Error';
    button.style.background = '#ef4444';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 2000);
}

// Smooth scrolling
function initializeSmoothScrolling() {
    // Enable smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Section completion tracking
function initializeSectionTracking() {
    // Track when user scrolls through sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.8) {
                const sectionId = entry.target.id;
                if (sectionId && !completedSections.has(sectionId)) {
                    // User has viewed most of the section
                    setTimeout(() => {
                        if (entry.isIntersecting) {
                            markSectionCompleted(sectionId);
                            updateProgress();
                            saveUserProgress();
                        }
                    }, 3000); // Mark as completed after 3 seconds of viewing
                }
            }
        });
    }, {
        threshold: 0.8
    });

    // Observe all content sections
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        observer.observe(section);
    });
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search (if implemented)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Focus search if available
        }
        
        // Escape to close any open modals or overlays
        if (e.key === 'Escape') {
            // Close any open overlays
        }
        
        // Arrow keys for navigation between sections
        if (e.altKey) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateToNextSection();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateToPreviousSection();
            }
        }
    });
}

function navigateToNextSection() {
    const sections = ['introduction', 'architecture', 'installation', 'first-connection', 
                     'claude-setup', 'server-config', 'common-servers', 'troubleshooting',
                     'server-development', 'resources', 'tools', 'prompts', 
                     'security', 'performance', 'testing', 'deployment'];
    
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
        navigateToSection(sections[currentIndex + 1]);
    }
}

function navigateToPreviousSection() {
    const sections = ['introduction', 'architecture', 'installation', 'first-connection', 
                     'claude-setup', 'server-config', 'common-servers', 'troubleshooting',
                     'server-development', 'resources', 'tools', 'prompts', 
                     'security', 'performance', 'testing', 'deployment'];
    
    const currentIndex = sections.indexOf(currentSection);
    if (currentIndex > 0) {
        navigateToSection(sections[currentIndex - 1]);
    }
}

// User progress persistence
function saveUserProgress() {
    const progress = {
        currentSection: currentSection,
        currentOS: currentOS,
        completedSections: Array.from(completedSections),
        lastAccessed: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('mcp-tutorial-progress', JSON.stringify(progress));
    } catch (e) {
        console.warn('Could not save progress to localStorage:', e);
    }
}

function loadUserProgress() {
    try {
        const saved = localStorage.getItem('mcp-tutorial-progress');
        if (saved) {
            const progress = JSON.parse(saved);
            
            // Restore completed sections
            if (progress.completedSections) {
                progress.completedSections.forEach(sectionId => {
                    completedSections.add(sectionId);
                    markSectionCompleted(sectionId);
                });
            }
            
            // Restore OS preference
            if (progress.currentOS) {
                currentOS = progress.currentOS;
                switchOS(currentOS);
            }
            
            // Optionally restore current section
            // navigateToSection(progress.currentSection || 'introduction');
            
            updateProgress();
        }
    } catch (e) {
        console.warn('Could not load progress from localStorage:', e);
    }
}

// Responsive navigation
function handleResponsiveNavigation() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.tutorial-content');
    
    function updateLayout() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mobile layout adjustments
            if (sidebar) {
                sidebar.style.position = 'static';
                sidebar.style.height = 'auto';
            }
            if (content) {
                content.style.height = 'auto';
            }
        } else {
            // Desktop layout
            if (sidebar) {
                sidebar.style.position = 'sticky';
                sidebar.style.height = 'calc(100vh - var(--header-height))';
            }
            if (content) {
                content.style.height = 'calc(100vh - var(--header-height))';
            }
        }
    }
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
}

// Analytics and tracking
function trackSectionView(sectionId) {
    // Placeholder for analytics tracking
    console.log('Section viewed:', sectionId);
    
    // You can integrate with analytics services here
    // Example: gtag('event', 'page_view', { page_title: sectionId });
}

function trackCodeCopy(codeText) {
    // Track code copying for analytics
    console.log('Code copied:', codeText.substring(0, 50) + '...');
}

function trackOSSwitch(os) {
    // Track OS preference changes
    console.log('OS switched to:', os);
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for global access
window.navigateToSection = navigateToSection;
window.switchOS = switchOS;
window.switchDistro = switchDistro;
window.copyCode = copyCode;
window.toggleOS = toggleOS;

// Feature detection and progressive enhancement
function initializeFeatureDetection() {
    // Check for modern features
    const features = {
        clipboard: navigator.clipboard && window.isSecureContext,
        intersectionObserver: 'IntersectionObserver' in window,
        localStorage: typeof(Storage) !== "undefined"
    };
    
    // Apply feature-specific enhancements
    if (!features.intersectionObserver) {
        // Fallback for older browsers
        console.warn('IntersectionObserver not supported, using fallback');
    }
    
    if (!features.localStorage) {
        console.warn('localStorage not supported, progress will not be saved');
    }
    
    return features;
}

// Initialize feature detection
document.addEventListener('DOMContentLoaded', initializeFeatureDetection);

// Service worker registration for offline support
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Tutorial error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
});

console.log('MCP Tutorial script loaded successfully!');