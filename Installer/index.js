import Configstore from 'configstore';
import prompts from 'prompts';
import { promises as fs, existsSync } from "fs"
import { generateServerConfig, generateDeviceConfig, generateDNSFile } from '@wirtbot/config-generators'
import { getKeys, generateSigningKeys } from '@wirtbot/crypto'
import { runAnsible } from './src/ansible'

const configPath = "./wirtbot-installer.config.json"

const config = new Configstore("wirtbot-installer", {}, { configPath });

const update = async () => {
    const questionsUpdate = [
        {
            type: config.get('password') ? null : 'password',
            name: 'password',
            message: 'Password for the maintenance user'
        },
        {
            type: config.get('sshPrivateKeyPath') ? null : 'text',
            name: 'sshPrivateKeyPath',
            message: 'Path to private key to enter WirtBot via SSH'
        },
    ];
    const response = await prompts(questionsUpdate);
    console.log("Configuration written to", configPath);
    Object.keys(response).forEach(entry => {
        if (entry !== 'password') {
            config.set(entry, response[entry])
        }
    })
    await runAnsible(Object.assign({}, config.all, { serverIP: "10.10.0.1", password: response.password, update: true, sshPrivateKeyPath: config.get('sshPrivateKeyPath') }));

}

const install = async () => {
    const questionsInstall = [
        {
            type: config.get('serverIP') ? null : 'text',
            name: 'serverIP',
            message: 'What is the IP address of your server?',
            validate: ip => /^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3},?)+$/.test(ip)
        },
        {
            type: config.get('user') ? null : 'text',
            name: 'user',
            message: 'Maintenance user name',
        },
        {
            type: config.get('password') ? null : 'password',
            name: 'password',
            message: 'Password for the maintenance user'
        },
        {
            type: config.get('password') ? null : 'password',
            name: 'password2',
            message: 'Password again'
        },
        {
            type: config.get('sshKey') ? null : 'text',
            name: 'sshKey',
            message: 'Please paste the Public Key of the keypair you want to use for accessing the WirtBot via SSH'
        },
        {
            type: config.get('hasBackup') !== undefined ? null : 'toggle',
            name: "hasBackup",
            message: 'Do you have a backup?',
            active: 'yes',
            inactive: 'no',
            initial: false,
        },
        {
            type: prev => prev == true ? config.get('backupPath') ? null : 'text' : null,
            name: 'backupPath',
            message: 'Specify the relative path to the backup'
        },
    ];
    const response = await prompts(questionsInstall);
    console.log("Configuration written to", configPath)
    try {
        let allowedPublicKey = undefined;
        Object.keys(response).forEach(entry => {
            if (entry === 'password') {
                if (response['password'] !== response['password2']) {
                    console.error("Passwords for maintainer dont match");
                    process.exit(1);
                }
            }
            // These entries wont be saved into the config file
            else if (entry === 'password2' || entry === 'hasBackup' || entry === "backupPath") {
            }
            else {
                config.set(entry, response[entry]);
            }
        });



        const devices = [];
        let server = undefined;

        if (response['backupPath'] || config.get('backupPath')) {
            const backupFile = await fs.readFile(response['backupPath'] || config.get('backupPath'), 'utf8');
            const backup = JSON.parse(backupFile);
            allowedPublicKey = backup.keys.public;
            config.set("wirtBotUIKey", allowedPublicKey);
            assert.match(args, /initial_dns_config=".*"/);
            server = {
                ip: {
                    v4: config.get('serverIP').split('.')
                },
                port: backup.server.port,
                keys: backup.server.keys,
                subnet: backup.server.subnet
            };
            backup.devices.forEach(device => {
                devices.push(device)
            })
            console.log(`Generating configs for ${backup.devices.length} devices`)

            const dns = backup.network.dns;
            const serverConfig = generateServerConfig(server, devices);
            const dnsConfig = generateDNSFile(server, devices, { dns });
            await runAnsible(Object.assign({}, config.all, { password: response.password, update: false, serverConfig, dnsConfig }));

            const folderName = 'WirtBot\ Configurations'
            const folderExists = await existsSync(folderName)
            if (!folderExists) {
                await fs.mkdir(folderName);

            }

            devices.forEach(async device => {
                const deviceConfig = generateDeviceConfig(device, server);
                await fs.writeFile(`${folderName}/${device.name}.conf`, deviceConfig, 'utf8');

            })
            console.log("Updated configurations for devices written to 'WirtBot Configurations' directory. Use them in case the external server IP has changed")


        } else {
            const serverKeys = await getKeys();
            const deviceKeys = await getKeys();
            const signingKeys = await generateSigningKeys();

            const device = { ip: { v4: 2 }, name: "Change me", keys: deviceKeys, type: "Linux" }
            devices.push(
                device
            );
            server = { ip: { v4: config.get('serverIP').split('.') }, port: 10101, keys: serverKeys, subnet: { v4: "10.10.0.", v6: "1010:1010:1010:1010:" } };
            config.set("wirtBotUIKey", signingKeys.public);
            const deviceConfig = generateDeviceConfig(device, server);
            const interfaceState = JSON.stringify(JSON.stringify({
                version: 1.1,
                server,
                devices: [device],
                keys: signingKeys
            }));
            const dns = {
                name: "wirt.internal", config: "", ip: { v4: [1, 1, 1, 1] },
                tlsName: "cloudflare-dns.com", tls: true
            }

            const serverConfig = generateServerConfig(server, devices);
            const dnsConfig = generateDNSFile(server, devices, { dns });
            await runAnsible(Object.assign({}, config.all, { password: response.password, update: false, serverConfig, dnsConfig }));


            await fs.writeFile('UseThisWireGuardConfigurationToConnectToYourWirtBot.conf', deviceConfig, 'utf8');
            await fs.writeFile('ImportThisFileIntoYourWirtBotInterface.json', interfaceState, 'utf8');

        }


    } catch (error) {
        console.error(error);
    }

}

const main = async () => {
    console.log(config.get('mode'))
    const updateOrInstallQuestions = [
        {
            type: config.get('mode') ? null : 'select',
            name: 'value',
            message: 'Choose a mode',
            choices: [
                { title: 'Update', description: 'Update an existing installation', value: 'update' },
                { title: 'Install', description: 'Install a new WirtBot', value: 'install' },
            ],
            initial: 1
        }

    ]
    const updateOrInstall = await prompts(updateOrInstallQuestions);
    if (updateOrInstall["value"] === 'install' || config.get('mode') === 'install') {
        try {
            await install();
            console.log("Installation complete")
        } catch (error) {
            console.error(error)
        }
    }
    if (updateOrInstall["value"] === 'update' || config.get('mode') === 'update') {
        try {
            await update();
            console.log("Ran update successfully")
        } catch (error) {
            console.error(error)
        }
    }
};

main();

