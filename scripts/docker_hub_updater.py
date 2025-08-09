#!/usr/bin/env python3
"""
Docker Hub Pulls Updater for MCP Tools
=====================================

This script automatically fetches Docker Hub pull statistics and updates 
the awesome-mcp-lists README.md file with current pull counts.

Features:
- Fetches pull counts from Docker Hub API
- Formats numbers in human-readable format (e.g., 1.2M+, 856K+)
- Updates existing entries and discovers new Docker Hub repositories
- Handles rate limiting and error recovery
- Creates backup before making changes
"""

import re
import requests
import time
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
import argparse


class DockerHubAPI:
    """Handle Docker Hub API interactions"""
    
    BASE_URL = "https://hub.docker.com/v2/repositories"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'MCP-Tools-Pull-Counter/1.0'
        })
    
    def get_repository_info(self, namespace: str, repository: str) -> Optional[Dict]:
        """Get repository information from Docker Hub API"""
        url = f"{self.BASE_URL}/{namespace}/{repository}/"
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {namespace}/{repository}: {e}")
            return None
    
    def get_pull_count(self, namespace: str, repository: str) -> Optional[int]:
        """Get pull count for a specific repository"""
        repo_info = self.get_repository_info(namespace, repository)
        if repo_info:
            return repo_info.get('pull_count', 0)
        return None
    
    @staticmethod
    def format_pull_count(count: int) -> str:
        """Format pull count in human-readable format"""
        if count >= 1_000_000:
            return f"{count / 1_000_000:.1f}M+".replace('.0', '')
        elif count >= 1_000:
            return f"{count / 1_000:.1f}K+".replace('.0', '')
        else:
            return str(count)


