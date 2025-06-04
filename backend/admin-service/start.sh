#!/bin/sh
set -e

host="$1"
shift
cmd="$@"

echo "Checking for $host..."
until nc -z -v -w30 $host 5432
do
  echo "Waiting for database connection..."
  sleep 5
done
echo "Database is up!"

npm install
npm start

