#!/bin/bash


# Outputs directory as string
addDirectory() {
  # Args: dir_name, date, time, parent_dir_name
  echo "\"$1\":{\"_name\": \"$1\", \"_date\": \"$2\", \"_time\": \"$3\", \"_type\": \"dir\", \"_parent\": \"$4\",
        \".\":{\"_name\": \"$1\", \"_date\": \"$2\", \"_time\": \"$3\", \"_type\": \"dir\", \"_parent\": \"$4\"},
        \"..\":{\"_name\": \"$1\", \"_date\": \"$2\", \"_time\": \"$3\", \"_type\": \"dir\", \"_parent\": \"$4\"},"
}

# Outputs file as string
addFile() { 
  # Args: file_name, date, time, file_type, parent_dir_name
  echo "\"$1\":{\"_name\": \"$1\", \"_date\": \"$2\", \"_time\": \"$3\", \"_type\": \"$4\", \"_parent\": \"$5\"},"
}

# Outputs file system as json formatted string
generateFileSystem() { 
  # Args: dir_name
  for e in *; do
    if [[ $e = "*" ]] || [[ $e = ".git"* ]] || [[ $e = "node_modules" ]] || [[ $e = "index.html" ]] || [[ $e = "README.md" ]]; then
      continue
    fi

    d=$(date -r "$e" "+%d/%m/%Y")
    t=$(date -r "$e" "+%H:%M")
    p="$1$e/"

    if [ -d "$e" ]; then
      result="$(addDirectory $e $d $t $1)"
      
      cd "$e"
      result="$result$(generateFileSystem $p)"
      echo "${result::-1}},"
      cd ".."
    else
      echo "$(addFile $e $d $t 'txt' $p)"
    fi
  done
}

# Generate json string
output="{$(addDirectory '/' '' '' '')"
output="$output $(generateFileSystem '/')"
output="${output::-1}}}"

# For testing:
# echo $output

# For writing to file:
echo $output > etc/fileSystem.json