class MCPToolsUpdater:
    """Update MCP tools README with Docker Hub pull statistics"""
    
    def __init__(self, readme_path: str = "README.md"):
        self.readme_path = readme_path
        self.api = DockerHubAPI()
        self.known_repositories = {
            # Known Docker Hub repositories for MCP tools
            'mongodb/mongodb-mcp-server': 'MongoDB',
            'hashicorp/terraform-mcp-server': 'Terraform',
        }
        # Add more repositories as they are discovered
        self.potential_repositories = [
            # These might exist, need to check
            'supabase/mcp-server',
            'docker/mcp-github',
            'docker/mcp-kubernetes',
            'docker/mcp-postgres',
            'docker/mcp-redis',
            'elastic/elasticsearch-mcp',
            'grafana/grafana-mcp',
            'stripe/stripe-mcp',
            'slack/slack-mcp',
        ]
    
    def read_readme(self) -> str:
        """Read the current README content"""
        try:
            with open(self.readme_path, 'r', encoding='utf-8') as f:
                return f.read()
        except FileNotFoundError:
            print(f"README file not found: {self.readme_path}")
            return ""
    
    def write_readme(self, content: str) -> bool:
        """Write updated content to README"""
        try:
            # Create backup first
            backup_path = f"{self.readme_path}.backup.{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            with open(self.readme_path, 'r', encoding='utf-8') as f:
                backup_content = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(backup_content)
            print(f"Backup created: {backup_path}")
            
            # Write updated content
            with open(self.readme_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing README: {e}")
            return False
    
    def extract_docker_hub_links(self, content: str) -> List[Tuple[str, str]]:
        """Extract Docker Hub repository names from README"""
        # Pattern to match Docker Hub links
        pattern = r'hub\.docker\.com/r/([^/]+/[^)\s]+)'
        matches = re.findall(pattern, content)
        
        # Also look for direct references
        results = []
        for match in matches:
            # Clean up the match
            repo = match.strip('/')
            if repo not in [r[0] for r in results]:
                results.append((repo, ''))
        
        return results
    
    def discover_repositories(self) -> Dict[str, str]:
        """Discover which potential repositories actually exist"""
        discovered = {}
        
        print("🔍 Discovering Docker Hub repositories...")
        for repo in self.potential_repositories:
            if '/' in repo:
                namespace, name = repo.split('/', 1)
                print(f"  Checking {repo}...")
                
                if self.api.get_repository_info(namespace, name):
                    discovered[repo] = name.replace('-mcp', '').replace('mcp-', '').title()
                    print(f"    ✅ Found: {repo}")
                    time.sleep(0.5)  # Rate limiting
                else:
                    print(f"    ❌ Not found: {repo}")
                    time.sleep(0.5)  # Rate limiting
        
        return discovered
    
    def fetch_pull_counts(self, repositories: Dict[str, str]) -> Dict[str, Tuple[int, str]]:
        """Fetch pull counts for all repositories"""
        results = {}
        
        print("📊 Fetching pull counts...")
        for repo, display_name in repositories.items():
            if '/' in repo:
                namespace, name = repo.split('/', 1)
                print(f"  Fetching {repo}...")
                
                pull_count = self.api.get_pull_count(namespace, name)
                if pull_count is not None:
                    formatted = self.api.format_pull_count(pull_count)
                    results[repo] = (pull_count, formatted)
                    print(f"    📈 {repo}: {formatted} pulls")
                else:
                    print(f"    ❌ Failed to fetch {repo}")
                
                time.sleep(0.5)  # Rate limiting
        
        return results
    
    def update_readme_content(self, content: str, pull_counts: Dict[str, Tuple[int, str]]) -> str:
        """Update README content with pull counts"""
        updated_content = content
        
        # Update existing Docker Hub entries
        for repo, (count, formatted) in pull_counts.items():
            # Pattern to find the table row with this repository
            patterns = [
                # Pattern for existing Docker Hub links
                f'(hub\.docker\.com/r/{re.escape(repo)})',
                # Pattern for TBD entries that might correspond to this repo
                f'(\| [^|]+ \| [^|]+ \| TBD \| \[Docker Hub\]\(https://hub\.docker\.com/r/{re.escape(repo)}\) \|)',
            ]
            
            for pattern in patterns:
                # Find and replace TBD with actual count
                tbd_pattern = f'(\| [^|]+ \| [^|]+ \| )TBD( \| \[.*?\]\(https://hub\.docker\.com/r/{re.escape(repo)}\) \|)'
                replacement = f'\\1**{formatted}**\\2'
                
                updated_content = re.sub(tbd_pattern, replacement, updated_content)
        
        return updated_content
    
    def generate_report(self, pull_counts: Dict[str, Tuple[int, str]]) -> str:
        """Generate a summary report"""
        report = "\n🐳 Docker Hub Pull Statistics Update Report\n"
        report += "=" * 50 + "\n\n"
        
        if pull_counts:
            report += f"Updated {len(pull_counts)} repositories:\n\n"
            
            # Sort by pull count (descending)
            sorted_repos = sorted(pull_counts.items(), key=lambda x: x[1][0], reverse=True)
            
            for repo, (count, formatted) in sorted_repos:
                report += f"  • {repo}: {formatted} pulls ({count:,} total)\n"
            
            report += f"\nTotal pulls across all repositories: {sum(count for _, (count, _) in pull_counts.items()):,}\n"
        else:
            report += "No repositories were updated.\n"
        
        report += f"\nUpdated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}\n"
        return report


def main():
    parser = argparse.ArgumentParser(description='Update MCP tools README with Docker Hub pull statistics')
    parser.add_argument('--readme', default='README.md', help='Path to README.md file')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be updated without making changes')
    parser.add_argument('--discover', action='store_true', help='Discover new Docker Hub repositories')
    args = parser.parse_args()
    
    updater = MCPToolsUpdater(args.readme)
    
    print("🚀 Docker Hub Pull Statistics Updater for MCP Tools")
    print("=" * 55)
    
    # Read current README
    content = updater.read_readme()
    if not content:
        print("❌ Could not read README file")
        return
    
    # Extract existing Docker Hub links
    existing_repos = updater.extract_docker_hub_links(content)
    print(f"📋 Found {len(existing_repos)} existing Docker Hub references")
    
    # Combine known repositories with discovered ones
    all_repositories = updater.known_repositories.copy()
    
    # Discover new repositories if requested
    if args.discover:
        discovered = updater.discover_repositories()
        all_repositories.update(discovered)
        print(f"🔍 Discovered {len(discovered)} new repositories")
    
    # Fetch pull counts
    pull_counts = updater.fetch_pull_counts(all_repositories)
    
    if not pull_counts:
        print("⚠️  No pull counts were fetched")
        return
    
    # Update README content
    updated_content = updater.update_readme_content(content, pull_counts)
    
    # Generate report
    report = updater.generate_report(pull_counts)
    print(report)
    
    if args.dry_run:
        print("🔍 DRY RUN: No changes were made to the README")
        print("\nUpdated content preview:")
        print("-" * 40)
        # Show a diff-like preview
        if updated_content != content:
            print("Changes would be made to the README")
        else:
            print("No changes needed")
    else:
        # Write updated content
        if updated_content != content:
            if updater.write_readme(updated_content):
                print("✅ README updated successfully!")
            else:
                print("❌ Failed to update README")
        else:
            print("ℹ️  No changes needed - README is already up to date")


if __name__ == "__main__":
    main()
