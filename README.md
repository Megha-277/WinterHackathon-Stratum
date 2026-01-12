#  Winter Hackathon - Repository Setup Guide

Welcome to the Winter Hackathon organized by **Sceptix** and **GDG SJEC**! 



 Crowd Detection System

 ## Description
## CrowdSense functions as a comprehensive platform for monitoring and navigating busy locations. Key features include:

• Real-Time Monitoring : Displays live crowd capacity percentages, wait times, and trends (rising or falling) for various destinations like temples, beaches, and markets.
• Shows live crowd % and wait time for temples, beaches, markets, etc.
• Suggests best visiting hours and less crowded alternatives.
• Includes Sarthi (AI guide) for personalized travel tips.

## Problem it solves:
• Real-Time Status Dashboard: Displays live crowd percentages (e.g., 87% capacity) and wait times directly to the user.
• Sarthi AI Companion: An intelligent chatbot that provides personalized travel tips, identifies the "Best Time" to visit, and suggests alternatives based on current data.
• Authorities struggle to manage peak-time crowds.
• Alternative places stay empty due to lack of real-time info.

## Who it is for 
We help people check how crowded a place is before they go, so they can avoid long queues and choose better timing. It's built for tourists, families, and city visitors who want smoother trips, and for authorities who want better crowd management.”

# Demo Video Link: <insert Google Drive link to the demo video of the working of your project>

# Features

• Real-Time Crowd Status: Capacity %, wait times, and trends
• AI Guidance (Sarthi): Personalized travel tips and alternatives
• Explorer + Admin Tools: Map for users and dashboard for authorities

## Tech Stack
• DialogFlow
• FireBase
• Node js and Express
• Geoapify
• HTML5/CSS3/JavaScript

## Google Technologies Used
1. Dialogflow — chatbot intent handling
2. Firestore — real-time data storage
3. Firebase Admin SDK — secure backend access to Firestore
4. Gemini — AI response generation



## Setup Instructions
Steps to run the project locally:
1. Clone the repository:
2. Install dependencies
3. Add environment variables (if any)
4. Run the project

## Team Members
1.Mega Shree
2.Manswini M
3.Keerthana
4.Krithi

```


## Commit Your Changes

Track and save your progress using Git:

### Check the status of your changes
```bash
git status
```

### Stage your changes
Use the `git add` command to stage the changes you want to commit:
```bash
git add .
```

### Commit with a meaningful message

#### **Option 1: Simple Commit Format** (Beginner Friendly)
Use this if you're new to Git:
```bash
git commit -m "Your descriptive commit message"
```

#### **Option 2: Conventional Commits** (Recommended)
Follow this format for more structured, professional commit history:
```bash
git commit -m "<type>(<scope>): <subject>"
```

**Commit Types:**

| Type | Purpose |
|------|---------|
| `feat` | For a new feature for the user, not a new feature for build script. Such commit will trigger a release bumping a MINOR version |
| `fix` | For a bug fix for the user, not a fix to a build script. Such commit will trigger a release bumping a PATCH version |
| `perf` | For performance improvements. Such commit will trigger a release bumping a PATCH version |
| `docs` | For changes to the documentation |
| `test` | For adding missing tests, refactoring tests; no production code change |
| `style` | For formatting changes, missing semicolons, etc |
| `refactor` | For refactoring production code, e.g. renaming a variable |
| `build` | For updating build configuration, development tools or other changes irrelevant to the user |

- **Scope:** Area of change (e.g., api, ui, auth)
- **Subject:** One-line summary in present tense, no period at the end

**Example:**
```bash
git commit -m "fix(button): fix submit button not working"
```

---

## Push Your Changes

Send your local commits to GitHub:
```bash
git push origin
```

---

##  Tips for Success

- **Commit often:** Small, frequent commits help track progress and fix bugs easily
- **Write clear messages:** Describe what you did in each commit
- **Collaborate:** Make sure everyone in your team contributes
- **Stay organized:** Use branches for different features if needed
- **Test regularly:** Ensure your code works before pushing

---

##  Need Help?

For any issues or doubts, reach out to the organizing team.

**Happy Hacking!** ✨

---

*Organized by Sceptix & GDG SJEC*  
