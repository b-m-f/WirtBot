// This function creates an RFC 1035 DNS master file
export function generateDNSFile(server, clients, network) {
    const deviceNames = clients.map(client => {
        if (client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dns.name}
        ${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dns.name}`
        }
        if (client.ip.v6 && !client.ip.v4) {
            return `${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dns.name}`
        }
        if (!client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dns.name}`
        }
    })
    const serverName = () => {
        if (server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + '1'} wirtbot.${network.dns.name}
        ${server.subnet.v6 + '1'} wirtbot.${network.dns.name}`
        }
        if (server.subnet.v6 && !server.subnet.v4) {
            return `${server.subnet.v6 + "1"} wirtbot.${network.dns.name}`
        }
        if (!server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + "1"} wirtbot.${network.dns.name}`
        }
    }
    const masterFile = `${network.dns.name} {
    reload
    hosts {
        ${serverName()}
        ${deviceNames.join("\n        ")}
    }
}`
    return masterFile.trim();
}