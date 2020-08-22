use std::env;

const MANAGED_DNS_FEATURE_FLAG :&str = "MANAGED_DNS_ENABLED";
const MANAGED_DNS_DEVICE_FILE_VAR :&str = "MANAGED_DNS_DEVICE_FILE";
// CoreDNS is the DNS server that is being used
const DEFAULT_DEVICES_FILE :&str = "/etc/coredns/Corefile";

pub fn enabled() -> bool {
    match env::var(MANAGED_DNS_FEATURE_FLAG) {
        Ok(val) => match val.as_str() {
            "1" | "true" => {
                true
            }
            _ => false
        }
        _ => false
    }
}

pub fn get_device_file_path() -> String {
    return String::from(env::var(MANAGED_DNS_DEVICE_FILE_VAR).unwrap_or(DEFAULT_DEVICES_FILE.into()))
}

pub fn write_device_file(devices: String) -> std::io::Result<()> {
    return std::fs::write(get_device_file_path(), devices.as_bytes())
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_enabled() {
        env::set_var(MANAGED_DNS_FEATURE_FLAG, "true");
        assert!(enabled());
        env::set_var(MANAGED_DNS_FEATURE_FLAG, "1");
        assert!(enabled())
    }

    #[test]
    #[should_panic]
    fn test_disabled() {
        assert!(enabled());
        env::set_var(MANAGED_DNS_FEATURE_FLAG, "everything besides 'true' and '1' is false");
        assert!(enabled())
    }

    #[test]
    fn test_write_devices_replaces_previous_content() {
        env::set_var(MANAGED_DNS_DEVICE_FILE_VAR, "./device_file");
        std::fs::write(get_device_file_path(), b"content to be replaced");
        write_device_file(String::from("new content"));
        let file_content = std::fs::read_to_string(get_device_file_path());
        assert_eq!(file_content.unwrap(), "new content");
        std::fs::remove_file(get_device_file_path());
    }
}