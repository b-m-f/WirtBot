#! /bin/bash

if ! command -v ncu &> /dev/null
then
    echo "Please install npm-check-updates with 'npm i -g npm-check-updates'"
    exit
fi
# TODO: remove the reject once the sass-loader 11 is supported by vuepress, which means it needs to support webpack5 properly.
# Wait for v2
cd ./Website && ncu -u --reject sass-loader,webpack && npm i && npm audit fix || cd -
cd ./Interface && ncu -u && npm i && npm audit fix || cd -
cd ./System-Tests && ncu -u && npm i && npm audit fix || cd -
cd ./Interface/src/lib/crate && cargo update || cd -
cd ./Core && cargo update || cd -

