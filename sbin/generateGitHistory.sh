#!/bin/bash


# Generate json string
output="{\"commits\":["
output="$output$(git log -5 --pretty=format:"{\"id\": \"%h\", \"author\": \"%an\", \"date\": \"%cs\", \"message\": \"%s\"},")"
output="${output::-1}]}"

# For testing:
# echo $output

# For writing to file:
echo $output > etc/gitHistory.json
