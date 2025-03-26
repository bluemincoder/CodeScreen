
# CodeScreen

## Overview
CodeScreen is an advanced online interview platform designed to streamline the technical interview process. Developed using **Next.js**, **TypeScript**, **Stream**, **Convex**, and **Clerk**, the platform facilitates seamless interview experiences with video calls, real-time code editing, and interview feedback capabilities. CodeScreen offers a dynamic environment for interviewers and interviewees, making technical assessments more effective and collaborative.

---

## Problem/Why?
Technical interviews can often be unstructured and challenging to manage, leading to inefficient assessments. CodeScreen addresses these issues by providing a unified platform for video calls, screen sharing, code collaboration, and structured feedback, ensuring a seamless interview experience for both interviewers and candidates.

---

## Background
With the increasing demand for remote technical interviews, CodeScreen aims to replicate the efficiency of in-person assessments. Utilizing modern web technologies and frameworks, the platform facilitates real-time interaction, effective problem-solving, and structured evaluation.

---

## Core Features

### **Interview Experience:**
- **Video Call Panel:** Real-time video calls with screen sharing and recording capabilities.
- **Reactions & Feedback:** Emoji reactions for non-verbal communication.
- **Screen Recording:** Capture interview sessions for future review.

### **Problem Solving:**
- **DSA Question Panel:** Display problems with detailed descriptions, constraints, and test cases.
- **Code Editor:** Real-time collaborative editor supporting C++, Java, and Python.
- **Test Case Validation:** Validate code solutions against test cases provided by the interviewer.

### **Interviewer Utilities:**
- **Question Management:** Add, edit, and delete DSA questions with ease.
- **Interview Scheduling:** Schedule, start, and manage interview sessions.
- **Feedback System:** Provide structured feedback for each interview session.

### **Authentication & Authorization:**
- Secure authentication and role-based access control using **Clerk**.

---

## Technologies Used

- **Frontend:**
  - Next.js & TypeScript
  - Tailwind CSS & ShadCn for styling
  - Stream for real-time communication

- **Backend:**
  - Convex for data management and state synchronization
  - Server Components and Server Actions for optimized performance

- **Authentication:**
  - Clerk for user authentication and authorization

---

## Setup Instructions

### Environment Variables:
Create a `.env` file in the root directory with the following variables:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
```

### Running the Application
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Access the app on `http://localhost:3000`

---

## Future Enhancements
- Integration with third-party coding platforms (e.g., Codeforces, LeetCode)
- Advanced analytics for interview feedback
- Support for additional programming languages

CodeScreen redefines technical interviews by combining modern technologies to create a structured, interactive, and effective assessment environment.
