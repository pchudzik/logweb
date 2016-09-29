#/bin/bash

while [ 1 -eq 1 ]; do
	NOW=`date +%Y-%m-%d:%H:%M:%S` 
	RAND=`od -vAn -N4 -tu4 < /dev/urandom`
	echo "$NOW: Log message $1 $RAND"
	sleep 1
done;

