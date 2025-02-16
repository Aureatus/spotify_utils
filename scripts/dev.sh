#!/bin/bash

if ! command -v zellij &> /dev/null; then
    echo "Zellij is not installed. Please run ./scripts/setup.sh first"
    exit 1
fi

exec zellij --layout scripts/zellij/dev.kdl
