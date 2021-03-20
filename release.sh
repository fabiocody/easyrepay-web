#!/bin/sh

git checkout release
git merge main
cd angular
npm run build
cd ..
git add .
git commit -am "Release"
git push
git checkout main
