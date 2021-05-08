#!/bin/sh

echo "-> Merging main into release"
git checkout release
rm -rf dist
git merge main
echo "-> Building frontend"
cd angular
npm install
npm run build
echo "-> Building backend"
cd ..
npm install
npm run build
echo "-> Committing release"
git add .
git commit -am "Release"
git push
git checkout main
