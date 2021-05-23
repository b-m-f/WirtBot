#! /bin/bash
set -eou pipefail

version=$(cat .version)
echo "Updating all packages to $version"
find . -type f -name "package.json" -not -path "*/node_modules**" -exec sed -i -e "s|version\": \".*\"|version\": \"$version\"|" {} \;
find . -type f -wholename "**store/index.js" -not -path "*/node_modules**" -exec sed -i -e "s|const version = \".*\"|const version = \"$version\"|" {} \;
find . -type f -name "Cargo.toml" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$version\"|" {} \;
cd Core
cargo build
cd ..


mv CHANGELOG.md CHANGELOG.md.bkp
git log $(git describe --tags --abbrev=0)..HEAD --pretty=tformat:"%h %s%n" > CHANGELOG.md
cat CHANGELOG.md.bkp >> CHANGELOG.md
mv CHANGELOG.md CHANGELOG.md.bkp
echo "## $version" > CHANGELOG.md
cat CHANGELOG.md.bkp >> CHANGELOG.md
rm CHANGELOG.md.bkp

git add .
git commit -m "Updates to $version"
echo "Finished updating. Update commit was added. Now create a Tag and push to release."
