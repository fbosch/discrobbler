#!/bin/bash
rm -rf dist
rm -rf public
mkdir public

# build
yarn run build
cp index.html public/index.html
cp -r dist public 