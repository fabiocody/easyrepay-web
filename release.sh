#!/bin/sh

git checkout release
cd angular
npm run build
cd ..
git commit -am "Release"
git push
