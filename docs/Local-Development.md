# Barebones setup

`make -j2 dev`

This will spawn the Interface and server in their default configuration.
They are not set up to allow communication between each other, so that things such as the necessity to ensure proper key exchange between Core and Interface are not hidden.

# Preconfigured setup

`make -j2 dev-tests`

This will spawn a Core and Interface that are preconfigured with a keypair to ensure they can communicate.

Using this you can more easily write tests and also test ideas.
