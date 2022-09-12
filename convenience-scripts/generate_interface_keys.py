#! /usr/bin/python

import base64
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import NoEncryption
from cryptography.hazmat.primitives.serialization import Encoding
from cryptography.hazmat.primitives.serialization import PrivateFormat
from cryptography.hazmat.primitives.serialization import PublicFormat


private_key = Ed25519PrivateKey.generate()
priv_key = base64.b64encode(bytes(private_key.private_bytes(Encoding.Raw, PrivateFormat.Raw, NoEncryption()))).decode('utf-8')

public_key = private_key.public_key()
pub_key = base64.b64encode(bytes(public_key.public_bytes(Encoding.Raw, PublicFormat.Raw))).decode('utf-8')


print("Private:" + priv_key)

print("Public:" + pub_key)
