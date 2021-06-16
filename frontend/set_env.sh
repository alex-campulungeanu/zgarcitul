#!/bin/bash

echo "Start setting variable from .env"

# eval $(egrep -v '^#' .env | tr '[:upper:]' '[:lower:]' | xargs) MYCOMMAND
# # … or ...
export $(egrep -v '^#' .env | xargs)

echo "Finish setting"