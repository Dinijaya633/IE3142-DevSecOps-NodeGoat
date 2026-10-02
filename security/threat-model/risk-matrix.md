# Risk Assessment Matrix — OWASP NodeGoat



## Methodology

Each threat is scored using a 3×3 Likelihood × Impact matrix.



- **Likelihood:** 1 = Low, 2 = Medium, 3 = High

- **Impact:** 1 = Low, 2 = Medium, 3 = High

- **Risk Score = Likelihood × Impact**



| Risk Score | Rating | Action required |
|---|---|---|
| 1–2 | Low | Monitor |
| 3–4 | Medium | Mitigate in next release |
| 6 | High | Mitigate before release |
| 9 | Critical | Mitigate immediately |



---



## Risk Matrix

| Likelihood / Impact | Low (1) | Medium (2) | High (3) |
|---|---:|---:|---:|
| High (3) | 3 Medium | 6 High | 9 Critical |
| Medium (2) | 2 Low | 4 Medium | 6 High |
| Low (1) | 1 Low | 2 Low | 3 Medium |

---



## Scoring Table



| # | Threat | Likelihood | Impact | Risk Score | Rating |
|---|---|---|---|---|---|
| 1 | SSJS Injection | 3 | 3 | **9** | **Critical** |
| 2 | NoSQL Injection | 3 | 3 | **9** | **Critical** |
| 3 | IDOR | 3 | 2 | **6** | **High** |
| 4 | SSRF | 2 | 3 | **6** | **High** |
| 5 | Weak Session Secret | 2 | 3 | **6** | **High** |
| 6 | DoS via `$where` | 2 | 3 | **6** | **High** |



---



## Justification for each rating



### Threat 1 — SSJS Injection

- **Likelihood: 3** — any authenticated user can submit the payload via the

&#x20; Contributions page. No specialised tools required.

- **Impact: 3** — `eval()` in a Node.js process allows arbitrary code

&#x20; execution, including filesystem access and outbound network calls.



### Threat 2 — NoSQL Injection

- **Likelihood: 3** — the `threshold` parameter is in the URL and can be

&#x20; changed with a single browser click.

- **Impact: 3** — full disclosure of all users' pension allocations; the

&#x20; `$where` operator also enables DoS.



### Threat 3 — IDOR

- **Likelihood: 3** — changing a number in a URL requires no skill.

- **Impact: 2** — read-only leak of another user's allocation data. Would

&#x20; become High if write operations were exposed.



### Threat 4 — SSRF

- **Likelihood: 2** — the attacker must know the URL structure, but the

&#x20; `url` parameter is straightforward to manipulate.

- **Impact: 3** — in cloud environments, SSRF leads to IAM credential

&#x20; theft and complete account compromise (Capital One, 2019).



### Threat 5 — Weak Session Secret

- **Likelihood: 2** — the secret is public on GitHub, but the attacker

&#x20; needs to construct a forged session token.

- **Impact: 3** — complete authentication bypass.



### Threat 6 — DoS via `$where`

- **Likelihood: 2** — payloads are documented in NodeGoat's source comments.

- **Impact: 3** — a single request can crash the entire database.



---



## Recommended Remediation Priority



Based on risk scores, remediation should follow this order:



1. **Critical (score 9):** Threats 1, 2 — fix immediately

2. **High (score 6):** Threats 3, 4, 5, 6 — fix in this release



All six were addressed during this project (see `threat-control-mapping.md`).
