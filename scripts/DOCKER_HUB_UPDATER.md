# Docker Hub Pulls Updater - Usage Guide

This guide explains how to use the Docker Hub Pulls Updater script to automatically fetch and update Docker Hub pull statistics for MCP tools.

## Prerequisites

- Python 3.7+
- `requests` library (`pip install requests`)

## Installation

1. Save the `docker_hub_updater.py` script to your repository
2. Make it executable: `chmod +x docker_hub_updater.py`
3. Install dependencies: `pip install requests`

## Usage

### Basic Usage

Update the README with current Docker Hub pull statistics:

```bash
python scripts/docker_hub_updater.py
```

### Advanced Usage

#### Dry Run (Preview Changes)

See what would be updated without making actual changes:

```bash
python scripts/docker_hub_updater.py --dry-run
```

#### Discover New Repositories

Search for additional Docker Hub repositories that might exist:

```bash
python scripts/docker_hub_updater.py --discover
```

#### Custom README Path

Specify a different README file:

```bash
python scripts/docker_hub_updater.py --readme /path/to/README.md
```

#### Combined Options

Run a discovery dry run:

```bash
python scripts/docker_hub_updater.py --discover --dry-run
```

## What the Script Does

### 1. **Fetches Current Statistics**
   - Connects to Docker Hub's public API
   - Retrieves pull count data for known repositories
   - Formats numbers in human-readable format (e.g., 1.2M+, 856K+)

### 2. **Updates README Tables**
   - Finds table rows with Docker Hub links
   - Replaces "TBD" with actual pull counts
   - Maintains consistent formatting

### 3. **Repository Discovery** (with `--discover` flag)
   - Checks potential repository names
   - Verifies if they exist on Docker Hub
   - Adds newly discovered repositories

### 4. **Safety Features**
   - Creates timestamped backups before making changes
   - Handles API rate limiting automatically
   - Provides detailed logging and error handling

## Current Known Repositories

The script currently tracks these confirmed Docker Hub repositories:

- `mongodb/mongodb-mcp-server` - MongoDB MCP Server
- `hashicorp/terraform-mcp-server` - Terraform MCP Server

## Repository Discovery

The script can search for these potential repositories:

- `supabase/mcp-server`
- `docker/mcp-github`
- `docker/mcp-kubernetes`
- `docker/mcp-postgres`
- `docker/mcp-redis`
- `elastic/elasticsearch-mcp`
- `grafana/grafana-mcp`
- `stripe/stripe-mcp`
- `slack/slack-mcp`

## Output Format

### Before Update
```markdown
| 1 | MongoDB | MongoDB database integration | TBD | [Docker Hub](https://hub.docker.com/r/mongodb/mongodb-mcp-server) |
```

### After Update
```markdown
| 1 | MongoDB | MongoDB database integration | **4.2K+** | [Docker Hub](https://hub.docker.com/r/mongodb/mongodb-mcp-server) |
```

## Example Output

```
🚀 Docker Hub Pull Statistics Updater for MCP Tools
=======================================================
📋 Found 2 existing Docker Hub references
📊 Fetching pull counts...
  Fetching mongodb/mongodb-mcp-server...
    📈 mongodb/mongodb-mcp-server: 4.2K+ pulls
  Fetching hashicorp/terraform-mcp-server...
    📈 hashicorp/terraform-mcp-server: 22.3K+ pulls

🐳 Docker Hub Pull Statistics Update Report
==================================================

Updated 2 repositories:

  • hashicorp/terraform-mcp-server: 22.3K+ pulls (22,345 total)
  • mongodb/mongodb-mcp-server: 4.2K+ pulls (4,187 total)

Total pulls across all repositories: 26,532

Updated on: 2025-08-06 15:30:45 UTC

Backup created: README.md.backup.20250806_153045
✅ README updated successfully!
```

## Automation with GitHub Actions

You can automate this process with a GitHub Action that runs monthly:

```yaml
name: Update Docker Hub Pulls
on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly on 1st day
  workflow_dispatch:  # Manual trigger

jobs:
  update-pulls:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install requests
      - name: Update Docker Hub pulls
        run: python scripts/docker_hub_updater.py --discover
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          title: "Update Docker Hub pull statistics"
          body: "Automated update of Docker Hub pull counts for MCP tools"
          branch: update-docker-hub-pulls
```

## Troubleshooting

### Rate Limiting
If you encounter rate limiting issues:
- The script includes automatic delays (0.5s between requests)
- Consider running with fewer repositories
- Wait a few minutes before retrying

### API Errors
- Check that repository names are correct
- Verify repositories are public
- Ensure internet connectivity

### File Permissions
If you get permission errors:
```bash
chmod +x scripts/docker_hub_updater.py
```

## Contributing

To add new repositories to track:
1. Add them to the `known_repositories` dict in the script
2. Or add them to `potential_repositories` for discovery
3. Test with `--dry-run` first
4. Submit a pull request

## License

This script is released under the same license as the awesome-mcp-lists repository.
