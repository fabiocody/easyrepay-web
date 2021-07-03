#!/bin/sh

echo "-> Merging main into release"
git checkout release
rm -rf dist
git merge main
echo "-> Updating dependencies and building frontend"
cd angular
npm ci
npm run build
echo "-> Updating dependencies and building backend"
cd ..
npm ci
npm run build
echo "-> Committing release"
git add .
git commit -am "Release"
git push
git checkout main
