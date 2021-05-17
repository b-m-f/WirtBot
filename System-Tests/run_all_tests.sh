#! /bin/bash
set -ex


cd tests/
for test in test_*
do
  URL=localhost:8080 API=localhost:3030 node tests.mjs $test
done
cd -
