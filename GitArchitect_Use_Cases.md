# GitArchitect — Easy-to-Understand Use Cases

## 1. What is GitArchitect?

**GitArchitect** is an AI-powered GitHub engineering assistant.

The idea is simple:

> Connect a GitHub repository, select a repository, and let AI understand the codebase so developers can ask questions, review pull requests, analyze issues, debug CI failures, and get architecture recommendations.

Instead of manually checking many files, pull requests, issues, and GitHub Actions logs, GitArchitect uses **AI + GitHub MCP** to understand the repository and provide useful engineering guidance.

---

## 2. Simple Example

A developer selects a repository:

```text
my-company/ecommerce-app
```

Then they can ask:

```text
Analyze this repository.
```

GitArchitect reads the repository and explains:

- What the project does
- Which technologies are used
- How the folders are structured
- What architecture is being followed
- Important architecture problems
- Security concerns
- Testing quality
- Performance concerns
- Recommended improvements

---

# Main Use Cases

## Use Case 1 — Understand an Unknown Repository

### Problem

A developer joins a new project and does not understand the codebase.

Normally they need to manually inspect README files, package/build files, source folders, configuration, services, APIs, tests, routing, and state management.

### With GitArchitect

The developer selects the repository and asks:

```text
Explain this repository.
```

GitArchitect can return:

```text
Project Type: Full-stack application
Frontend: Angular
Backend: Node.js + Express
Database: MongoDB
Testing: Vitest
Architecture: Feature-based frontend + layered backend
```

### Benefit

The developer can understand the project much faster.

---

## Use Case 2 — Repository Architecture Analysis

### User asks

```text
Analyze the architecture of this repository.
```

GitArchitect examines the repository and returns architecture, code organization, maintainability, scalability, security, performance, testing, and dependency-health scores.

Example:

```text
Overall Score: 7.8 / 10

Strengths:
- Clear feature separation
- Good service boundaries
- Lazy-loaded routes

Problems:
- Shared service contains business logic
- Limited integration tests
- State ownership is unclear
```

### Benefit

Teams can identify architecture problems before they become expensive technical debt.

---

## Use Case 3 — Technology-Aware Repository Analysis

GitArchitect should not work only for Angular projects. It first discovers the technology and then routes analysis to the right specialist.

```text
Repository
   ↓
Technology Detection
   ↓
Angular → Angular Specialist
React → React Specialist
Node.js → Node.js Specialist
Spring Boot → Spring Boot Specialist
Unknown → Generic Specialist
```

For a MERN project:

```text
React Specialist
+
Node.js Specialist
```

### Benefit

The same product can analyze different types of software repositories.

---

## Use Case 4 — Pull Request Review

### User asks

```text
Review PR #42.
```

GitArchitect checks the PR description, changed files, diff, commits, GitHub checks, related repository code, and tests.

Example result:

```text
Risk: Medium
Recommendation: Request Changes

Finding:
Order cancellation allows completed orders.

Severity: High
File: src/modules/orders/order.service.js

Suggestion:
Validate terminal order states before cancellation.
```

### Benefit

Developers get an AI-assisted code review before merging a pull request.

---

## Use Case 5 — Issue Analysis

### User asks

```text
Analyze issue #67.
```

GitArchitect reads the issue title, description, comments, labels, and related repository code. Then it explains the issue type, requirements, affected areas, missing information, implementation plan, testing plan, and risks.

Example:

```text
Issue Type: Feature
Requirement: Add wishlist functionality

Likely Affected Areas:
- Product module
- User module
- Database
- API
- Frontend state

Implementation Plan:
1. Add wishlist data model
2. Add wishlist service
3. Add API endpoints
4. Add UI integration
5. Add tests
```

### Benefit

The developer understands what needs to be built before writing code.

---

## Use Case 6 — Bug Root Cause Analysis

Suppose an issue says:

```text
Completed orders can still be cancelled.
```

GitArchitect can read the issue, search the repository, find the cancellation logic, inspect related tests, and identify the likely root cause.

Example:

```text
Likely Root Cause:
The cancellation service validates CANCELLED orders,
but COMPLETED is not included as a terminal state.

Evidence:
src/modules/orders/order.service.js
```

