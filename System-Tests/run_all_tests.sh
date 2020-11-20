#! /bin/bash
for test in test_*
do
    node tests.mjs $test
done