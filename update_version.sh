#! /bin/bash
filename='.version'
while read line; do
	echo "Updating all packages to $line"
	find . -type f -name "package.json" -not -path "*/node_modules**" -exec sed -i -e "s|version\": \".*\"|version\": \"$line\"|" {} \;
	find . -type f -wholename "**store/index.js" -not -path "*/node_modules**" -exec sed -i -e "s|version: \".*\",|version: \"$line\",|" {} \;
	find . -type f -name "Cargo.toml" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$line\"|" {} \;
	find . -type f -name "Cargo.lock" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$line\"|" {} \;
	echo "Finished updating, now create a Tag to release"
done < $filename
