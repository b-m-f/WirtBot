(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{446:function(e,t,o){"use strict";o.r(t);var n=o(56),a=Object(n.a)({},(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[o("h1",{attrs:{id:"setup"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#setup"}},[e._v("#")]),e._v(" Setup")]),e._v(" "),o("h2",{attrs:{id:"dependencies"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#dependencies"}},[e._v("#")]),e._v(" Dependencies")]),e._v(" "),o("p",[e._v("To set up a WirtBot you must first make sure that your machine has the following dependencies installed:")]),e._v(" "),o("ul",[o("li",[e._v("Linux Kernel > 5.6 or the WireGuard® Kernel Module")]),e._v(" "),o("li",[e._v("Docker")]),e._v(" "),o("li",[e._v("docker-compose")])]),e._v(" "),o("h2",{attrs:{id:"initial-setup"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#initial-setup"}},[e._v("#")]),e._v(" Initial setup")]),e._v(" "),o("p",[e._v("Here is an example "),o("code",[e._v("docker-compose.yml")]),e._v(" for a WirtBot with DNS and SSL enabled:")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v('version: "3.4"\n\nservices:\n  WirtBot:\n    image: bmff/wirtbot:latest\n    container_name: WirtBot\n    ports:\n      - 53:53\n      - 80:80\n      - 3030:3030\n      - 10101:10101/udp\n    restart: "unless-stopped"\n    cap_add:\n      - NET_ADMIN\n    sysctls:\n      - net.ipv6.conf.all.disable_ipv6=0\n    environment:\n      - "ALLOWED_ORIGIN=http://IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"\n    volumes:\n      - wireguard-data:/etc/wireguard\n      - coredns-data:/etc/coredns\nvolumes:\n  wireguard-data:\n  coredns-data:\n\n')])])]),o("p",[e._v('Copy this configuration into a file on the machine, update the "ALLOWED_ORIGIN" variable and run '),o("code",[e._v("docker-compose up -d")]),e._v(".\nDocker will now take care of downloading the WirtBot and CoreDNS containers and wiring them up.")]),e._v(" "),o("p",[e._v("You can check the progress with "),o("code",[e._v("docker logs -f WirtBot")]),e._v(".\nOnce the setup is finished you should see a message like this:")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("A new keypair for communication between Core and UI was generated\nPlease import the following text into your dashboard to take control of this WirtBot\n")])])]),o("p",[e._v("followed by a long string.")]),e._v(" "),o("p",[e._v("To take control of the WirtBot via your browser you can now reach the Interface at the IP address of your machine in the browser.\nSimple paste the above mentioned string into the input box that should be shown to you and click on the "),o("code",[e._v("Connect")]),e._v(" button.")]),e._v(" "),o("p",[e._v("The last thing to do is to set the "),o("strong",[e._v("Hostname/IP Address")]),e._v(" of the machine that WirtBot is running on "),o("strong",[e._v("as the API endpoint")]),e._v(". You can do this in the network part of the Dashboard.")]),e._v(" "),o("p",[e._v("Done. You are now in control of the WirtBot via your browser.")]),e._v(" "),o("h2",{attrs:{id:"setting-up-your-network"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#setting-up-your-network"}},[e._v("#")]),e._v(" Setting up your network")]),e._v(" "),o("p",[e._v("Now it is time to set up your network. Fill out the server section first, according to your needs. In the example configuration WireGuard will be listening at "),o("strong",[e._v("Port 10101")]),e._v(".")]),e._v(" "),o("p",[e._v("After adding the server you can go ahead and add as many devices as you want.")]),e._v(" "),o("p",[e._v("You should also take note of the "),o("strong",[e._v("Public Key")]),e._v(" that is shown to you in the "),o("strong",[e._v("Settings")]),e._v(" section of the Dasboard.\nIn order to stay in control of the WirtBot when it restarts you "),o("strong",[e._v("MUST")]),e._v(" tell it to keep trusting this Key.")]),e._v(" "),o("p",[e._v("Do this by adding it to the environment variables in the "),o("code",[e._v("docker-compose")]),e._v(" file like so:")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v('environment:\n  - "PUBLIC_KEY=your_public_key_from_the_settings_section"\n')])])]),o("p",[e._v("Run "),o("code",[e._v("docker-compose up -d")]),e._v(" again to start the WirtBot with the given public key.")]),e._v(" "),o("blockquote",[o("p",[e._v("Simply restarting the container is not enough! A new one needs to be started to consume the right environment variables")])]),e._v(" "),o("p",[e._v("Now that the network is established and the configuration persisted you might want to start closing down the Interface and WirtBot via Firewall rules.\nYou should also make a Backup via the UI and keep it in safe place.")]),e._v(" "),o("h2",{attrs:{id:"advanced"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#advanced"}},[e._v("#")]),e._v(" Advanced")]),e._v(" "),o("h3",{attrs:{id:"ssl-encryption"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#ssl-encryption"}},[e._v("#")]),e._v(" SSL encryption")]),e._v(" "),o("p",[e._v("In order to activate SSL for both the Core and Interface you can set the following environment variables:")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v('- "SSL_INTERFACE=true"\n- "SSL_CORE=true"\n\n')])])]),o("p",[e._v("When set you must ensure that the keys are mounted into the container in the correct locations.\nHere is an example:")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("- /etc/ssl/keys/public.key:/core/public_key\n- /etc/ssl/keys/private.key:/core/private_key\n- /etc/ssl/keys/public.key:/interface/public_key\n- /etc/ssl/keys/private.key:/interface/private_key\n")])])]),o("p",[e._v("The Keypair can be the same for the core and interface but must be mounted to different locations in the container. This is due to both core and interface running with different users and permissions.")]),e._v(" "),o("h3",{attrs:{id:"monitoring"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#monitoring"}},[e._v("#")]),e._v(" Monitoring")]),e._v(" "),o("p",[e._v("Endpoints for Prometheus metrics are enabled in the Container:")]),e._v(" "),o("ul",[o("li",[e._v("9153: CoreDNS metrics")]),e._v(" "),o("li",[e._v("9586: WireGuard metrics")])]),e._v(" "),o("p",[e._v("If your prometheus instance is connected into the network you can simply get them from the default WirtBot address at "),o("code",[e._v("10.10.0.1")]),e._v(" or "),o("code",[e._v("wirtbot.wirt.internal")]),e._v(".")]),e._v(" "),o("p",[e._v("You can also choose to expose them via the "),o("code",[e._v("docker-compose.yml")]),e._v(" file if you prefer. The Dockerfile specifies them as exposed ports.")]),e._v(" "),o("h3",{attrs:{id:"securing-the-wirtbot-after-setup"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#securing-the-wirtbot-after-setup"}},[e._v("#")]),e._v(" Securing the WirtBot after setup")]),e._v(" "),o("p",[e._v("In order to make the WirtBot interace and API hidden on the Host machine simply "),o("strong",[e._v("remove the port bindings")]),e._v(" for port "),o("strong",[e._v("80")]),e._v(" and "),o("strong",[e._v("3030")]),e._v(".")]),e._v(" "),o("p",[e._v("Both will still be reachable via the private network that was created with the WirtBot at "),o("code",[e._v("wirtbot.wirt.internal")]),e._v(".")]),e._v(" "),o("p",[e._v("In order to use the internal zone update")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v(' - "ALLOWED_ORIGIN=http://IP/HOSTNAME_OF_THE_WIRTBOT_HOST_MACHINE"\n')])])]),o("p",[e._v("to")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v(' - "ALLOWED_ORIGIN=wirtbot.wirt.internal"\n')])])]),o("p",[e._v("and "),o("strong",[e._v("change the API Endpoint")]),e._v(" the Dashboard to "),o("code",[e._v("wirtbot.wirt.internal")])]),e._v(" "),o("h3",{attrs:{id:"host-mode-for-more-speed"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#host-mode-for-more-speed"}},[e._v("#")]),e._v(" Host mode for more speed")]),e._v(" "),o("p",[e._v("In order to bypass a few network loops between the Host machine and the WirtBot container you can set")]),e._v(" "),o("div",{staticClass:"language- extra-class"},[o("pre",{pre:!0,attrs:{class:"language-text"}},[o("code",[e._v("network_mode: host\n")])])]),o("p",[e._v("in your "),o("code",[e._v("docker-compose.yml")]),e._v(" file. This will directly bind the Host ports to the container and in addition the WireGuard interface will be created directly on the host as well.")]),e._v(" "),o("p",[o("strong",[e._v("This also means that your host could talk to the network. But no routing is setup and this needs to be done manually if that is desired")])]),e._v(" "),o("h3",{attrs:{id:"mounting-the-configuration-files-to-the-host"}},[o("a",{staticClass:"header-anchor",attrs:{href:"#mounting-the-configuration-files-to-the-host"}},[e._v("#")]),e._v(" Mounting the configuration files to the host")]),e._v(" "),o("p",[e._v("For backup purposes you can mount the following files to your host:")]),e._v(" "),o("ul",[o("li",[e._v("WireGuard config: "),o("code",[e._v("/etc/wireguard/server.conf")])]),e._v(" "),o("li",[e._v("CoreDNS config: "),o("code",[e._v("/etc/coredns/Corefile")])])])])}),[],!1,null,null,null);t.default=a.exports}}]);