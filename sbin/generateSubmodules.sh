#!/bin/bash


cd srv/www

# Get list of repositories
json=$(curl -s -H "Accept: application/vnd.github.v3+json" https://api.github.com/users/edgorman/repos)
repos=$(echo $json | grep -Eo '"full_name"[^,]*' | grep -Eo '[^:]*$')

# Add submodules (does nothing if exists)
for r in $repos; do
  if [[ $r != *"edgorman/edgorman.github.io"* ]]; then
    url=$(echo "https://github.com/$r" | tr -d '"')
    git submodule add $url
  fi
done

# Init submodules
git submodule update --init --remote

# Update submodules
git submodule update --remote
