#!/bin/sh

git checkout release
git merge main
cd angular
npm install
npm run build
cd ..
npm install
npm run build
git add .
git commit -am "Release"
git push
git checkout main
