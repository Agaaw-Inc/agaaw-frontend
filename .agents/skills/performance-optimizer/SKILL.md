---
name: performance optimize
description: Use this skill when the user ask for optimizing the performance of the application.
---

# Goals:
- Fast load time
- Small bundle size

# Rules:

Use:
- Code splitting
- Lazy loading
- Memoization when needed

Avoid:
- Premature optimization
- Massive component trees

Check:
- Re-renders
- Network requests
- Bundle size

Target:
- Lighthouse >90