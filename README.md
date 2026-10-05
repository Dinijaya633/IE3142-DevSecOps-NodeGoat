# IE3142 — DevSecOps Pipeline Group Project

**Module:** IE3142 — DevOps Security
**Assignment:** Building and Securing a DevSecOps Pipeline
**Application:** OWASP NodeGoat
**Technology:** Node.js / Express / MongoDB
**Deadline:** 1 October 2026

[![DevSecOps Security Pipeline](https://github.com/Dinijaya633/IE3142-DevSecOps-NodeGoat/actions/workflows/security-pipeline.yml/badge.svg)](https://github.com/Dinijaya633/IE3142-DevSecOps-NodeGoat/actions/workflows/security-pipeline.yml)

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Project Objectives](#-project-objectives)
* [Group Members](#-group-members)
* [Application](#-application)
* [Technology Stack](#-technology-stack)
* [Architecture](#-architecture)
* [Quick Start](#-quick-start)
* [Repository Structure](#-repository-structure)
* [Vulnerabilities Identified and Fixed](#-vulnerabilities-identified-and-fixed)
* [CI/CD Pipeline](#-cicd-pipeline)
* [Security Tooling](#-security-tooling)
* [Secret Management](#-secret-management)
* [Branch Strategy](#-branch-strategy)
* [Documentation](#-documentation)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🎯 Overview

This project demonstrates the implementation of a **DevSecOps pipeline** around **OWASP NodeGoat**, an intentionally vulnerable Node.js web application developed by OWASP for security education and secure coding practice.

The project integrates security throughout the software development lifecycle rather than treating security as a final testing stage.

The main activities include:

1. **Containerising** the NodeGoat application using Docker and Docker Compose.
2. **Designing and documenting** the application architecture.
3. **Threat modelling** the application using the STRIDE methodology.
4. **Identifying and exploiting** real application vulnerabilities.
5. **Implementing secure fixes** for the identified vulnerabilities.
6. **Verifying the fixes** using the same or equivalent security tests.
7. **Automating security checks** through GitHub Actions.
8. **Managing sensitive configuration** using GitHub Actions encrypted secrets.
9. **Integrating security into CI/CD** so that security testing becomes part of the development workflow.

The project demonstrates the core DevSecOps principle:

> **Build → Test → Secure → Deploy → Monitor**

---

# 🎯 Project Objectives

The main objectives of this project are to:

* Understand the principles of DevSecOps.
* Deploy an intentionally vulnerable application in a controlled environment.
* Identify common web application vulnerabilities.
* Demonstrate how vulnerabilities can be exploited.
* Apply secure coding practices to remediate vulnerabilities.
* Use automated security testing tools.
* Integrate security tools into a GitHub Actions CI/CD pipeline.
* Apply threat modelling using STRIDE.
* Demonstrate secure containerisation.
* Manage secrets securely within the CI/CD environment.
* Provide before-and-after evidence of security improvements.

---

# 👥 Group Members

| Member | Student ID | GitHub | Primary Area |
|---|---|---|---|
| Member 1 | IT24101931 | [@Dinijaya633](https://github.com/Dinijaya633) | Application, Architecture & Docker |
| Member 2 | IT24100751 | [@IT24100751](https://github.com/IT24100751) | Threat Modelling & Risk Assessment |
| Member 3 | IT24101569 | [@hashen16](https://github.com/hashen16) | Vulnerability Assessment & Secure Coding |
| Member 4 | IT24101664 | [@IT24101569](https://github.com/IT24101569) | CI/CD & DevSecOps Automation |         |



---

# 🖥️ Application

## OWASP NodeGoat

**NodeGoat** is an intentionally vulnerable Node.js web application maintained by OWASP.

It is designed as a practical learning environment for understanding common web application security vulnerabilities and the **OWASP Top 10**.

In this project, NodeGoat is used as the target application for:

* Vulnerability assessment
* Exploitation
* Secure coding
* Threat modelling
* Container security
* Automated security testing
* DevSecOps pipeline integration

---

# 🧰 Technology Stack

| Layer                   | Technology      |
| ----------------------- | --------------- |
| Runtime                 | Node.js 20      |
| Base Image              | Alpine Linux    |
| Web Framework           | Express 4       |
| Templating Engine       | Swig            |
| Session Management      | express-session |
| Database                | MongoDB 4.4     |
| HTTP Client             | needle          |
| Containerisation        | Docker          |
| Container Orchestration | Docker Compose  |
| CI/CD                   | GitHub Actions  |
| Version Control         | Git / GitHub    |
| Language                | JavaScript      |
| Threat Modelling        | STRIDE          |

---

# 🔐 Default User Accounts

The application includes the following test accounts for the controlled lab environment:

| Role          | Username | Password    |
| ------------- | -------- | ----------- |
| Administrator | `admin`  | `Admin_123` |
| User          | `user1`  | `User1_123` |
| User          | `user2`  | `User2_123` |

> ⚠️ **Security Notice:** These credentials are provided only for the intentionally vulnerable local testing environment. They must not be reused in production systems.

---

# 🏛️ Architecture

The NodeGoat application is deployed using **Docker Compose**.

The environment consists primarily of two containers:

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │      / Tester       │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │     NodeGoat        │
                    │   Node.js/Express   │
                    │      Container      │
                    └──────────┬──────────┘
                               │
                               │ MongoDB
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      Container      │
                    └─────────────────────┘

                         Docker Network
```

The application and database communicate through a Docker network rather than requiring the MongoDB service to be directly exposed to the host.

Detailed architecture documentation is available at:

`security/architecture/architecture-description.md`

---

# 🚀 Quick Start

## Prerequisites

Install the following software before running the project:

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* Git
* Windows, macOS, or Linux

Docker Desktop should be running before starting the application.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Dinijaya633/IE3142-DevSecOps-NodeGoat.git
```

Move into the project directory:

```bash
cd IE3142-DevSecOps-NodeGoat
```

---

## 2. Build and Start the Application

Run:

```bash
docker compose up --build
```

The `--build` option ensures that the Docker images are rebuilt using the current project files.

---

## 3. Run in Detached Mode

Alternatively, run the application in the background:

```bash
docker compose up --build -d
```

---

## 4. Check Running Containers

Use:

```bash
docker compose ps
```

You should see the NodeGoat application and MongoDB containers running.

You can also use:

```bash
docker ps
```

---

## 5. Access the Application

Once the containers are running, open the application in a browser using the configured application port.

For example:

```text
http://localhost:4000
```

> The exact port depends on the project's `docker-compose.yml` configuration.

---

## 6. Stop the Application

To stop the containers:

```bash
docker compose down
```

To stop the containers and remove associated volumes:

```bash
docker compose down -v
```

> Use `-v` carefully because it removes persistent database volumes and therefore resets stored application data.

---

# 📁 Repository Structure

The repository is organised to separate application code, security testing, documentation, and CI/CD configuration.

```text
IE3142-DevSecOps-NodeGoat/
│
├── .github/
│   └── workflows/
│       └── security-pipeline.yml
│
├── security/
│   ├── architecture/
│   │   └── architecture-description.md
│   │
│   ├── threat-model/
│   │   └── ...
│   │
│   ├── vulnerabilities/
│   │   └── ...
│   │
│   └── reports/
│       └── ...
│
├── public/
│
├── routes/
│
├── views/
│
├── models/
│
├── test/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

> The exact directory structure may vary depending on the current NodeGoat source tree.

---

# 🐛 Vulnerabilities Identified and Fixed

As part of the project, four real application vulnerabilities were selected for investigation.

For each vulnerability, the project follows the same security workflow:

```text
Identify
   ↓
Analyse
   ↓
Exploit
   ↓
Collect Evidence
   ↓
Implement Fix
   ↓
Re-test
   ↓
Verify Fix
```

Each vulnerability is documented with:

* Vulnerability description
* Affected component
* Security impact
* Attack scenario
* Exploitation procedure
* Before-fix evidence
* Secure coding fix
* After-fix evidence
* Security improvement

Detailed vulnerability documentation is available under:

```text
security/vulnerabilities/
```

---

# 🛡️ DevSecOps Security Approach

Security is integrated into multiple stages of the development lifecycle.

```text
        Developer
            │
            ▼
       Git Repository
            │
            ▼
       GitHub Actions
            │
     ┌──────┴──────┐
     ▼             ▼
   Build        Security
     │           Testing
     │             │
     │      ┌──────┴───────┐
     │      ▼              ▼
     │   SAST/Code      Dependency
     │    Analysis       Scanning
     │      │              │
     └──────┴──────┬───────┘
                   ▼
             Security Gate
                   │
             ┌─────┴─────┐
             │           │
           PASS         FAIL
             │           │
             ▼           ▼
          Deploy       Fix Code
```

The objective is to identify security issues **as early as possible** rather than waiting until the application reaches production.

---

# ⚙️ CI/CD Pipeline

The project uses **GitHub Actions** to automate security checks.

The workflow is located at:

```text
.github/workflows/security-pipeline.yml
```

The pipeline is triggered by repository activity such as pushes and pull requests, depending on the workflow configuration.

## Pipeline Stages

The pipeline follows a sequence similar to:

```text
Checkout Code
      ↓
Install Dependencies
      ↓
Build Application
      ↓
Run Tests
      ↓
Static Security Analysis
      ↓
Dependency Security Scan
      ↓
Container Security Checks
      ↓
Security Validation
      ↓
Pipeline Result
```

The pipeline badge at the top of this README provides the current GitHub Actions workflow status.

---

# 🔍 Security Tooling

The project integrates security tools into the development and CI/CD process.

Depending on the configured workflow, security testing may include:

### Static Application Security Testing — SAST

SAST tools analyse application source code without executing the application.

They can identify issues such as:

* Insecure coding practices
* Injection risks
* Unsafe API usage
* Authentication weaknesses
* Security-sensitive code patterns

---

### Dependency Scanning

Dependency scanning identifies known vulnerabilities in third-party packages.

This is particularly important for Node.js applications because the project depends on packages defined in:

```text
package.json
```

and:

```text
package-lock.json
```

---

### Container Security

Docker images and container configurations are reviewed for security weaknesses such as:

* Vulnerable base images
* Outdated packages
* Excessive privileges
* Insecure configurations
* Unnecessary exposed services

---

### Dynamic Application Security Testing — DAST

DAST evaluates the running application from an attacker's perspective.

The application is executed and security tools can interact with its HTTP endpoints to identify potential vulnerabilities.

---

# 🔑 Secret Management

Sensitive information should not be hard-coded into the source code or committed to GitHub.

The project uses **GitHub Actions encrypted secrets** for sensitive CI/CD configuration.

The general approach is:

```text
Sensitive Value
      ↓
GitHub Repository Secret
      ↓
GitHub Actions Workflow
      ↓
Runtime Environment
```

This prevents credentials and other sensitive configuration values from being directly stored in the repository.

### Important Security Rules

Never commit:

```text
.env
passwords
API keys
private keys
database credentials
production secrets
```

to the Git repository.

---

# 🌿 Branch Strategy

The project uses Git for source-code management and collaboration.

A typical workflow is:

```text
main
 │
 ├── feature/application
 │
 ├── feature/security
 │
 ├── feature/threat-model
 │
 └── feature/devsecops-pipeline
```

Developers work on separate branches and changes can be merged into the main branch after review and validation.

This approach helps:

* Prevent accidental changes to the main branch.
* Separate individual development work.
* Enable code review.
* Run CI/CD checks before merging.
* Maintain a clear development history.

---

# 📚 Documentation

Project documentation is organised under the `security/` directory.

Important documentation includes:

### Architecture

```text
security/architecture/
```

Contains the application architecture and Docker deployment documentation.

### Threat Modelling

```text
security/threat-model/
```

Contains the STRIDE-based threat modelling and risk assessment.

### Vulnerability Assessment

```text
security/vulnerabilities/
```

Contains vulnerability analysis, exploitation evidence, remediation, and verification.

### CI/CD

```text
.github/workflows/
```

Contains the GitHub Actions DevSecOps pipeline.

---

# 🔄 DevSecOps Lifecycle Demonstrated

This project demonstrates security integration throughout the development lifecycle:

| Stage    | DevSecOps Activity                                |
| -------- | ------------------------------------------------- |
| Plan     | Threat modelling and security requirements        |
| Develop  | Secure coding and vulnerability remediation       |
| Build    | Docker containerisation                           |
| Test     | Functional and security testing                   |
| Scan     | SAST, dependency and container security checks    |
| Deploy   | Automated CI/CD workflow                          |
| Verify   | Re-testing vulnerabilities after fixes            |
| Maintain | Continuous security checks through GitHub Actions |

---

# 🧪 Security Testing Philosophy

A key principle of this project is:

> **A vulnerability is not considered properly fixed until the security test that previously demonstrated the vulnerability no longer succeeds.**

Therefore, the project follows a **before-and-after** methodology.

### Before Fix

```text
Attack
  ↓
Vulnerability
  ↓
Successful Exploitation
  ↓
Evidence
```

### After Fix

```text
Attack
  ↓
Security Control
  ↓
Exploitation Prevented
  ↓
Verification Evidence
```

This provides practical evidence that the implemented security controls are effective.

---

# 🤝 Contributing

For group development:

1. Create or switch to a feature branch.
2. Make the required changes.
3. Test the application locally.
4. Run relevant security checks.
5. Commit the changes.
6. Push the branch to GitHub.
7. Create a Pull Request.
8. Review the changes.
9. Merge only after the required checks pass.

Example:

```bash
git checkout -b feature/security-improvement
```

After making changes:

```bash
git add .
git commit -m "Add security improvement"
git push origin feature/security-improvement
```

---

# ⚠️ Disclaimer

OWASP NodeGoat is intentionally vulnerable and is designed for **security education and controlled testing**.

This project must only be deployed and tested in an authorised environment.

Do **not** expose the intentionally vulnerable application to the public internet or use the demonstrated techniques against systems without explicit permission.

---

# 📄 License

This repository is an academic project developed for the **IE3142 — DevOps Security** module.

The underlying OWASP NodeGoat application is an open-source security training application. Refer to the original project and its license for the applicable NodeGoat licensing information.

---

# 👨‍💻 Project Repository

**GitHub:** [Dinijaya633/IE3142-DevSecOps-NodeGoat](https://github.com/Dinijaya633/IE3142-DevSecOps-NodeGoat)

**CI/CD Pipeline:** [GitHub Actions — Security Pipeline](https://github.com/Dinijaya633/IE3142-DevSecOps-NodeGoat/actions/workflows/security-pipeline.yml)

---

## 🎓 Academic Project

**IE3142 — DevOps Security**
**Building and Securing a DevSecOps Pipeline**
**SLIIT — Faculty of Computing**
**2026**
