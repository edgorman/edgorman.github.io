#!/bin/bash
# requires https://stedolan.github.io/jq/
#
# Import the repositories from https://github.com/edgorman as submodules
# By Edward Gorman <ejgorman@gmail.com>

cd src/data && { curl -s -H "Accept: application/vnd.github.v3+json" -o "edgorman-github.json" https://api.github.com/users/edgorman/repos ; cd -;}

cat src/data/edgorman-github.json | jq '.[] | .html_url' | \
while IFS='' read data
do 
    # Extract the url of the repo
    url=$(echo "$data" | head -c -3 | tail -c +2)
    # Add repo as submodule
    git submodule add $url
done

# Update all submodules
git submodule update --init
git submodule foreach git pull origin main