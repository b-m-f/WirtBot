import path from "path";
import { spawn } from "child_process";

export const runAnsible = async ({
    user,
    serverIP,
    password,
    sshKey,
    wirtBotUIKey,
    domain,
    email,
    update,
    sshPrivateKeyPath,
    dnsConfig,
    serverConfig
}) => {
    let args = [
        "-i", `${serverIP},`, path.join(__dirname, "../ansible/main.yml"),
        "--extra-vars", `wirtui_public_key="${wirtBotUIKey}"`,
        "--extra-vars", `maintainer_username=${user}`,
        "--extra-vars", `maintainer_ssh_key="${sshKey}"`,
        "--extra-vars", `maintainer_password=${password}`,
        "--extra-vars", `letsencrypt_email=${email}`,
        "--extra-vars", `domain_name=${domain}`,
        "--extra-vars", `update=true`,
        "--extra-vars", 'ansible_python_interpreter=/usr/bin/python3',
    ]

    const updateArguments = [
        `--extra-vars`, `ansible_become_pass=${password}`,
        '--private-key', `${sshPrivateKeyPath}`,
        `--user`, `${user}`,
    ]
    const installArguments = [
        `--user`, `root`,
        '--ask-pass',
        "--extra-vars", `initial_server_config="${serverConfig}"`,
        "--extra-vars", `initial_dns_config="${dnsConfig}"`,
        "--ssh-common-args='-o StrictHostKeyChecking=no'"
    ]
    if (update) {
        args = [...args, ...updateArguments]
    } else {
        console.log("If you have an SSH key on the server during initial setup, use an SSH config and simply hit Enter when asked for a password")
        args = [...args, ...installArguments]
    }

    const ansible = spawn("ansible-playbook", args);

    return new Promise((resolve, reject) => {
        ansible.stdout.on("data", data => {
            console.log(`${data} `);
        });

        ansible.stderr.on("data", data => {
            console.log(`Error: ${data} `);
        });

        ansible.on('error', (error) => {
            console.log(`Error: ${error.message} `);
            reject(error);
        });

        ansible.on("close", code => {
            if (code == 0) {
                resolve("Ansible ran successfully");
            }
            else {
                reject("Ansible exited with error code: " + code);
            }
        });

    })



}