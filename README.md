# spotify_utils

### Local Development (HTTPS) - Recommended Setup

To ensure seamless HTTPS support across various browsers during local development, it's recommended to install `certutil` in addition to `mkcert`.

1. **Install `mkcert`:** Follow the instructions for your operating system at [mkcert.dev](https://mkcert.dev/).
2. **Install Local CA:** After installing `mkcert`, run `mkcert -install` to install the local Certificate Authority. This step is crucial for browser trust.
3. **Install `certutil` (for broader browser compatibility - Linux):**
   * On Debian/Ubuntu-based Linux, run: `sudo apt install libnss3-tools`
   * For other Linux distributions, find the appropriate package for `certutil` (usually part of `nss-tools` or `libnss3-tools`) using your package manager (e.g., `yum`, `pacman`, `dnf`).
   * After installing `certutil`, re-run `mkcert -install` to ensure Firefox and Chromium also trust the local CA.
4. **Create `cert` Directory:** In the project root, create a directory named `cert`.
5. **Generate Certificates:** In the project root, run `mkcert -cert-file cert/localhost.pem -key-file cert/localhost-key.pem localhost` to generate `localhost.pem` and `localhost-key.pem` files inside the `cert` directory.