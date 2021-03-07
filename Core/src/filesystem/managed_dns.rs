pub fn write_device_file(devices: String, path: String) -> std::io::Result<()> {
    return std::fs::write(path, devices.as_bytes());
}
