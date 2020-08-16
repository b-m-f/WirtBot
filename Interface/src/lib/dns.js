// This function creates an RFC 1035 DNS master file
export function generateDNSFile(server, clients, network) {
    const deviceNames = clients.map(client => {
        if (client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dnsName}
        ${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dnsName}`
        }
        if (client.ip.v6 && !client.ip.v4) {
            return `${server.subnet.v6 + client.ip.v6} ${client.name}.${network.dnsName}`
        }
        if (!client.ip.v6 && client.ip.v4) {
            return `${server.subnet.v4 + client.ip.v4} ${client.name}.${network.dnsName}`
        }
    })
    const serverName = () => {
        if (server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + '1'} wirtbot.${network.dnsName}
        ${server.subnet.v6 + '1'} wirtbot.${network.dnsName}`
        }
        if (server.subnet.v6 && !server.subnet.v4) {
            return `${server.subnet.v6 + "1"} wirtbot.${network.dnsName}`
        }
        if (!server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + "1"} wirtbot.${network.dnsName}`
        }
    }
    const masterFile = `${network.dnsName} {
    reload
    hosts {
        ${serverName()}
        ${deviceNames.join("\n        ")}
    }
}`
    return masterFile.trim();
}