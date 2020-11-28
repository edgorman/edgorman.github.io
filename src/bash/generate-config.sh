#/bin/sh
shopt -s dotglob

# recursive mapping function for subdirectories and files
recursivemap() {
  # for each file in current directory
  for file in *; do
    # ignore empty directory and includes and .git folder
    if [[ $file = "*" ]] || [[ $file = ".git" ]]; then
      continue
    fi

    # get file last modification date and time
    _date=$(date -r "$file" "+%d/%m/%Y")
    _time=$(date -r "$file" "+%H:%M")

    # if is directory
    if [ -d "$file" ]; then
      result="\"$file\":{\"_name\": \"$file\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\","
      result="$result\".\":{\"_name\": \".\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result\"..\":{\"_name\": \"..\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"dir\", \"_parent\": \"$1\"},"
      result="$result$(cd -- "$file" && recursivemap "${1}${file}/")"
      echo "${result::-1}},"
    # else is file
    else
      # if is executable
      if [[ $file = *".exe"* ]]; then
        file_name=${file::-4}
        file_type="exe"
      # if is text
      elif [[ $file = *".txt" ]]; then
        file_name=$file
        file_type="txt"
      # if is picture
      elif [[ $file = *".png" ]] || [[ $file = *".jpg" ]]; then
        file_name=$file
        file_type="pic"
      # if is webpage
      elif [[ $file = *".html" ]]; then
        file_name=$file
        file_type="html"
      # else is data
      else
        file_name=$file
        file_type="data"
      fi
      # output file
      echo "\"$file\":{\"_name\": \"$file_name\", \"_date\": \"$_date\", \"_time\": \"$_time\", \"_type\": \"$file_type\", \"_parent\": \"$1\"},"
    fi
  done
}

# generate content of json file
root_name="/"
output="{\"directory\": {\"$root_name\": {\"_name\": \"$root_name\", \"_date\": \"\", \"_time\": \"\", \"_type\": \"dir\", \"_parent\": \"\","
output="$output $(cd "$PWD/"; recursivemap "$root_name")"
output="${output::-1}}}}"

# output to config.json
echo $output > config.json
