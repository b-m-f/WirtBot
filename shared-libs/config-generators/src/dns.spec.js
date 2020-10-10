import { generateDNSFile } from "./dns";

describe("Correctly generates a valid DNS master file", () => {
    it("for IPv4", () => {
        const server = {
            subnet: { v4: "10.10.10." },
        };
        const device = { ip: { v4: 2 }, name: "test" };
        expect(generateDNSFile(server, [device], { dns: { name: "wirt.test" } })).toBe(`. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except wirt.test lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
wirt.test {
    hosts {
        10.10.10.1 wirtbot.wirt.test
        10.10.10.2 test.wirt.test
    }
}`
        )
    })
    it("for IPv6", () => {
        const server = {
            subnet: { v6: "1001::" },
        };
        const device = { ip: { v6: 2 }, name: "test" };
        expect(generateDNSFile(server, [device], { dns: { name: "wirt.test" } })).toBe(`. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except wirt.test lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
wirt.test {
    hosts {
        1001::1 wirtbot.wirt.test
        1001::2 test.wirt.test
    }
}`


        )

    })
    it("for multiple IPv4 and IPv6 clients", () => {
        const server = {
            subnet: { v6: "1001::", v4: "10.10.10." },
        };
        const devices = [
            { ip: { v6: 2, v4: 2 }, name: "test" },
            { ip: { v6: 3, v4: 3 }, name: "test2" }
        ]
        expect(generateDNSFile(server, devices, { dns: { name: "wirt.test" } })).toBe(`. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except wirt.test lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
wirt.test {
    hosts {
        10.10.10.1 wirtbot.wirt.test
        1001::1 wirtbot.wirt.test
        10.10.10.2 test.wirt.test
        1001::2 test.wirt.test
        10.10.10.3 test2.wirt.test
        1001::3 test2.wirt.test
    }
}`

        )


    })
    it("for mixed IPv4 and IPv6 clients", () => {
        const server = {
            subnet: { v6: "1001::", v4: "10.10.10." },
        };
        const devices = [
            { ip: { v4: 2 }, name: "test" },
            { ip: { v6: 3 }, name: "test2" }
        ]
        expect(generateDNSFile(server, devices, { dns: { name: "wirt.test" } })).toBe(`. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except wirt.test lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
wirt.test {
    hosts {
        10.10.10.1 wirtbot.wirt.test
        1001::1 wirtbot.wirt.test
        10.10.10.2 test.wirt.test
        1001::3 test2.wirt.test
    }
}`
        )
    })
    it("for devices that have spaces or special characters in their name", () => {
        const server = {
            subnet: { v4: "10.10.10." },
        };
        const device = { ip: { v4: 2 }, name: "test me" };
        expect(generateDNSFile(server, [device], { dns: { name: "wirt.test" } })).toBe(`. {
    reload
    forward . tls://1.1.1.1 tls://1.0.0.1 {
       except wirt.test lan local home fritz.box
       tls_servername cloudflare-dns.com
       health_check 5s
    }
    cache 30
}
wirt.test {
    hosts {
        10.10.10.1 wirtbot.wirt.test
        10.10.10.2 test-me.wirt.test
    }
}`
        )
    })
})