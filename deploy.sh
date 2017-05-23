#!/bin/bash

rm -rf public
mkdir public

# build
yarn run build
sed -e 's/base href="\/\"/base href="\/vue-discogs-scrobbler"/g' index.html > public/index.html
cp -r dist public 