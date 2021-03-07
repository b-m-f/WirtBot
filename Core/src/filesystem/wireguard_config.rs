use std::fs::OpenOptions;
use std::io::prelude::*;
use std::io::Result as IOResult;

pub fn write_config_file(config: String, path: String) -> IOResult<()> {
    match OpenOptions::new()
        .read(true)
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
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