### Benefit

Developers spend less time searching through the codebase manually.

---

## Use Case 7 — GitHub Actions / CI Failure Debugging

### User asks

```text
Why did GitHub Actions run #123456 fail?
```

GitArchitect checks the workflow run, failed jobs, failed steps, job logs, workflow YAML, and related source code.

Example:

```text
Failure Type: TypeScript Build Error

Root Cause:
Property 'totalPrice' does not exist on type 'Order'.

Affected File:
src/app/orders/order-summary.component.ts

Suggested Fix:
Use the existing `total` property or update the Order model.
```

### Benefit

Instead of manually reading hundreds of CI log lines, developers get a clear root-cause explanation.

---

## Use Case 8 — Ask Questions About the Selected Repository

The developer selects the repository once. After that they can simply ask:

```text
Where is authentication implemented?
How is state managed?
Where are API calls handled?
Which files handle orders?
Show me the important folders.
Does this project use lazy loading?
```

GitArchitect understands these questions refer to the currently selected repository.

### Benefit

The repository becomes conversational.

---

## Use Case 9 — Repository Intelligence V2

For deeper analysis, GitArchitect uses multiple specialist agents.

```text
Repository
   ↓
Repository Discovery
   ↓
Technology Detection
   ↓
Architecture Analyzer
Security Analyzer
Testing Analyzer
Technology Specialist
   ↓
Final Report
```

Example for Angular:

```text
Repository Discovery
   ↓
Architecture Analyzer
   ↓
Angular Specialist
   ↓
Security Analyzer
   ↓
Testing Analyzer
   ↓
Final Report
```

Example for Spring Boot:

```text
Repository Discovery
   ↓
Architecture Analyzer
   ↓
Spring Boot Specialist
   ↓
Security Analyzer
   ↓
Testing Analyzer
```

### Benefit

Each specialist focuses on one responsibility instead of one AI agent trying to understand everything.

---

# Future Use Case — AI-Assisted GitHub Changes

Currently GitArchitect is intentionally **read-only**.

In the future, after user approval, it could support:

- Create Issue
- Comment on PR
- Approve / Request Changes
- Create Branch
- Create Pull Request
- Rerun GitHub Actions

The flow should be:

```text
GitArchitect proposes action
        ↓
User reviews it
        ↓
User approves
        ↓
GitArchitect performs GitHub action
```

GitArchitect should never make important GitHub changes automatically without approval.

---

# Example Complete Developer Flow

1. Connect GitHub.
2. Select `company/ecommerce-platform`.
3. Ask `Explain this project.`
4. Run Repository Analysis.
5. Analyze a new issue such as `Issue #82`.
6. Review the implementation in `PR #95`.
7. If GitHub Actions fails, ask why workflow run `#19871` failed.
8. GitArchitect correlates repository code, issue requirements, PR changes, and CI evidence to help the developer decide what to do next.

This creates one engineering assistant across the complete GitHub development workflow.

---

# Who Can Use GitArchitect?

- Software Developers
- Senior Developers
- Tech Leads
- Software Architects
- Engineering Managers
- Code Reviewers
- DevOps Engineers
- New team members joining a project

---

# What GitArchitect Is NOT

GitArchitect is not intended to replace developers.

It is intended to reduce repetitive engineering work such as:

- Searching large repositories
- Understanding unfamiliar code
- Reading long pull-request diffs
- Investigating GitHub issues
- Reading CI logs
- Finding architecture problems
- Preparing implementation plans

The developer still makes the final engineering decision.

---

# One-Line Product Description

> **GitArchitect is an AI-powered GitHub engineering assistant that understands repositories, reviews architecture and pull requests, analyzes issues, and debugs CI failures using GitHub MCP.**

---

# Short Version for Team Discussion

> We are building an AI engineering assistant connected to GitHub through MCP. A user selects a repository and GitArchitect understands the repository context. It can analyze the architecture, detect technologies, review pull requests, analyze issues, investigate GitHub Actions failures, and provide evidence-based recommendations. Currently the system is read-only, and later we will add human-approved GitHub write operations and an Angular UI.
