use std::io::Result as IOResult;
use std::io::prelude::*;
use std::fs::OpenOptions;
use std::env;

const CONFIG_PATH :&str = "MANAGED_DNS_ENABLED";
const DEFAULT_CONFIG_PATH :&str = "/etc/wireguard/server.conf";

pub fn write_config_file(config: String) -> IOResult<()> {
    let file_name: String = env::var(CONFIG_PATH).unwrap_or(DEFAULT_CONFIG_PATH.into());

    match OpenOptions::new()
        .read(true)
        .write(true)
        .truncate(true)
        .create(true)
        .open(file_name)
    {
        Ok(mut file) => {
            file.write_all(config.as_bytes())?;
            return Ok(());
        }
        Err(e) => {
            return Err(e);
        }
    }
}