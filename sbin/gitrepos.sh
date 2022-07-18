#!/bin/bash


cd srv/www/

# Remove all previous repositories
for repo in *; do
    if [ -d "$repo" ]; then
        git rm -f $repo
    fi
done

# Get all current repositories from Github
user_name=$(jq .author ../../boot/package.json | tr -d '"')
json_data=$(curl -s -H "Accept: application/vnd.github.v3+json" https://api.github.com/users/$user_name/repos)
repo_names=$(echo $json_data | grep -Eo '"full_name"[^,]*' | grep -Eo '[^:]*$')

# Add the new repositories
for repo in $repo_names; do
    if [[ $repo != *".github.io"* ]]; then
        url=$(echo "https://github.com/$repo" | tr -d '"')
        git submodule add --force $url
    fi
done

# Init submodules from remote
git submodule update --init --remote
