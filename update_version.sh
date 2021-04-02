#! /bin/bash
version=$(cat .version)
echo "Updating all packages to $line"
find . -type f -name "package.json" -not -path "*/node_modules**" -exec sed -i -e "s|version\": \".*\"|version\": \"$line\"|" {} \;
find . -type f -wholename "**store/index.js" -not -path "*/node_modules**" -exec sed -i -e "s|const version = \".*\"|const version = \"$line\"|" {} \;
find . -type f -name "Cargo.toml" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$line\"|" {} \;
cd Core
cargo build
cd ..

git add .
git commit -m "Updates to $version"
echo "Finished updating. Update commit was added. Now create a Tag and push to release."
