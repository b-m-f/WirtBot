#! /bin/bash
filename='.version'
while read line; do
	echo "Updating all packages to $line"
	find . -type f -name "package.json" -not -path "*/node_modules**" -exec sed -i -e "s|version\": \".*\"|version\": \"$line\"|" {} \;
	find . -type f -wholename "**store/index.js" -not -path "*/node_modules**" -exec sed -i -e "s|version: \".*\",|version: \"$line\",|" {} \;
	find . -type f -name "Cargo.toml" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$line\"|" {} \;
	find . -type f -name "Cargo.lock" -not -path "*/node_modules**" -exec sed -i -e "s|^version = \".*\"|version = \"$line\"|" {} \;
	find Installer -type f -name "WirtBot.docker-compose.yml.j2" -not -path "*/node_modules**" -exec sed -i -e "s|bmff/wirtbot:.*|bmff/wirtbot:$line|" {} \;
	echo "Finished updating please release the installer if necessary and create a Tag to release"
done < $filename
