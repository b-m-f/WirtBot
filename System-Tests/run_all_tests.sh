#! /bin/bash
set -ex


cd tests/
for test in test_*
do
  # capture external ENV variables if present or set project defaults
  API=${API:-localhost:3030}
  URL=${URL:-localhost:8080}
  
  URL=$URL API=$API node tests.mjs $test
done
cd -
