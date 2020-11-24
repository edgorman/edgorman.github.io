#!/bin/bash
#
# import-public-repos.sh
#
# requires https://stedolan.github.io/jq/
#
# Import the repositories from https://github.com/edgorman as submodules
# By Edward Gorman <ejgorman@gmail.com>

# Get json containing repo info and parse using jq
curl -s -H "Accept: application/vnd.github.v3+json" https://api.github.com/users/edgorman/repos | \
jq -rc '.[]' | \
# For each repo found
while IFS='' read repository
do
    # Extract the url of the repo
    url=$(echo "$repository" | jq .html_url | tail -c +2 | head -c -3)
    # Add repo as submodule
    git submodule add $url
done

# Update all submodules
git pull --recurse-submodules