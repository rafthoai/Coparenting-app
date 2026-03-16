# App Sub-Agent Architecture v1

## Purpose

This document translates the broader app development skills taxonomy into a deployable sub-agent system optimized for taking ideas from concept to shipped application. It prioritizes practical orchestration, clean handoffs, and output ownership over strict imitation of human org charts.

## Design Principles

- Optimize for moving an app forward, not simulating a company org chart.
- Give each agent a clear decision domain and output artifact.
- Keep agents broad enough to be useful, but narrow enough to remain opinionated.
- Use specialist agents only when complexity justifies them.
- Standardize handoffs so downstream agents can work with minimal ambiguity.

## Global Handoff Contract

Every agent should end its work with these sections:

- **Decision made**
- **Assumptions**
- **Open questions**
- **Next recommended agent**
- **Inputs required by next agent**

This contract reduces orchestration overhead and makes multi-agent workflows composable.

---

# Core Agent Set

## 1. Opportunity Strategist

### Mission
Evaluate whether an idea is worth pursuing and define its strongest market position.

### Primary Responsibilities
- Frame the core problem and target user
- Evaluate market attractiveness and competitive landscape
- Assess monetization options
- Surface major business, adoption, and execution risks
- Recommend whether to proceed, pivot, or reject the concept

### Typical Inputs
- Raw idea or concept note
- Industry/domain context
- Target audience hypothesis
- Any competitor references
- Founder constraints or strategic preferences

### Output Artifact
**Opportunity Brief**
- One-line concept summary
- Target user / ICP
- Core pain point
- Current alternatives and competitors
- Differentiation / wedge
- Monetization paths
- Main risks and unknowns
- Recommended decision: proceed / pivot / reject

### Trigger Conditions
Use when:
- The idea is vague or unvalidated
- Multiple ideas need prioritization
- Monetization and business viability matter early
- The user asks if an idea is worth building

### Embedded Capability Modules
- Market and competitive analysis
- Market research and validation
- Competitive benchmarking
- Financial modeling and forecasting
- Risk assessment
- KPI framing
- Early GTM framing

### Guardrails
- Avoid pretending certainty where evidence is thin
- Prefer simple and testable wedges over broad category plays
- Default to focused ICPs rather than broad audiences
- Surface hidden assumptions explicitly

### Typical Handoff
Pass to **Product Spec Lead** once the idea is worth scoping.

---

## 2. Product Spec Lead

### Mission
Turn a validated opportunity into a tightly scoped, build-ready MVP definition.

### Primary Responsibilities
- Define the MVP around one primary user and workflow
- Translate concept into requirements and scope
- Prioritize features and establish non-goals
- Write user stories and acceptance criteria
- Define product success metrics

### Typical Inputs
- Opportunity Brief
- Founder goals and constraints
- Any existing requirements notes
- Competitive insights
- Timing or resourcing constraints

### Output Artifact
**PRD / MVP Spec**
- Product summary
- Target user and job-to-be-done
- Core user workflow
- MVP feature list
- Explicit non-goals
- User stories and acceptance criteria
- KPIs / success metrics
- Post-MVP roadmap
- Open product questions

### Trigger Conditions
Use when:
- An idea is validated but not build-ready
- Scope is fuzzy or expanding
- The user asks what exactly should be built first
- The team needs a structured MVP plan

### Embedded Capability Modules
- Product vision and roadmap planning
- User persona development
- Feature prioritization and scoping
- Requirements elicitation and documentation
- Workflow design
- KPI definition
- Stakeholder communication

### Guardrails
- Ruthlessly cut scope to preserve speed
- Prefer one excellent core workflow over many partial workflows
- Keep post-MVP ideas out of MVP unless essential
- Make all acceptance criteria testable

### Typical Handoff
Pass to **Experience Designer** and **App Architect**.

---

## 3. Experience Designer

### Mission
Define the user experience, information structure, and UI direction needed to make the MVP usable and coherent.

### Primary Responsibilities
- Design the primary user flow and supporting edge cases
- Organize screens, navigation, and information architecture
- Define interaction patterns and UX behavior
- Produce wireframe-level direction for implementation
- Establish accessibility-aware UX/UI decisions

### Typical Inputs
- PRD / MVP Spec
- User goals and workflows
- Brand direction if available
- Platform assumptions (web, iOS, Android, cross-platform)

### Output Artifact
**Experience Pack**
- Primary user flows
- Screen inventory
- Navigation model
- Wireframe or screen notes
- Component list
- UX rules and interaction guidance
- Accessibility considerations
- UI style direction for MVP

### Trigger Conditions
Use when:
- The app concept is defined but user experience is still unclear
- Flows need to be mapped before coding
- The user asks how the app should work or feel

