#!/bin/bash
#
# Generates a config file for the contents of the repository
# By Edward Gorman <ejgorman@gmail.com>
shopt -s dotglob

# recursive mapping function for subdirectories and files
recursivemap() {
  # for each file in current directory
  for file in *; do
    # ignore empty directory and includes and .git folder
    if [[ $file = "*" ]] || [[ $file = ".git" ]]; then
      continue
    fi

    # if is directory
    if [ -d "$file" ]; then
      # get file last modification date and time
      _date=$(date -r "$file" "+%d/%m/%Y")
      _time=$(date -r "$file" "+%H:%M")
      result="\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\","
      result="$result\".\":{\"_name\": \".\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result\"..\":{\"_name\": \"..\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result$(cd -- "$file" && recursivemap "${1}${file}/")"
      echo "${result::-1}},"
    # else is file
    else
      # get file last modification date and time
      _date=$(date -r "$file" "+%d/%m/%Y")
      _time=$(date -r "$file" "+%H:%M")
      # if is a script
      if [[ $file = *".sh" ]] || [[ $file = *".html" ]] || [[ $file = *".py" ]] || [[ $file = *".js" ]] || [[ $file = *".css" ]]; then
        file_type="exe"
      # else if is picture
      elif [[ $file = *".png" ]] || [[ $file = *".jpg" ]]; then
        file_type="pic"
      # else is data
      else
        file_type="txt"
      fi
      # output file
      echo "\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"$file_type\", \"_parent\": \"$1\"},"
    fi
  done
}

# generate content of json file
root_name="/"
commit_short=$(git log -1 --pretty=format:"Last commit (%h) by %an on %cs")
commit_long=$(git log -1 --pretty=format:"Last commit %H%nAuthor: %an%nAuthor date: %ad%nCommitter: %cn%nComitter date: %cd%n%nComitt message: %s")
output="{\"commit_short\": \"$commit_short\", \"commit_long\": \"$commit_long\", \"directory\": {\"$root_name\": {\"_name\": \"$root_name\", \"_date\": \"\", \"_time\": \"\", \"_type\": \"dir\", \"_parent\": \"\","
output="$output $(cd "$PWD/"; recursivemap "$root_name")"
output="${output::-1}}}}"

# output to config.json
cd src/data && { echo $output > config.json ; cd -;}
