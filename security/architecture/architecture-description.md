\# NodeGoat Architecture Overview



\## Selected Application

OWASP NodeGoat — an intentionally vulnerable Node.js web application developed by OWASP to demonstrate the OWASP Top 10 in a modern Node.js context.



\## Technology Stack

\- \*\*Backend:\*\* Node.js 20 on Alpine Linux

\- \*\*Framework:\*\* Express 4

\- \*\*Templating:\*\* Swig

\- \*\*Session management:\*\* express-session (in-memory)

\- \*\*Database:\*\* MongoDB 4.4

\- \*\*Containerisation:\*\* Docker + Docker Compose

\- \*\*Outbound HTTP client:\*\* needle (for /research route)



\## Components



\### 1. Web Browser (User)

\- Standard modern browser

\- Communicates over HTTP on port 4000

\- \*\*Untrusted\*\* — all input must be validated server-side



\### 2. Application Container (nodegoat-web-1)

\- Runtime: Node.js 20 / Alpine Linux

\- Framework: Express 4

\- Routes:

&#x20; - `/login`, `/signup`, `/logout` — session management

&#x20; - `/dashboard` — user home

&#x20; - `/contributions` — pension contribution settings

&#x20; - `/allocations` — investment allocations

&#x20; - `/memos` — internal memo system

&#x20; - `/profile` — personal information

&#x20; - `/research` — stock market lookups

&#x20; - `/tutorial` — learning materials

\- Outbound HTTP client: `needle` (used by `/research`)



\### 3. Database Container (nodegoat-mongo-1)

\- MongoDB 4.4

\- Collections: `users`, `contributions`, `allocations`, `memos`, `counters`

\- Accessed via MongoDB wire protocol on port 27017

\- \*\*Not exposed\*\* to the host machine — private Docker network only



\### 4. External Service (finance.yahoo.com)

\- Third-party stock data provider

\- Called by `/research` route via HTTPS

\- Response is reflected into the user's browser



\## Data Flows

| From | To | Protocol | Port |

|---|---|---|---|

| Browser | Node.js app | HTTP | 4000 |

| Node.js app | MongoDB | MongoDB wire | 27017 |

| Node.js app | finance.yahoo.com | HTTPS | 443 |



\## Trust Boundaries

1\. \*\*Public Internet ↔ Application\*\* — untrusted user input crosses into the application

2\. \*\*Docker internal network\*\* — container-to-container traffic on private bridge

3\. \*\*Application ↔ External Services\*\* — outbound to third-party providers



\## Containerisation Approach

\- Single `docker-compose.yml` orchestrates both services

\- `docker compose up` starts the full stack

\- Only port 4000 exposed to the host machine; MongoDB port is internal only

\- Health-check via `nc -z -w 2 mongo 27017` ensures DB is ready before app starts

\- Database is auto-seeded on startup via `artifacts/db-reset.js`



\## Vulnerabilities Addressed

The following vulnerabilities were identified, exploited, and fixed during the project:



| # | Vulnerability | CWE | Location |

|---|---|---|---|

| 1 | Server-Side JS Injection | CWE-95 | `app/routes/contributions.js` |

| 2 | NoSQL Injection | CWE-943 | `app/data/allocations-dao.js` |

| 3 | Insecure Direct Object Reference | CWE-639 | `app/routes/allocations.js` |

| 4 | Server-Side Request Forgery | CWE-918 | `app/routes/research.js` |



See `security/vulnerability-evidence/` for full before/after evidence.

