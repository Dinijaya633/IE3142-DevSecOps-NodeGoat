# STRIDE Threat Model — OWASP NodeGoat



## Methodology

STRIDE is a threat-modelling framework developed by Microsoft. Each letter

represents a category of security threat:



| Letter | Threat | Description |
|---|---|---|
| S | Spoofing | Pretending to be someone else |
| T | Tampering | Modifying data or code |
| R | Repudiation | Denying an action took place |
| I | Information Disclosure | Exposing information to unauthorised parties |
| D | Denial of Service | Making the system unavailable |
| E | Elevation of Privilege | Gaining higher permissions |



Each threat below is mapped to a specific component of the NodeGoat

architecture and to one of the four identified vulnerabilities.



---



## Threat 1 — SSJS Injection via `eval()` (Contributions)



**STRIDE category:** Tampering / Elevation of Privilege

**CWE:** CWE-95 (Improper Neutralization of Directives in Dynamically Evaluated Code)

**OWASP Top 10:** A03:2021 — Injection

**Affected component:** Node.js application (`nodegoat-web-1`)

**Vulnerable code:** `app/routes/contributions.js` line 32



### Attack scenario

An authenticated user submits a contribution value such as `2+3` into the

Pre-Tax field. The server evaluates the input using `eval()` and stores the

result (5) instead of the literal value. A malicious payload like

`process.exit()` could crash the server; a payload like

`require('child_process').execSync('...')` could achieve remote code execution.



### Impact

- Arbitrary JavaScript execution in the server process

- Potential remote code execution

- Full compromise of the application container



### Likelihood

**High (3)** — any authenticated user can reach the endpoint; the attack is

trivial to perform via the browser's developer tools.



### Impact rating

**High (3)** — full server compromise is possible.



---



## Threat 2 — NoSQL Injection in Allocations Threshold



**STRIDE category:** Information Disclosure / Tampering

**CWE:** CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)

**OWASP Top 10:** A03:2021 — Injection

**Affected component:** Node.js app → MongoDB (`nodegoat-web-1` → `nodegoat-mongo-1`)

**Vulnerable code:** `app/data/allocations-dao.js` line 78



### Attack scenario

The allocations route builds a MongoDB `$where` clause by interpolating the

user-supplied `threshold` parameter directly. An attacker submits

`1'; return 1=='1` as the threshold, which causes the query to return all

allocations for all users — a data leak of every user's financial data.



### Impact

- Disclosure of other users' pension allocations

- Potential tampering if the query were used with `$update`



### Likelihood

**High (3)** — the parameter is exposed in the URL, easy to manipulate.



### Impact rating

**High (3)** — sensitive financial data of all users is exposed.



---



## Threat 3 — Insecure Direct Object Reference (IDOR) in Allocations



**STRIDE category:** Spoofing / Elevation of Privilege

**CWE:** CWE-639 (Authorization Bypass Through User-Controlled Key)

**OWASP Top 10:** A01:2021 — Broken Access Control

**Affected component:** Node.js application (`nodegoat-web-1`)

**Vulnerable code:** `app/routes/allocations.js` line 16



### Attack scenario

The allocations route reads the `userId` from the URL parameter instead of

the session. An attacker authenticated as `user1` can navigate to

`/allocations/1` and view the administrator's allocations, or `/allocations/3`

to view another user's data.



### Impact

- Unauthorised access to other users' financial data

- Complete bypass of access-control checks



### Likelihood

**High (3)** — URL manipulation is trivial.



### Impact rating

**Medium (2)** — read-only leak (at present); severity would rise if write

operations used the same pattern.



---



## Threat 4 — Server-Side Request Forgery (SSRF) in Research



**STRIDE category:** Information Disclosure / Tampering

**CWE:** CWE-918 (Server-Side Request Forgery)

**OWASP Top 10:** A10:2021 — Server-Side Request Forgery

**Affected component:** Node.js app → external services

**Vulnerable code:** `app/routes/research.js` line 14



### Attack scenario

The `/research` route concatenates the user-supplied `url` parameter with

the `symbol` parameter and fetches the resulting URL using the `needle`

HTTP client. An attacker supplies a URL pointing to internal services

(e.g. `http://localhost:4000/login`) or to cloud metadata endpoints

(e.g. `http://169.254.169.254/latest/meta-data/iam/security-credentials/`)

to exfiltrate internal data or cloud credentials.



### Impact

- Access to internal-only services

- Retrieval of cloud IAM credentials (in AWS environments)

- Potential pivot to other network segments



### Likelihood

**Medium (2)** — requires the attacker to understand URL structure; easy

once known.



### Impact rating

**High (3)** — in cloud deployments this leads to credential theft

(as demonstrated by the 2019 Capital One breach).



---



## Threat 5 — Broken Authentication via Weak Session Secret



**STRIDE category:** Spoofing

**CWE:** CWE-798 (Use of Hard-coded Credentials)

**OWASP Top 10:** A02:2021 — Cryptographic Failures / A07:2021 — Identification and Authentication Failures

**Affected component:** Node.js application

**Vulnerable code:** `config/env/all.js` (`cookieSecret`)



### Attack scenario

The session cookie is signed with a hardcoded secret that is visible in the

public repository. An attacker can forge a valid session cookie for any user,

including the administrator, bypassing authentication entirely.



### Impact

- Full account takeover

- Administrative access



### Likelihood

**Medium (2)** — the secret is public, but the attacker still needs to

construct a valid session token.



### Impact rating

**High (3)** — full authentication bypass.



---



## Threat 6 — Denial of Service via Blocking `$where` Query



**STRIDE category:** Denial of Service

**CWE:** CWE-400 (Uncontrolled Resource Consumption)

**Affected component:** MongoDB (`nodegoat-mongo-1`)

**Vulnerable code:** `app/data/allocations-dao.js` line 78



### Attack scenario

Because the `$where` clause is JavaScript executed inside MongoDB, an

attacker can supply a blocking payload such as

`0'; while(true){}` which causes the MongoDB server to consume 100% CPU

and stop responding to all queries.



### Impact

- Complete denial of service for the entire application

- Requires restart of the MongoDB container



### Likelihood

**Medium (2)** — the payload is documented in the NodeGoat source comments.



### Impact rating

**High (3)** — a single request can take the whole application down.



---



## Summary Table



| # | Threat | STRIDE | CWE | Likelihood | Impact |
|---|---|---|---|---|---|
| 1 | SSJS Injection | T / E | CWE-95 | High | High |
| 2 | NoSQL Injection | I / T | CWE-943 | High | High |
| 3 | IDOR | S / E | CWE-639 | High | Medium |
| 4 | SSRF | I / T | CWE-918 | Medium | High |
| 5 | Weak Session Secret | S | CWE-798 | Medium | High |
| 6 | DoS via `$where` | D | CWE-400 | Medium | High |



*All threats are realistic for the NodeGoat architecture and correspond to

vulnerabilities that were demonstrated and fixed during this project.*
