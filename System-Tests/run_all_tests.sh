#! /bin/bash
cd tests/
for test in test_*
do
    node tests.mjs $test
done
cd -