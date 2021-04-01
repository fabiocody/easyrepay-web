#!/bin/sh

git checkout release
git merge main
npm install --prefix angular
npm run build --prefix angular
npm install
npm run build
git add .
git commit -am "Release"
git push
git checkout main
