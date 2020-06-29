#/bin/sh
shopt -s dotglob

# recursive mapping function for subdirectories and files
recursivemap() {
  # for each file in current directory
  for file in *; do
    # ignore empty directory
    if [[ $file = "*" ]] || [[ $file = "_"* ]]; then
      continue
    fi

    # get file last modification date and time
    _date=$(date -r $file "+%d/%m/%Y")
    _time=$(date -r $file "+%H:%M")

    # if is directory
    if [ -d "$file" ]; then
      result="\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\","
      result="$result\".\":{\"_name\": \".\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result\"..\":{\"_name\": \"..\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result$(cd -- "$file" && recursivemap "${1}/${file}")"
      echo "${result::-1}},"
    # else is file
    else
      # ignore index.html
      # if [[ $file = *".html"* ]]; then
        # continue
      # fi

      # if is executable
      if [[ $file = *".exe"* ]]; then
        echo "\"$file\":{\"_name\": \"${file::-4}\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"exe\", \"_parent\": \"$1\"},"
      # if is picture
      elif [[ $file = *".png" ]] || [[ $file = *".jpg" ]]; then
        echo "\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"pic\", \"_parent\": \"$1\"},"
      # if is webpage
      elif [[ $file = *".html" ]]; then
        echo "\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"html\", \"_parent\": \"$1\"},"
      # else is text
      else
        echo "\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"txt\", \"_parent\": \"$1\"},"
      fi

    fi
  done
}

# generate content of json file
output="{\"directory\": {\"edgorman\": {\"_name\": \"edgorman\", \"_date\": \"\", \"_time\": \"\", \"_type\": \"dir\", \"_parent\": \"\","
output="$output $(cd "$PWD/"; recursivemap "edgorman")"
output="${output::-1}}}}"

# output to config.json
echo $output > _config.json
