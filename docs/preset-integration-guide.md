# MCP Preset System Integration Guide

## 🎯 Overview

The MCP Preset System solves the critical problem of tool overload by allowing users to organize MCP servers into focused collections called "presets." This keeps tool counts manageable for VSCode Agent Mode (<128 tools) and optimal context windows (<60 tools).

## 🔧 Integration with Existing MCP Toolkit

### 1. Replace Main Interface

Replace your current `docs/index.html` with the enhanced preset-enabled version (`preset-enhanced.html`). The new interface adds:

- **Sidebar with preset management**
- **Real-time tool counting**
- **Visual warning system for tool limits**
- **Custom preset creation**

### 2. Update Backend Configuration

Modify your Docker MCP Toolkit to support preset-based server activation:

```javascript
// Add to your existing script.js
class PresetManager {
    constructor() {
        this.currentPreset = 'architect';
        this.presets = this.loadPresets();
    }
    
    async activatePreset(presetId) {
        const preset = this.presets[presetId];
        if (!preset) return;
        
        // Deactivate all servers
        await this.deactivateAllServers();
        
        // Activate only servers in the preset
        for (const serverId of preset.servers) {
            await this.activateServer(serverId);
        }
        
        this.currentPreset = presetId;
        this.updateUI();
    }
    
    async activateServer(serverId) {
        // Integration with Docker MCP Toolkit
        return fetch('/api/mcp/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverId })
        });
    }
    
    async deactivateAllServers() {
        return fetch('/api/mcp/deactivate-all', {
            method: 'POST'
        });
    }
}
```

### 3. Docker Compose Enhancement

Update your `docker-compose.yml` to support dynamic server management:

```yaml
version: '3.8'
services:
  mcp-manager:
    image: mcp/preset-manager
    ports:
      - "3000:3000"
    volumes:
      - ./presets:/app/presets
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - MCP_PRESET_PATH=/app/presets
      - DOCKER_API_VERSION=1.41
    
  # Individual MCP servers (started/stopped based on preset)
  sequential-thinking:
    image: mcp/sequential-thinking
    profiles: ["architect", "data-analyst"]
    
  memory:
    image: mcp/memory
    profiles: ["architect", "full-stack"]
    
  atlassian:
    image: mcp/atlassian
    profiles: ["architect", "full-stack"]
    environment:
      - ATLASSIAN_TOKEN=${ATLASSIAN_TOKEN}
    
  context7:
    image: mcp/context7
    profiles: ["azure-dev", "full-stack"]
    
  azure:
    image: mcp/azure
    profiles: ["azure-dev", "full-stack"]
    environment:
      - AZURE_SUBSCRIPTION_ID=${AZURE_SUBSCRIPTION_ID}
      - AZURE_CLIENT_ID=${AZURE_CLIENT_ID}
      - AZURE_CLIENT_SECRET=${AZURE_CLIENT_SECRET}
    
  gordon:
    image: mcp/gordon
    profiles: ["azure-dev", "full-stack"]
```

## 📁 File Structure

```
mcp-toolkit/
├── docs/
│   ├── index.html              # Enhanced with preset system
│   ├── preset-manager.js       # Preset management logic
│   ├── styles.css             # Updated styles
│   └── presets/               # Preset definitions
│       ├── architect.json
│       ├── azure-dev.json
│       ├── data-analyst.json
│       ├── full-stack.json
│       └── minimal.json
├── api/
│   ├── preset-controller.js    # Backend preset management
│   └── mcp-orchestrator.js    # Docker container orchestration
└── docker-compose.yml         # Enhanced with profiles
```

## 🔄 Preset Configuration Files

### Example: `presets/architect.json`
```json
{
  "id": "architect",
  "name": "🏗️ Architect",
  "description": "Focused on system design and planning",
  "maxTools": 60,
  "servers": [
    {
      "id": "sequential-thinking",
      "required": true,
      "config": {
        "reasoning_depth": "advanced",
        "step_validation": true
      }
    },
    {
      "id": "memory",
      "required": true,
      "config": {
        "retention_period": "30d",
        "context_size": "large"
      }
    },
    {
      "id": "atlassian",
      "required": false,
      "config": {
        "default_project": "ARCH",
        "auto_link_issues": true
      }
    }
  ],
  "tool_limits": {
    "warning_threshold": 50,
    "hard_limit": 60
  }
}
```

## 🔌 API Endpoints

Add these endpoints to your existing MCP Toolkit backend:

```javascript
// GET /api/presets - List all available presets
app.get('/api/presets', (req, res) => {
  const presets = presetManager.getAllPresets();
  res.json(presets);
});

// POST /api/presets/:id/activate - Activate a specific preset
app.post('/api/presets/:id/activate', async (req, res) => {
  try {
    await presetManager.activatePreset(req.params.id);
    res.json({ success: true, preset: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/presets/active - Get currently active preset
app.get('/api/presets/active', (req, res) => {
  const activePreset = presetManager.getCurrentPreset();
  res.json(activePreset);
});

// POST /api/presets - Create new custom preset
app.post('/api/presets', (req, res) => {
  const newPreset = presetManager.createPreset(req.body);
  res.json(newPreset);
});
```

## 🎯 Usage Examples

### Quick Start
1. **Choose a preset** from the sidebar (e.g., "Azure Developer")
2. **Verify tool count** is under your preferred limit
3. **Activate the preset** - only those servers will run
4. **Connect to Claude Desktop** or your preferred MCP client

### Custom Preset Creation
1. Click **"+ Create New Preset"**
2. Name it (e.g., "Backend API Development")
3. Select your specific servers from the grid
4. **Export/share** with team members

### Team Workflow
```bash
# Export current preset
curl -X GET https://mcp.collabnix.com/api/presets/architect/export > architect-preset.json

# Import on another machine
curl -X POST https://mcp.collabnix.com/api/presets/import \
  -H "Content-Type: application/json" \
  -d @architect-preset.json
```

## 🚀 Benefits

- **Solves VSCode 128 tool limit** - Visual warnings and preset enforcement
- **Optimizes context windows** - Keep under 60 tools for better performance  
- **Team standardization** - Share preset configurations
- **Workflow-specific** - Different tools for different tasks
- **Quick switching** - Change contexts without restart
- **Future-proof** - Easy to add new servers to existing presets

## 🔄 Migration from Current Setup

1. **Backup** your current configuration
2. **Deploy** the enhanced toolkit
3. **Create presets** matching your current workflows
4. **Test** with a small team first
5. **Rollout** organization-wide

Your existing MCP servers will work unchanged - this just adds the orchestration layer on top!