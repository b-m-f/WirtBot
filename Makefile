test-interface: 
	if [[ "$(docker images -q test-server 2> /dev/null)" == "" ]]; then
    	docker build WirtBot -t test-server
	fi
    docker build Interface -t test-interface
	docker-compose -f compose/test.yml up --remove-orphans --abort-on-container-exit

dev: dev-server dev-client

dev-server:
	cd ./WirtBot && make dev

dev-client: 
	cd ./Interface && npm run dev

setup-wirtbot:
	@read -p "Please enter the IP of your server: " ip;\
	ansible-playbook ansible/main.yml -i $$ip, --user root -e 'ansible_python_interpreter=/usr/bin/python3'  --ask-pass 

update-wirtbot:
	@read -p "Please enter the IP of your server: " ip; \
	read -p "Enter the path to the maintainer ssh key: " key; \
	ansible-playbook ansible/main.yml -i $$ip, --user wirt -K  -e 'ansible_python_interpreter=/usr/bin/python3'  --private-key=$$key
