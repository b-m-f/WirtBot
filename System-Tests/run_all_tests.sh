#! /bin/bash
set -ex


cd tests/
for test in test_*
do
  # capture external ENV variables if present or set project defaults
  URL=$URL || localhost:8080
  API=$API || localhost:3030
  
  URL=$URL API=$API node tests.mjs $test
done
cd -
