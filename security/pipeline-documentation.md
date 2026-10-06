\# CI/CD Security Pipeline Documentation



\## Overview

The DevSecOps Security Pipeline runs on every push to `master`, `secure`, or

`fix/\*\*` branches. It consists of 5 jobs, 4 of which are security gates.



\## Jobs



\### 1. Build and Test

\- Installs dependencies with Node.js 20

\- Runs `npm test` if tests exist

\- Blocks the pipeline if the build fails



\### 2. SAST (Semgrep)

\- Runs Semgrep with custom rules defined in `.semgrep/rules.yml`

\- Catches:

&#x20; - SSJS Injection (`eval` with user input) — CWE-95

&#x20; - NoSQL Injection (`$where` string interpolation) — CWE-943

&#x20; - IDOR (`req.params.userId`) — CWE-639

&#x20; - SSRF (unvalidated `req.query.url`) — CWE-918

\- \*\*Strict:\*\* fails the build on any finding



\### 3. Dependency Scan (npm audit)

\- Scans NodeGoat's production dependencies

\- \*\*Report-only:\*\* prints findings but does not fail the build

\- \*\*Rationale:\*\* NodeGoat is an intentionally vulnerable application.

&#x20; Its production dependencies inherit CVEs that cannot be remediated

&#x20; without rewriting core modules (express 4.x, mongodb 2.x, marked 0.3.5).



\### 4. Secrets Scan (Gitleaks)

\- Scans full git history for hardcoded secrets, API keys, tokens

\- \*\*Strict:\*\* fails the build if any secrets are detected in any commit



\### 5. Container Scan (Trivy)

\- Builds the Docker image and scans for CRITICAL library vulnerabilities

\- Uses `ignore-unfixed: true` to skip CVEs without upstream fixes

\- \*\*Strict:\*\* fails the build on any CRITICAL finding



\## Failing Gate Evidence

Run #9 (commit acb7d4a) demonstrates the Trivy gate failing on real

CRITICAL CVEs in NodeGoat's dependencies. This satisfies the assignment's

requirement that at least one gate genuinely fails the pipeline on a real

issue above the agreed severity threshold.



\## Deliberate Failure Test

The SAST gate was verified to block a deliberately reintroduced IDOR

vulnerability (branch `fix/sast-demo`, now deleted). Screenshot:

`security/pipeline-evidence/pipeline-failure-sast-full.png`



\## Secrets Management

COOKIE\_SECRET and CRYPTO\_KEY are injected from GitHub Actions encrypted

secrets. See `security/secrets-management.md` for details.

