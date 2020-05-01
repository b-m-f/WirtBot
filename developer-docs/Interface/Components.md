# Components

This document should be a guide on problems between components

## Coupled Child-Parent

If you look at the `DeviceTable` component you will see that it tightly couples the `DeviceRow`. This is okay, since they are meant to be used together, but also has a BIG requirement.

`DeviceRow` should never be used outside of `DeviceTable` and `DeviceTable` knows about the inner workings of `DeviceRow`. This becomes clear when you look at how they communicate.

The `DeviceRow` will `$emit` events that the `DeviceTable` listens for, which it then uses to trigger some of its own event emitters. It basically passes through the events.
To the outside it looks like the Table knows exactly when somethings changes and that is great. On the inside you have to be aware of this relation though.

It can allow for powerful component groups that have one component as the interface, but single parts should not be used anywhere else!
