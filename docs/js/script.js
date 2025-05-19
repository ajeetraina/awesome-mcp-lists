// Main JavaScript file for MCP Landscape

document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Category tab switching
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get the parent container
            const parentContainer = this.closest('.category-tabs');
            const sectionId = parentContainer.parentElement.id;
            
            // Remove active class from all tabs in this container
            parentContainer.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Filter the cards if needed
            const category = this.getAttribute('data-category');
            filterCards(category, sectionId);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }

    // Fetch data and populate cards
    fetchAndPopulateCards();

    // Intersection Observer for animations
    setupIntersectionObserver();
});

// Function to filter cards
function filterCards(category, sectionId) {
    const gridId = `${sectionId}-grid`;
    const cards = document.querySelectorAll(`#${gridId} .card`);
    
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to perform search
function performSearch(query) {
    if (!query.trim()) return;
    
    query = query.toLowerCase();
    
    // Search in servers
    searchInSection('server-grid', query);
    
    // Search in clients
    searchInSection('client-grid', query);
    
    // Search in toolkits
    searchInSection('toolkit-grid', query);
    
    // Show all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'block';
    });
    
    // Scroll to the first section with results
    const sections = ['#servers', '#clients', '#toolkits'];
    for (const sectionId of sections) {
        const section = document.querySelector(sectionId);
        const grid = document.querySelector(`${sectionId}-grid`);
        const visibleCards = grid ? grid.querySelectorAll('.card[style="display: block;"]') : [];
        
        if (visibleCards.length > 0) {
            section.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

// Function to search within a specific section
function searchInSection(gridId, query) {
    const cards = document.querySelectorAll(`#${gridId} .card`);
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();
        
        if (title.includes(query) || description.includes(query) || category.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to fetch data and populate cards
async function fetchAndPopulateCards() {
    try {
        // In a real implementation, this would fetch data from an API
        // For this demo, we'll use the GitHub API to fetch the README.md file
        // and parse it to extract MCP servers, clients, and toolkits
        
        const response = await fetch('https://raw.githubusercontent.com/collabnix/awesome-mcp-lists/main/README.md');
        const readmeText = await response.text();
        
        // Parse the README.md content to extract data
        const data = parseReadmeContent(readmeText);
        
        // Populate the cards
        populateServerCards(data.servers);
        populateClientCards(data.clients);
        populateToolkitCards(data.toolkits);
        
        // Update the stats
        updateStats(data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        
        // Show error message in each grid
        ['server-grid', 'client-grid', 'toolkit-grid'].forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.innerHTML = '<div class="loading-spinner">Error loading data. Please try again later.</div>';
            }
        });
    }
}

// Function to parse README.md content
function parseReadmeContent(readmeText) {
    const data = {
        servers: [],
        clients: [],
        toolkits: []
    };
    
    // Extract servers
    const serversSection = readmeText.match(/## MCP Servers([\s\S]*?)## MCP Clients/);
    if (serversSection) {
        const serverCategories = serversSection[1].match(/### (.*?)\n\n(.*?)\n\n\| # \| MCP Server \| Description \| Docker Hub Pulls \| Link \|\n\|.*?\n((?:\|.*?\|\n)+)/g);
        
        if (serverCategories) {
            serverCategories.forEach(categoryText => {
                const categoryMatch = categoryText.match(/### (.*?)\n\n(.*?)\n\n/);
                const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
                
                const serverRows = categoryText.match(/\|.*?\|.*?\|(.*?)\|(.*?)\|(.*?)\|\n/g);
                if (serverRows) {
                    serverRows.forEach(row => {
                        const columns = row.split('|').map(col => col.trim());
                        if (columns.length >= 6) {
                            const serverName = columns[2];
                            const description = columns[3];
                            const link = columns[5].match(/\[(.*?)\]\((.*?)\)/);
                            
                            if (serverName && description) {
                                data.servers.push({
                                    name: serverName,
                                    description: description,
                                    category: category,
                                    link: link ? link[2] : '#'
                                });
                            }
                        }
                    });
                }
            });
        }
    }
    
    // Extract clients
    const clientsSection = readmeText.match(/## MCP Clients([\s\S]*?)## MCP Toolkits/);
    if (clientsSection) {
        const clientCategories = clientsSection[1].match(/### (.*?)\n\n\| # \| Client Name \| Description \| Platforms \|\n\|.*?\n((?:\|.*?\|\n)+)/g);
        
        if (clientCategories) {
            clientCategories.forEach(categoryText => {
                const categoryMatch = categoryText.match(/### (.*?)\n\n/);
                const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
                
                const clientRows = categoryText.match(/\|.*?\|(.*?)\|(.*?)\|(.*?)\|\n/g);
                if (clientRows) {
                    clientRows.forEach(row => {
                        const columns = row.split('|').map(col => col.trim());
                        if (columns.length >= 5) {
                            const clientName = columns[2];
                            const description = columns[3];
                            const platforms = columns[4];
                            
                            if (clientName && description) {
                                data.clients.push({
                                    name: clientName,
                                    description: description,
                                    category: category,
                                    platforms: platforms
                                });
                            }
                        }
                    });
                }
            });
        }
    }
    
    // Extract toolkits
    const toolkitsSection = readmeText.match(/## MCP Toolkits([\s\S]*?)##/);
    if (toolkitsSection) {
        const toolkitCategories = toolkitsSection[1].match(/### (.*?)\n\n\| # \| Tool Name \| (.*?) \| Description \|\n\|.*?\n((?:\|.*?\|\n)+)/g);
        
        if (toolkitCategories) {
            toolkitCategories.forEach(categoryText => {
                const categoryMatch = categoryText.match(/### (.*?)\n\n/);
                const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
                
                const toolkitRows = categoryText.match(/\|.*?\|(.*?)\|(.*?)\|(.*?)\|\n/g);
                if (toolkitRows) {
                    toolkitRows.forEach(row => {
                        const columns = row.split('|').map(col => col.trim());
                        if (columns.length >= 5) {
                            const toolName = columns[2];
                            const language = columns[3];
                            const description = columns[4];
                            
                            if (toolName && description) {
                                data.toolkits.push({
                                    name: toolName,
                                    description: description,
                                    category: category,
                                    language: language
                                });
                            }
                        }
                    });
                }
            });
        }
    }
    
    return data;
}

// Function to populate server cards
function populateServerCards(servers) {
    const grid = document.getElementById('server-grid');
    if (!grid) return;
    
    if (servers.length === 0) {
        grid.innerHTML = '<div class="loading-spinner">No servers found.</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    servers.forEach(server => {
        const card = createCard(server, 'server');
        grid.appendChild(card);
    });
}

// Function to populate client cards
function populateClientCards(clients) {
    const grid = document.getElementById('client-grid');
    if (!grid) return;
    
    if (clients.length === 0) {
        grid.innerHTML = '<div class="loading-spinner">No clients found.</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    clients.forEach(client => {
        const card = createCard(client, 'client');
        grid.appendChild(card);
    });
}

// Function to populate toolkit cards
function populateToolkitCards(toolkits) {
    const grid = document.getElementById('toolkit-grid');
    if (!grid) return;
    
    if (toolkits.length === 0) {
        grid.innerHTML = '<div class="loading-spinner">No toolkits found.</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    toolkits.forEach(toolkit => {
        const card = createCard(toolkit, 'toolkit');
        grid.appendChild(card);
    });
}

// Function to create a card element
function createCard(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-category', getCategorySlug(item.category));
    
    // Standardize image process with placeholders
    const imageUrl = getImageUrl(item.name, type);
    
    let metaInfo = '';
    if (type === 'client') {
        metaInfo = `<span class="card-platforms">${item.platforms}</span>`;
    } else if (type === 'toolkit') {
        metaInfo = `<span class="card-language">${item.language}</span>`;
    }
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x160?text=${encodeURIComponent(item.name)}'">
        </div>
        <div class="card-content">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-description">${item.description}</p>
            <div class="card-meta">
                <span class="card-category">${item.category}</span>
                ${metaInfo}
            </div>
        </div>
    `;
    
    // Make the card clickable if there's a link
    if (item.link) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            window.open(item.link, '_blank');
        });
    }
    
    return card;
}

// Function to get image URL based on item name
function getImageUrl(name, type) {
    // In a real implementation, you would have actual images for each item
    // For this demo, we'll use placeholder images
    return `https://via.placeholder.com/300x160?text=${encodeURIComponent(name)}`;
}

// Function to convert category name to slug
function getCategorySlug(category) {
    return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Function to update stats
function updateStats(data) {
    document.getElementById('server-count').textContent = data.servers.length + '+';
    document.getElementById('client-count').textContent = data.clients.length + '+';
    document.getElementById('toolkit-count').textContent = data.toolkits.length + '+';
}

// Function to setup Intersection Observer for animations
function setupIntersectionObserver() {
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

// Fetch MCP servers from glama.ai
async function fetchMcpServersFromGlama() {
    try {
        const response = await fetch('https://glama.ai/api/mcp/servers');
        const data = await response.json();
        console.log('Fetched MCP servers from Glama.ai:', data);
        return data;
    } catch (error) {
        console.error('Error fetching MCP servers from Glama.ai:', error);
        return [];
    }
}
