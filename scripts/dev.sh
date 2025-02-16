#!/bin/bash

# Check if zellij is available
if ! command -v zellij &> /dev/null; then
    echo "Zellij is not installed. Please run ./scripts/setup.sh first"
    exit 1
fi

# Start development environment
exec zellij --layout scripts/zellij/dev.kdl
# options --simplified-ui true