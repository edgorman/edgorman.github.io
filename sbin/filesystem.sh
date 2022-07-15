#!/bin/bash


# Outputs directory as string
addDirectory() {
  # Args: dir_name, date, time
  echo "\"$1\":{\"date\": \"$2\", \"time\": \"$3\", \"type\": \"dir\", \"children\": { "
}

# Outputs file as string
addFile() { 
  # Args: file_name, date, time, file_type
  echo "\"$1\":{\"date\": \"$2\", \"time\": \"$3\", \"type\": \"$4\"},"
}

# Outputs file system as json formatted string
generate() { 
  # Args: dir_name
  for e in *; do
    # Ignore these entries
    if [[ $e = "*" ]] || [[ $e = ".git"* ]] || [[ $e = "node_modules" ]] || [[ $e = "404.html" ]]; then
      continue
    fi
    
    # Get date and time of last edit
    dt=($(git log -1 --pretty=format:%ci -- "$e"))
    if [ -z "$dt" ]; then
      d=$(date "+%Y-%m-%d")
      t=$(date "+%H:%M:%S")
    else
      d=${dt[0]}
      t=${dt[1]}
    fi
    
    # Get parent
    p="$1$e/"
    
    # If entry is a directory
    if [ -d "$e" ]; then
      result=$(addDirectory "$e" $d $t "$1")
      
      cd "$e"
      result="$result$(generate "$p")"
      echo "${result::-1}}},"
      cd ".."
    # Else entry is a file
    else
      n="${e##*.}"
      echo $(addFile "$e" $d $t $n "$1")
    fi
  done
}

# Generate json string
output="{$(addDirectory '/' '' '' '')"
output="$output $(generate '/')"
output="${output::-1}}}}"

# For testing:
# echo $output

# For writing to file:
echo $output > proc/filesystem