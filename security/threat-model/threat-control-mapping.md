# Threat-to-Control Mapping — OWASP NodeGoat



This document maps each identified threat to the security control that

mitigates it, and to the specific location in the codebase or pipeline

where the control lives.



---



## Mapping Table



| # | Threat | Control | Location | Type |

|---|---|---|---|---|

| 1 | SSJS Injection | Replace `eval()` with `parseInt()` | `app/routes/contributions.js` line 32 | Preventive |

| 2 | NoSQL Injection | Type-coerce `threshold` to integer; range check 0–99 | `app/data/allocations-dao.js` line 71 | Preventive |

| 3 | IDOR | Read `userId` from session, not URL | `app/routes/allocations.js` line 14 | Preventive |

| 4 | SSRF | Validate `url` against allowlist of permitted hosts | `app/routes/research.js` line 14 | Preventive |

| 5 | Weak Session Secret | Load `cookieSecret` from environment variable | `config/env/all.js` line 6 | Preventive |

| 6 | DoS via `$where` | Same as Threat 2 (removes `$where` from user input path) | `app/data/allocations-dao.js` line 71 | Preventive |



---



## Detailed Mapping



### Threat 1 — SSJS Injection → `parseInt()`



**Control:** Replace `eval(req.body.preTax)` with `parseInt(req.body.preTax, 10)`.

`parseInt()` will not evaluate expressions — it returns the leading integer

of the input (e.g. `2+3` returns `2`, not `5`) or `NaN` if the input is not

numeric.



**Where:** `app/routes/contributions.js` lines 32–34.



**Verified by:** Manual exploit re-attempt (`2+3` saves 2% after fix) and

Semgrep rule `ssjs-eval-usage`.



---



### Threat 2 — NoSQL Injection → `parseInt` + range check



**Control:** Replace the string-interpolated `$where` clause with a parsed

integer and a 0–99 range check. Non-numeric or out-of-range values throw an

error before reaching MongoDB.



**Where:** `app/data/allocations-dao.js` lines 71–77.



**Verified by:** Manual exploit re-attempt (payload returns error) and

custom Semgrep rule `nosql-injection-where-interpolation`.



---



### Threat 3 — IDOR → `req.session.userId`



**Control:** Replace `req.params.userId` with `req.session.userId`. The

session value is server-side and cannot be manipulated by the user.



**Where:** `app/routes/allocations.js` line 14.



**Verified by:** Manual exploit re-attempt (`/allocations/1` now returns

the logged-in user's data) and custom Semgrep rule

`idor-userid-from-params`.



---



### Threat 4 — SSRF → URL allowlist



**Control:** Parse the user-supplied URL with `new URL()`, then verify the

hostname against an allowlist (`["finance.yahoo.com"]`). Reject anything

else with a 400 response. Also `encodeURIComponent` the `symbol` parameter

to prevent injection into the query string.



**Where:** `app/routes/research.js` lines 14–32.



**Verified by:** Manual exploit re-attempt (internal and metadata URLs

return "URL not permitted") and custom Semgrep rule

`ssrf-user-controlled-url`.



---



### Threat 5 — Weak Session Secret → Environment variable



**Control:** Load `cookieSecret` and `cryptoKey` from `process.env` rather

than from hardcoded strings. Values are supplied at runtime via GitHub

Actions encrypted secrets (production/CI) or fallback placeholder values

(local development only).



**Where:** `config/env/all.js` lines 6–7.



**Verified by:** Gitleaks scan in the CI pipeline — no secrets are detected

in the repository history.



---



### Threat 6 — DoS via `$where` → Same as Threat 2



**Control:** Because the `$where` clause no longer receives user input, the

`while(true){}` payload that would block MongoDB is unreachable.



**Where:** `app/data/allocations-dao.js` lines 71–77.



**Verified by:** Manual test — payload returns an error rather than

triggering an infinite loop.



---



## Pipeline-Level Controls



Beyond the code fixes above, the CI/CD pipeline adds the following

automated controls:



| Control | Pipeline Job | Where |

|---|---|---|

| Custom SAST rules | `sast` | `.semgrep/rules.yml` |

| Dependency vulnerability scan | `dependency-scan` | `.github/workflows/security-pipeline.yml` |

| Secret detection | `secrets-scan` | `.github/workflows/security-pipeline.yml` |

| Container image CVEs | `container-scan` | `.github/workflows/security-pipeline.yml` |



---



## Residual Risk



After the fixes:



| # | Threat | Residual risk | Reason |

|---|---|---|---|

| 1 | SSJS Injection | **Low** | `eval()` removed, pattern scanned in CI |

| 2 | NoSQL Injection | **Low** | `parseInt` enforced, pattern scanned in CI |

| 3 | IDOR | **Low** | Session-based access control, pattern scanned in CI |

| 4 | SSRF | **Low** | Allowlist enforced, pattern scanned in CI |

| 5 | Weak Session Secret | **Low** | Environment variables, GitLeaks scans |

| 6 | DoS via `$where` | **Low** | Fixed alongside Threat 2 |



**No High or Critical residual risks remain.**
