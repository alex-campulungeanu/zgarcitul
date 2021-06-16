#!/bin/bash
echo "Start unset variables"
unset http_proxy
unset https_proxy
git config --unset http.proxy
git config --unset https.proxy

echo "Finish unset variables"