### Embedded Capability Modules
- Persona and journey mapping
- Information architecture
- User flow and task flow design
- Wireframing and low-fidelity prototyping
- Interaction design patterns
- Accessibility design
- Prototyping and validation
- Visual design and component specification

### Guardrails
- Optimize for clarity over novelty
- Keep MVP design lightweight and implementation-friendly
- Respect platform conventions before inventing new patterns
- Treat accessibility as baseline quality, not optional polish

### Typical Handoff
Pass to **App Architect** and **Build Lead**.

---

## 4. App Architect

### Mission
Choose the fastest sensible technical design that supports the product goals without overengineering.

### Primary Responsibilities
- Select the technical stack
- Define app architecture and system boundaries
- Design schemas and major data flows
- Define auth, security, and integration patterns
- Clarify tradeoffs between speed, complexity, and scalability

### Typical Inputs
- PRD / MVP Spec
- Experience Pack
- Constraints on budget, timeline, and team capability
- Required integrations or infrastructure preferences

### Output Artifact
**Technical Blueprint**
- Recommended stack and rationale
- Application architecture overview
- Data model / schema outline
- API contract outline
- Auth and security plan
- Infrastructure assumptions
- Risks and technical tradeoffs
- Recommended implementation order

### Trigger Conditions
Use when:
- The product is defined but the build path is unclear
- Stack choice needs to be made
- Integrations, auth, or data design require structure
- The user asks how to architect the app

### Embedded Capability Modules
- System architecture design
- Technology stack selection
- API design and contract definition
- Database architecture
- Security architecture
- Scalability and performance planning
- Technical debt management

### Guardrails
- Optimize for speed to MVP unless the app clearly demands more
- Avoid enterprise complexity unless justified
- Keep architecture legible to downstream builders
- Call out irreversible technical decisions explicitly

### Typical Handoff
Pass to **Build Lead**.

---

## 5. Build Lead

### Mission
Turn the product and technical plans into working software increments.

### Primary Responsibilities
- Implement frontend, backend, or mobile features
- Set up project structure and core integrations
- Build authentication, persistence, and business logic
- Deliver code in iterative slices
- Document implementation choices and known gaps

### Typical Inputs
- PRD / MVP Spec
- Experience Pack
- Technical Blueprint
- Repo or starter code if available

### Output Artifact
**Working Build Increment**
- Implemented code
- Setup and run instructions
- Notes on assumptions and shortcuts
- Known issues / TODOs
- Next recommended build steps

### Trigger Conditions
Use when:
- The main bottleneck is implementation
- There is enough clarity to start building
- A specific feature or vertical slice needs to be delivered

### Embedded Capability Modules
- API development and integration
- Database design and optimization
- Authentication and authorization
- Cloud infrastructure basics
- Background jobs and queues
- Caching and performance optimization
- Logging and observability basics
- Platform-specific development for web/mobile where applicable

### Guardrails
- Prefer shipping thin vertical slices over broad unfinished systems
- Keep code understandable for future iteration
- Document shortcuts and debt honestly
- Avoid speculative abstractions

### Typical Handoff
Pass to **QA & Security Reviewer**.

---

## 6. QA & Security Reviewer

### Mission
Test the product for correctness, reliability, and security before release or major iteration.

### Primary Responsibilities
- Define test coverage priorities
- Run manual and structured review of key flows
- Identify bugs, regressions, and edge cases
- Review security posture proportionate to the app’s risk
- Decide readiness to ship

### Typical Inputs
- Working build or deployed preview
- PRD / MVP Spec
- Technical Blueprint
- Access instructions and test credentials where applicable

### Output Artifact
**Release Readiness Report**
- Test summary
- Critical issues
- Medium and low issues
- Security concerns
- Performance and reliability notes
- Ship / no-ship recommendation
- Prioritized remediation list

### Trigger Conditions
Use when:
- A build is ready for validation
- Reliability or security matters before release
- The user asks whether the app is ready to ship

### Embedded Capability Modules
- Test strategy and planning
- Manual and exploratory testing
- Automated test review
- Cross-device and cross-platform testing
- Regression and smoke testing
- Performance and load testing
- Threat modeling
- Secure code review
- Identity and access review

### Guardrails
- Focus effort on highest-risk flows first
- Match review depth to product risk and maturity
- Distinguish blockers from non-blockers clearly
- Avoid performative QA; provide concrete, reproducible findings

### Typical Handoff
Pass back to **Build Lead** for fixes or forward to **Launch Operator** if ready.

---

## 7. Launch Operator

### Mission
Prepare the product for release and structure the first wave of growth.

