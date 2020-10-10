const Configstore = require('configstore');
const packageJson = require('./package.json');
const prompts = require('prompts');
const fs = require("fs").promises;

const configPath = "./wirt-installer.config.json"

const config = new Configstore(packageJson.name, {}, { configPath });

const runAnsible = async ({ user, serverIP, password, sshKey, wirtBotUIKey }) => {


}


const main = async () => {
    // TODO: verify the inputs
    const questions = [
        {
            type: config.get('serverIP') ? null : 'text',
            name: 'serverIP',
            message: 'What is the IP address of your server?'
        },
        {
            type: config.get('user') ? null : 'text',
            name: 'user',
            message: 'Maintenance user name'
        },
        {
            type: 'text',
            name: 'password',
            message: 'Password for the maintenance user'
        },
        // TODO: make open SSH port optional
        {
            type: config.get('sshKey') ? null : 'text',
            name: 'sshKey',
            message: 'Please paste the Public Key of the keypair you want to use for accessing the WirtBot via SSH'
        },
        {
            type: config.get('wirtBotUIKey') ? null : 'text',
            name: 'wirtBotUIKey',
            message: 'Public key of the WirtBot UI'
        },
        {
            type: config.get('domain') ? null : 'text',
            name: 'domain',
            message: 'Domain name that points to WirtBot'
        },
        {
            type: config.get('email') ? null : 'text',
            name: 'email',
            message: 'Email for SSL certificate'
        },
    ];

    const response = await prompts(questions);

    Object.keys(response).forEach(entry => {
        if (!entry === 'password') {
            config.set(entry, response[entry])
        }
    })

    runAnsible({ ...config.get(), password: response.password })

};

main();

