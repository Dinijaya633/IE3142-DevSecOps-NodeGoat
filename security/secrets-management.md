\# Secrets Management



\## Overview

NodeGoat's default configuration had two hardcoded secrets in `config/env/all.js`:

\- `cookieSecret` (used for express-session)

\- `cryptoKey` (used for profile crypto)



Both have been moved to environment variables supplied at runtime.



\## Local Development

For local development with `docker compose`, the app falls back to a

non-sensitive placeholder value. This allows the app to run without requiring

developers to set secrets.



\## Production / CI

For CI/CD and production deployments:

\- Secrets are stored in \*\*GitHub Actions encrypted secrets\*\* (`COOKIE\_SECRET`, `CRYPTO\_KEY`)

\- The pipeline injects them via `${{ secrets.COOKIE\_SECRET }}` at workflow runtime

\- Container images never contain the actual secrets

\- `.env` files are gitignored and never committed



\## Verification

To verify no secrets are committed:

```bash

git log --all -p | grep -i "secret\\|password" | grep -v "process.env"