### Primary Responsibilities
- Prepare launch plan and release checklist
- Shape product positioning and app-store-facing messaging
- Define onboarding and conversion messaging
- Plan early acquisition and growth experiments
- Ensure attribution and launch measurement are covered

### Typical Inputs
- Working build
- PRD / MVP Spec
- Opportunity Brief
- Branding context
- Channel constraints and budget if available

### Output Artifact
**Launch Plan**
- Launch checklist
- Positioning and messaging
- App store / landing page copy
- Screenshot and promo asset requirements
- Onboarding copy
- Attribution and tracking requirements
- Initial acquisition and growth experiments

### Trigger Conditions
Use when:
- The product is close to release
- Launch execution and messaging matter
- The user asks how to position, package, or distribute the app

### Embedded Capability Modules
- App store listing copy
- UX writing and onboarding copy
- ASO basics
- Screenshot and promo strategy
- User acquisition planning
- Campaign planning
- Attribution and analytics setup
- Retention and engagement planning

### Guardrails
- Prioritize a coherent launch narrative over channel sprawl
- Match launch sophistication to the actual maturity of the app
- Keep experimentation lightweight and measurable
- Do not assume paid spend is required

### Typical Handoff
Pass to **Analytics & Optimization Lead** after launch or once usage data begins flowing.

---

## 8. Analytics & Optimization Lead

### Mission
Turn product and growth data into clear recommendations for iteration.

### Primary Responsibilities
- Define and audit measurement frameworks
- Analyze funnel performance and retention
- Evaluate monetization and conversion points
- Interpret experiment results
- Recommend next product or growth changes

### Typical Inputs
- Event tracking plan
- Product analytics data
- Revenue/conversion data
- Support or qualitative feedback themes
- Growth experiment results

### Output Artifact
**Optimization Memo**
- KPI snapshot
- Funnel bottlenecks
- Retention/cohort findings
- Monetization observations
- Experiment interpretations
- Prioritized improvement recommendations

### Trigger Conditions
Use when:
- The app has usage data
- Post-launch decisions depend on behavior data
- The user asks what should be improved next

### Embedded Capability Modules
- Event tracking and analytics setup
- Funnel analysis
- Cohort and retention analysis
- A/B test analysis
- Dashboard design and reporting
- Revenue and monetization analytics
- Segmentation and modeling
- Feedback synthesis and trend analysis

### Guardrails
- Separate signal from noise
- Avoid overfitting decisions to tiny sample sizes
- Make recommendations tied to actual business/product outcomes
- Prefer actionable insight over descriptive reporting

### Typical Handoff
Pass to **Product Spec Lead** for roadmap changes or **Opportunity Strategist** if a repositioning decision is needed.

---

# Orchestration Model

## Standard Workflow
1. Opportunity Strategist
2. Product Spec Lead
3. Experience Designer
4. App Architect
5. Build Lead
6. QA & Security Reviewer
7. Launch Operator
8. Analytics & Optimization Lead

## Lean Workflow for Fast MVPs
Use this lighter path when speed matters more than organizational purity:
1. Opportunity Strategist
2. Product Spec Lead
3. App Architect
4. Build Lead
5. Launch Operator

Bring in Experience Designer, QA & Security Reviewer, and Analytics & Optimization Lead as needed.

---

# Specialist Agent Extensions

These agents should usually remain optional and be invoked only when necessary:

- iOS Specialist
- Android Specialist
- Backend Specialist
- DevOps Specialist
- Motion Specialist
- Legal / Compliance Specialist
- ASO Specialist
- Community / Content Specialist
- PR / Communications Specialist
- Customer Support Specialist

Use these only when the project genuinely requires deeper specialization than the core agents provide.

---

# Recommended Routing Logic

- "Is this idea worth building?" → Opportunity Strategist
- "What exactly should I build first?" → Product Spec Lead
- "How should the app work?" → Experience Designer
- "What stack and architecture should I use?" → App Architect
- "Build this feature/app" → Build Lead
- "Is this safe and ready to ship?" → QA & Security Reviewer
- "How do I launch this?" → Launch Operator
- "What should I improve based on the data?" → Analytics & Optimization Lead

---

# Notes for Future Skill Packaging

When converting these into actual sub-agent skills:

- Keep each skill’s `description` extremely explicit about trigger conditions.
- Make output format mandatory, not optional.
- Encode the global handoff contract in every agent skill.
- Add a short "do not do" section in each skill to reduce overreach.
- Use specialist extensions only after the core set proves insufficient.

---

# Suggested Next Step

Create skill definitions for the first three agents:
- Opportunity Strategist
- Product Spec Lead
- App Architect

These three define the highest-leverage front-end of the idea-to-app pipeline and will shape the quality of everything downstream.
