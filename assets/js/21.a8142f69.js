(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{438:function(e,t,a){"use strict";a.r(t);var n=a(56),o=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"update-4-v2-of-the-wirtbot-lost-some-weight"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#update-4-v2-of-the-wirtbot-lost-some-weight"}},[e._v("#")]),e._v(" Update 4: V2 of the WirtBot lost some weight")]),e._v(" "),a("p",[e._v("After using the WirtBot for a while I noticed the cruft I loaded onto myself.")]),e._v(" "),a("p",[e._v("Maintaining the WirtBot + ansible scripts etc. while already having it containerized and the audience, despite my attempts to make it simple to use, being highly technical nonetheless just made no sense.")]),e._v(" "),a("p",[e._v("If you use this tech you probably already have a pretty good grasp of Linux and networks.")]),e._v(" "),a("p",[e._v("So "),a("strong",[e._v("the installer is removed")]),e._v(" and you can integrate the Docker container on your machines even easier.")]),e._v(" "),a("h2",{attrs:{id:"new-setup-flow"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#new-setup-flow"}},[e._v("#")]),e._v(" New setup flow")]),e._v(" "),a("p",[e._v("When running the WirtBot container for the first time, meaning that you probably do not have a public key for your interface yet, it will automatically generate a keypair for you.")]),e._v(" "),a("p",[e._v("This is printed into the logs and can be used to take control of the interface.\nMeaning that the setup is still as secure as possible, while staying straigt forward.")]),e._v(" "),a("p",[e._v("Accompanying the changes on the server is a new page on the Interface to help importing the keys.\nIf you happen to have a backup and started the WirtBot with a public key already in its environment you can of course simply skip this.")]),e._v(" "),a("h2",{attrs:{id:"other-changes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#other-changes"}},[e._v("#")]),e._v(" Other changes")]),e._v(" "),a("h3",{attrs:{id:"updated-dependencies"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#updated-dependencies"}},[e._v("#")]),e._v(" updated dependencies")]),e._v(" "),a("p",[e._v("With "),a("a",{attrs:{href:"https://tokio.rs/",target:"_blank",rel:"noopener noreferrer"}},[e._v("tokio"),a("OutboundLink")],1),e._v(" hitting "),a("strong",[e._v("1.0")]),e._v(" and "),a("a",{attrs:{href:"https://docs.rs/warp/0.3.0/warp/",target:"_blank",rel:"noopener noreferrer"}},[e._v("warp"),a("OutboundLink")],1),e._v(" integrating it both have been updated to the latest versions.")]),e._v(" "),a("h3",{attrs:{id:"bug-fixes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#bug-fixes"}},[e._v("#")]),e._v(" Bug fixes")]),e._v(" "),a("p",[e._v("There was a bug when importing backups.\nIn order to understand it you must know how the backup process actually works:")]),e._v(" "),a("ul",[a("li",[e._v("read backup")]),e._v(" "),a("li",[e._v("do some automatic upgrading depending on backup version")]),e._v(" "),a("li",[e._v("remove all server configuration from the state")]),e._v(" "),a("li",[e._v("remove all device configs from the state")]),e._v(" "),a("li",[e._v("add the server from the backup via normal state dispatching")]),e._v(" "),a("li",[e._v("add all devices 1 by 1 using the normal state dispatching")])]),e._v(" "),a("p",[e._v("The bug was hiding in the device adding part. As new devices were assumed to not have keys when I originally wrote the function, this function would generate them every time.\nThis in turn means that the server would not recognize the devices anymore as their keys seemed to have updated and you got locked out of the WirtBot.")]),e._v(" "),a("p",[e._v("Making sure that keys are only regenerated when needed took care of this issue.")]),e._v(" "),a("h3",{attrs:{id:"better-feedback"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#better-feedback"}},[e._v("#")]),e._v(" Better feedback")]),e._v(" "),a("p",[e._v("Alerts have been added to show up when the configuration on the WirtBot has been updated successfully or failed for some reason.")]),e._v(" "),a("h3",{attrs:{id:"relative-routing"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#relative-routing"}},[e._v("#")]),e._v(" Relative Routing")]),e._v(" "),a("p",[e._v("To properly function behind any kind of proxy you might want to use for the interface the routing mode is now set to relative routing.")]),e._v(" "),a("p",[e._v("This should make it possible to proxy to and from the Interface without problems.")]),e._v(" "),a("h3",{attrs:{id:"custom-api-endpoint"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#custom-api-endpoint"}},[e._v("#")]),e._v(" Custom API Endpoint")]),e._v(" "),a("p",[e._v("Since the ansible script and automatic network creation on install are gone it is necessary to be able to specify where updates should be send.")]),e._v(" "),a("p",[e._v("The interface now has an option to specify the hostname/IP of the WirtBot.")]),e._v(" "),a("h3",{attrs:{id:"multiarch"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#multiarch"}},[e._v("#")]),e._v(" Multiarch")]),e._v(" "),a("p",[e._v("WirtBot can now run on both AMD64 and ARM64.")]),e._v(" "),a("p",[e._v("Unfortunately this makes the build-pipeline quite slow, but hey atleast you can now run the WirtBot on ARM devices if you want.")]),e._v(" "),a("h2",{attrs:{id:"end"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#end"}},[e._v("#")]),e._v(" End")]),e._v(" "),a("p",[e._v("Thats it. Well except for the updated setup documentation that is.")]),e._v(" "),a("p",[e._v("And what is next, now that there is less to take care of?")]),e._v(" "),a("p",[e._v("I am thinking of Metrics, but it might take another couple of months.")]),e._v(" "),a("p",[e._v("Til then, happy hacking.")])])}),[],!1,null,null,null);t.default=o.exports}}]);