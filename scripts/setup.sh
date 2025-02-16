#!/bin/bash

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up development environment...${NC}"

if [ "$(uname)" != "Linux" ]; then
    echo -e "${RED}This script only supports Linux${NC}"
    exit 1
fi

if ! command -v zellij &> /dev/null; then
    echo "Installing Zellij for Linux..."
    tmp_dir=$(mktemp -d)
    cd "$tmp_dir"
    curl -L https://github.com/zellij-org/zellij/releases/latest/download/zellij-x86_64-unknown-linux-musl.tar.gz | tar xz
    sudo mv zellij /usr/local/bin/
    cd - > /dev/null
    rm -rf "$tmp_dir"
fi

echo -e "${GREEN}Setup complete! You can now run ./scripts/dev.sh${NC}"