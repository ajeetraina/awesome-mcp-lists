#!/bin/bash

# Quick Docker Hub Pulls Checker for awesome-mcp-lists
# This script fetches pull counts for known Docker Hub repositories

set -e

echo "🐳 Docker Hub Pulls Checker for awesome-mcp-lists"
echo "=================================================="

# Known Docker Hub repositories
declare -A repos=(
    ["MongoDB"]="mongodb/mongodb-mcp-server"
    ["Terraform"]="hashicorp/terraform-mcp-server"
    ["AWS Terraform"]="mcp/aws-terraform"
)

# Function to format pull count
format_pulls() {
    local count=$1
    if [[ $count -ge 1000000 ]]; then
        echo "$(echo "scale=1; $count / 1000000" | bc | sed 's/\.0$//')M+"
    elif [[ $count -ge 1000 ]]; then
        echo "$(echo "scale=1; $count / 1000" | bc | sed 's/\.0$//')K+"
    else
        echo "$count"
    fi
}

# Function to fetch Docker Hub pulls
fetch_pulls() {
    local repo=$1
    local url="https://hub.docker.com/v2/repositories/$repo/"
    
    echo "📊 Fetching pulls for $repo..."
    
    # Use curl to fetch the data
    local response=$(curl -s -f "$url" 2>/dev/null)
    
    if [[ $? -eq 0 ]]; then
        # Extract pull_count using grep and sed (portable approach)
        local pulls=$(echo "$response" | grep -o '"pull_count":[0-9]*' | sed 's/"pull_count"://')
        
        if [[ -n "$pulls" ]]; then
            echo "$pulls"
        else
            echo "0"
        fi
    else
        echo "ERROR"
    fi
}

# Main execution
echo "Checking Docker Hub repositories..."
echo ""

# Create results table
printf "%-15s %-30s %-15s %-20s\n" "Tool" "Repository" "Raw Pulls" "Formatted"
printf "%-15s %-30s %-15s %-20s\n" "----" "----------" "---------" "---------"

for tool in "${!repos[@]}"; do
    repo="${repos[$tool]}"
    pulls=$(fetch_pulls "$repo")
    
    if [[ "$pulls" == "ERROR" ]]; then
        printf "%-15s %-30s %-15s %-20s\n" "$tool" "$repo" "❌ Failed" "N/A"
    else
        formatted=$(format_pulls "$pulls")
        printf "%-15s %-30s %-15s %-20s\n" "$tool" "$repo" "$pulls" "$formatted"
    fi
    
    # Be nice to Docker Hub API
    sleep 1
done

echo ""
echo "✅ Docker Hub pulls check completed!"
echo ""
echo "📝 Usage in README.md:"
echo "Replace 'TBD' with the formatted pull counts in your tables."
echo ""
echo "🤖 For automated updates, consider setting up the GitHub Action workflow."
