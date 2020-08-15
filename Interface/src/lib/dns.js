// This function creates an RFC 1035 DNS master file
export function generateDNSFile(server, clients, network) {
    const deviceNames = clients.map(client => {
        if (client.ip.v6 && client.ip.v4) {
            return `${client.name} IN A ${server.subnet.v4 + client.ip.v4}
${client.name} IN AAAA ${server.subnet.v6 + client.ip.v6}`
        }
        if (client.ip.v6 && !client.ip.v4) {
            return `${client.name} IN AAAA ${server.subnet.v6 + client.ip.v6}`
        }
        if (!client.ip.v6 && client.ip.v4) {
            return `${client.name} IN A ${server.subnet.v4 + client.ip.v4}`
        }
    })
    const serverName = () => {
        if (server.subnet.v6 && server.subnet.v4) {
            return `wirtbot IN A ${server.subnet.v4 + '1'}
wirtbot IN AAAA ${server.subnet.v6 + '1'}`
        }
        if (server.subnet.v6 && !server.subnet.v4) {
            return `wirtbot IN AAAA ${server.subnet.v6 + "1"}`
        }
        if (!server.subnet.v6 && server.subnet.v4) {
            return `wirtbot IN A ${server.subnet.v4 + "1"}`
        }
    }
    const masterFile = `$ORIGIN ${network.dnsName}
${serverName()}
${deviceNames.join("\n")}`
    return masterFile.trim();
}