#!/bin/bash
rm -rf dist
rm -rf public
mkdir public

# build
npm rebuild node-sass
yarn run build
cp index.html public/index.html
cp manifest.json public/manifest.json
cp -r dist public 