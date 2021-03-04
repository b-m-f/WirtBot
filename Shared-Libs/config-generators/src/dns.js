// This function creates an RFC 1035 DNS master file
export function generateDNSFile(server, clients, network) {
    const tls = network.dns.tls;
    const tlsName = network.dns.tlsName;
    const dnsV4 = network.dns.ip.v4 || "1.1.1.1";
    const dnsV6 = network.dns.ip.v6;
    const deviceNames = clients.map(client => {
        client.name = client.name.split(' ').join('-');
        if (!server.name) {
            server.name = "wirtbot";
        }

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
            return `${server.subnet.v4 + '1'} ${server.name}.${network.dns.name}
        ${server.subnet.v6 + '1'} ${server.name}.${network.dns.name}`
        }
        if (server.subnet.v6 && !server.subnet.v4) {
            return `${server.subnet.v6 + "1"} ${server.name}.${network.dns.name}`
        }
        if (!server.subnet.v6 && server.subnet.v4) {
            return `${server.subnet.v4 + "1"} ${server.name}.${network.dns.name}`
        }
    }

    const forwardConfig = () => {
        if (tls) {
            return `forward . ${dnsV4 ? `tls://` + dnsV4 + " " : ""}${dnsV6 ? `tls://` + dnsV6 + "" : ""}{
       except ${network.dns.name} lan local home fritz.box
       tls_servername ${tlsName}
       health_check 5s
    }`
        } else {
            return `forward . ${dnsV4 ? dnsV4 + "" : ""}${dnsV6 ? dnsV6 : ""} {
       except ${network.dns.name} lan local home fritz.box
       health_check 5s
    }`
        }
    }


    const masterFile = `. {
    reload
    ${forwardConfig()}
    cache 30
}
${network.dns.name} {
    hosts {
        ${serverName()}
        ${deviceNames.join("\n        ")}
    }
}`
    return masterFile.trim();
}