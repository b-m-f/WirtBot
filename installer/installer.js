const Configstore = require('configstore');
const packageJson = require('./package.json');
const prompts = require('prompts');
const fs = require("fs").promises;
const { spawn } = require("child_process");

const configPath = "./wirt-installer.config.json"

const config = new Configstore(packageJson.name, {}, { configPath });

const runAnsible = async ({
    user,
    serverIP,
    password,
    sshKey,
    wirtBotUIKey,
    domain,
    email,
    update,
    sshPrivateKeyPath
}) => {
    let arguments = [
        "-i", `${serverIP},`, "ansible/main.yml",
        "--extra-vars", `wirtui_public_key = ${wirtBotUIKey} `,
        "--extra-vars", `maintainer_username = ${user} `,
        "--extra-vars", `maintainer_ssh_key = ${sshKey} `,
        "--extra-vars", `maintainer_password = ${password} `,
        "--extra-vars", `letsencrypt_email = ${email} `,
        "--extra-vars", `domain_name = ${domain} `,
        "--extra-vars", 'ansible_python_interpreter=/usr/bin/python3',
    ]

    const updateArguments = [
        `--extra-vars`, `ansible_become_pass=${password}`,
        '--private-key', `${sshPrivateKeyPath}`,
        `--user`, `${user}`,
    ]
    const installArguments = [
        `--user`, `root`,
        '--ask-pass'

    ]
    if (update) {
        arguments = [...arguments, ...updateArguments]
    } else {
        console.log("If you have an SSH key on the server during initial setup, use an SSH config and simply hit Enter when asked for a password")
        arguments = [...arguments, ...installArguments]
    }

    const ansible = spawn("ansible-playbook", arguments);

    ansible.stdout.on("data", data => {
        console.log(`${data} `);
    });

    ansible.stderr.on("data", data => {
        console.log(`Error: ${data} `);
    });

    ansible.on('error', (error) => {
        console.log(`Error: ${error.message} `);
    });

    ansible.on("close", code => {
    });


}


const main = async () => {
    const updateOrInstallQuestions = [
        {
            type: 'select',
            name: 'value',
            message: 'Choose a mode',
            choices: [
                { title: 'Update', description: 'Update an existing installation', value: 'update' },
                { title: 'Install', description: 'Install a new WirtBot', value: 'install' },
            ],
            initial: 1
        }

    ]
    // TODO: verify the inputs
    const questionsInstall = [
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
    const questionsUpdate = [
        {
            type: 'text',
            name: 'password',
            message: 'Password for the maintenance user'
        },
        {
            type: 'text',
            name: 'sshPrivateKeyPath',
            message: 'Path to private key to enter WirtBot via SSH'
        },
    ];

    const updateOrInstall = await prompts(updateOrInstallQuestions);
    if (updateOrInstall["value"] === 'install') {
        const response = await prompts(questionsInstall);
        Object.keys(response).forEach(entry => {
            if (entry !== 'password') {
                config.set(entry, response[entry])
            }
        })
        console.log(config.all)

        runAnsible(Object.assign({}, config.all, { password: response.password, update: false }))

    }
    if (updateOrInstall["value"] === 'update') {
        const response = await prompts(questionsUpdate);
        Object.keys(response).forEach(entry => {
            if (entry !== 'password') {
                config.set(entry, response[entry])
            }
        })
        console.log(config.all)

        runAnsible(Object.assign({}, config.all, { password: response.password, update: true, sshPrivateKeyPath: response.sshPrivateKeyPath }))

    }


};

main();

