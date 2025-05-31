# MCP Portal

A comprehensive web portal for the Model Context Protocol (MCP) ecosystem, featuring servers, clients, development tools, and educational resources.

## 🌟 Features

- **📊 109 MCP Servers** - Comprehensive catalog of available MCP servers
- **🖥️ Multiple Client Types** - Desktop, mobile, web, and CLI clients
- **🛠️ Development Tools** - Frameworks, testing tools, and templates
- **📚 Educational Content** - Complete learning courses from beginner to advanced
- **🔍 Advanced Search** - Filter by category, search by keywords
- **📱 Responsive Design** - Works on all devices and screen sizes
- **🎨 Clean UI** - No external dependencies, fast loading

## 🚀 Quick Start

1. **View the Portal**: Open `index.html` in your web browser
2. **Navigate Sections**: Use the tabs to explore servers, clients, tools, and courses
3. **Search & Filter**: Use the search bar and category filters to find specific items
4. **Learn MCP**: Start with the "Learn MCP" section for comprehensive tutorials

## 📁 File Structure

```
docs/
├── index.html          # Main portal page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🔧 Portal Sections

### MCP Servers
- **DevOps & Infrastructure**: GitHub, Docker, Kubernetes, GitLab, CircleCI, Heroku
- **Database & Storage**: PostgreSQL, Redis, Elasticsearch, Neo4j, Chroma, Neon
- **Web & Search**: Brave Search, Notion, Puppeteer, Firecrawl, DuckDuckGo, Wikipedia
- **External APIs**: Stripe, Shopify, Atlassian, Azure, Slack, Google Drive
- **AI & ML**: Tavily, Perplexity, ElevenLabs, Wolfram Alpha, EverArt, Exa

### MCP Clients
- **Desktop**: Claude Desktop, Cursor AI, Windsurf, Cline, MetaMCP
- **Mobile**: Claude Mobile, AI Assistant
- **Web**: Claude Web, Glama AI, Phind
- **IDE Extensions**: VS Code, JetBrains, GitHub Copilot
- **Command Line**: Claude CLI, MCP CLI, MCPHost

### Development Tools
- **Frameworks**: FastMCP, LiteMCP, mcp-use, LangChain MCP
- **Agent Frameworks**: MCP Agent, GPT Computer Assistant, FEGIS
- **Testing**: MCP Inspector, MCP CLI, MCP Evals, MCP Autotest
- **Development**: YAMCP, MCP Proxy, Multi-MCP, MCPTools
- **Templates**: Template MCP Server, Create MCP TS, FastMCP Boilerplate
- **Hosting**: Glama, Smithery

### Learn MCP
- **10 Comprehensive Courses** from beginner to advanced
- **Learning Resources**: Documentation, code examples, videos, community
- **Structured Progression**: Clear prerequisites and time estimates
- **Practical Projects**: Hands-on learning with real implementations

## 🎨 Design Features

### No External Dependencies
- **CSS-generated icons** instead of external images
- **Self-contained styling** with modern CSS features
- **No image files required** - everything works without external assets
- **Fast loading** with minimal dependencies

### Responsive & Accessible
- **Mobile-first design** that scales to desktop
- **Keyboard navigation** support
- **Screen reader friendly** with semantic HTML
- **High contrast** and readable typography

### Interactive Features
- **Real-time search** across all content
- **Category filtering** for organized browsing
- **Smooth animations** and hover effects
- **Tab navigation** between sections

## 🔧 Customization

### Adding New Servers
1. Add a new `server-card` div in the appropriate category section
2. Include server icon, title, description, tags, and link
3. Set the correct `data-category` attribute for filtering

### Modifying Styles
- **Colors**: Update CSS variables in `styles.css`
- **Layout**: Modify grid settings and spacing
- **Icons**: Change icon text in CSS `::before` pseudo-elements

### Adding Functionality
- **Search**: Extend `filterItems()` function in `script.js`
- **Categories**: Add new options to category filter selects
- **Analytics**: Implement tracking in `trackInteraction()` function

## 🌐 Deployment

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Set source to `docs` folder
3. Portal will be available at `https://username.github.io/repository-name/`

### Custom Domain
1. Add `CNAME` file to docs folder with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

### Static Hosting
- **Netlify**: Drag and drop the docs folder
- **Vercel**: Connect GitHub repository
- **Surge**: Deploy with `surge docs/`

## 🤝 Contributing

1. **Add MCP Servers**: Submit new servers with proper categorization
2. **Improve Content**: Enhance descriptions and course materials
3. **Fix Issues**: Report bugs or submit pull requests
4. **Suggest Features**: Propose new functionality or improvements

## 📊 Statistics

- **109 MCP Servers** across 5 major categories
- **25+ Clients** supporting all platforms
- **15+ Development Tools** and frameworks
- **10 Learning Courses** with 40+ hours of content
- **100% Open Source** community-driven development

## 🔗 External Links

- **MCP Specification**: https://modelcontextprotocol.io
- **GitHub Repository**: https://github.com/modelcontextprotocol
- **Docker MCP Toolkit**: https://github.com/docker/labs-ai-tools-for-devs
- **Community Discord**: [Join MCP Community]
- **Contributing Guidelines**: https://github.com/collabnix/awesome-mcp-lists/blob/main/CONTRIBUTING.md

## 📝 License

This portal is part of the awesome-mcp-lists project and follows the same licensing terms. See the main repository for detailed license information.

---

**Built with ❤️ by the MCP Community**