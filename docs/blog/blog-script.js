// Blog functionality for MCP Portal

document.addEventListener('DOMContentLoaded', function() {
    initBlogFunctionality();
});

function initBlogFunctionality() {
    setupCategoryFiltering();
    setupNewsletterForm();
    setupSearchFunctionality();
    setupSocialSharing();
    trackPageViews();
}

// Category filtering functionality
function setupCategoryFiltering() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            filterPostsByCategory(category);
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterPostsByCategory(category) {
    const posts = document.querySelectorAll('.blog-post');
    
    posts.forEach(post => {
        const postCategory = post.querySelector('.category');
        if (!category || category === 'all') {
            post.style.display = 'block';
        } else {
            const categoryText = postCategory ? postCategory.textContent.toLowerCase().replace(/\s+/g, '-') : '';
            if (categoryText === category) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        }
    });
}

// Newsletter signup functionality
function setupNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (isValidEmail(email)) {
                subscribeToNewsletter(email);
                showSuccessMessage(this);
            } else {
                showErrorMessage(this, 'Please enter a valid email address');
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function subscribeToNewsletter(email) {
    // Simulate newsletter subscription
    console.log('Subscribing email:', email);
    
    // In a real implementation, this would make an API call
    // fetch('/api/newsletter/subscribe', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email })
    // });
    
    // Store locally for demo purposes
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
}

function showSuccessMessage(form) {
    const button = form.querySelector('button');
    const originalText = button.textContent;
    
    button.textContent = '✓ Subscribed!';
    button.style.background = '#48bb78';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        form.reset();
    }, 3000);
}

function showErrorMessage(form, message) {
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.9em';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    form.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Search functionality (placeholder)
function setupSearchFunctionality() {
    // This would be implemented with a search API
    // For now, just adding placeholder functionality
    const searchInputs = document.querySelectorAll('.search-bar');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            searchPosts(query);
        });
    });
}

function searchPosts(query) {
    if (!query) {
        document.querySelectorAll('.blog-post').forEach(post => {
            post.style.display = 'block';
        });
        return;
    }
    
    document.querySelectorAll('.blog-post').forEach(post => {
        const title = post.querySelector('h3').textContent.toLowerCase();
        const content = post.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(post.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = `${title} ${content} ${tags.join(' ')}`;
        
        if (searchText.includes(query)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// Social sharing functionality
function setupSocialSharing() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'reddit':
                    shareUrl = `https://reddit.com/submit?url=${url}&title=${title}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Analytics and tracking
function trackPageViews() {
    // Track page view
    const pageData = {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    
    // Store page view data
    const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]');
    pageViews.push(pageData);
    
    // Keep only last 100 page views
    if (pageViews.length > 100) {
        pageViews.splice(0, pageViews.length - 100);
    }
    
    localStorage.setItem('page_views', JSON.stringify(pageViews));
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
}

// Reading time calculation
function calculateReadingTime() {
    const posts = document.querySelectorAll('.blog-post');
    
    posts.forEach(post => {
        const content = post.querySelector('p');
        if (content) {
            const wordCount = content.textContent.split(' ').length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            
            // Add reading time indicator
            const readingTimeElement = document.createElement('span');
            readingTimeElement.className = 'reading-time';
            readingTimeElement.textContent = `${readingTime} min read`;
            readingTimeElement.style.color = '#718096';
            readingTimeElement.style.fontSize = '0.8em';
            
            const postMeta = post.querySelector('.post-meta');
            if (postMeta) {
                postMeta.appendChild(readingTimeElement);
            }
        }
    });
}

// Tag cloud functionality
function setupTagCloud() {
    const tags = document.querySelectorAll('.tag-cloud .tag');
    
    tags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const tagText = this.textContent.toLowerCase();
            filterPostsByTag(tagText);
        });
    });
}

function filterPostsByTag(tagText) {
    const posts = document.querySelectorAll('.blog-post');
    
    posts.forEach(post => {
        const postTags = Array.from(post.querySelectorAll('.tag')).map(tag => 
            tag.textContent.toLowerCase()
        );
        
        if (postTags.includes(tagText)) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// Lazy loading for images (when we add them)
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize additional features when page loads
document.addEventListener('DOMContentLoaded', function() {
    calculateReadingTime();
    setupTagCloud();
    setupLazyLoading();
});

// Smooth scrolling for anchor links
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

// Add copy code functionality for code blocks (when we add them)
function setupCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.textContent = 'Copy';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '5px';
        copyButton.style.right = '5px';
        copyButton.style.background = '#667eea';
        copyButton.style.color = 'white';
        copyButton.style.border = 'none';
        copyButton.style.padding = '5px 10px';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';
        
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(block.textContent).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);
    });
}

// Theme toggle functionality (for future dark mode)
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Export functions for potential external use
window.MCPBlog = {
    filterPostsByCategory,
    filterPostsByTag,
    subscribeToNewsletter,
    trackPageViews
};