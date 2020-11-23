#!/bin/bash
#
# import-public-repos.sh
#
# requires https://stedolan.github.io/jq/
#
# Import the repositories from https://github.com/edgorman as submodules
# By Edward Gorman <ejgorman@gmail.com>

# test=$(curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/users/edgorman/repos | jq --join-output '[.[] | .html_url]')
# echo "$test"

curl -H "Accept: application/vnd.github.v3+json" https://api.github.com/users/edgorman/repos | \
jq -rc '.[]' | \
while IFS='' read repository
do
    name=$(echo "$repository" | jq .name | tail -c +2 | head -c -3)
    url=$(echo "$repository" | jq .html_url | tail -c +2 | head -c -3)
    # echo "${PWD}"/../../$name
    git submodule add $url /../../
done