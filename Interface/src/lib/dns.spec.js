import { generateDNSFile } from "./dns";

describe("Correctly generates a valid DNS master file", () => {
    it("for IPv4", () => {
        const server = {
            subnet: { v4: "10.10.10." },
        };
        const device = { ip: { v4: 2 }, name: "test" };
        expect(generateDNSFile(server, [device], { dnsName: "wirt.test" })).toBe(`$ORIGIN wirt.test
wirtbot IN A 10.10.10.1
test IN A 10.10.10.2`
        )
    })
    it("for IPv6", () => {
        const server = {
            subnet: { v6: "1001::" },
        };
        const device = { ip: { v6: 2 }, name: "test" };
        expect(generateDNSFile(server, [device], { dnsName: "wirt.test" })).toBe(`$ORIGIN wirt.test
wirtbot IN AAAA 1001::1
test IN AAAA 1001::2`
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
        expect(generateDNSFile(server, devices, { dnsName: "wirt.test" })).toBe(`$ORIGIN wirt.test
wirtbot IN A 10.10.10.1
wirtbot IN AAAA 1001::1
test IN A 10.10.10.2
test IN AAAA 1001::2
test2 IN A 10.10.10.3
test2 IN AAAA 1001::3`
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
        expect(generateDNSFile(server, devices, { dnsName: "wirt.test" })).toBe(`$ORIGIN wirt.test
wirtbot IN A 10.10.10.1
wirtbot IN AAAA 1001::1
test IN A 10.10.10.2
test2 IN AAAA 1001::3`
        )


    })

})