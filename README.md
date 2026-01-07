AdminPanel | Enterprise User Management System

A robust, full-stack administrative solution built with Next.js 15+ and NextAuth.js. This system provides a secure interface for managing organizational identities, featuring strict Role-Based Access Control (RBAC) and a modern dark-terminal aesthetic.

🌟 Project Overview
This project serves as a centralized hub for managing user access and system permissions. It is designed to be integrated into any existing infrastructure that requires a secure, private administrative layer.

Key Features:
Dual-Role Authentication: Specialized logic for Super Admin (Full CRUD) and Viewer (Read-Only) permissions.

Secure Session Management: Implementation of JWT (JSON Web Token) strategy for persistent, encrypted sessions.

Dynamic UI Architecture: A smart Navbar that switches UI elements based on real-time authentication states.

Enterprise Security: Middleware-level protection that intercepts unauthorized requests and redirects to a custom 403 Access Denied portal.

Responsive Dark Interface: A high-contrast, professional UI designed for long-duration administrative tasks.

Deployment (Render.com)
This project is optimized for deployment on Render.

⚙️ Recommended Configuration:
Build Command: npm install; npm run build

Start Command: npm run start

Required Env Variables:

NEXTAUTH_SECRET: (Random 32-character string)

NEXTAUTH_URL: Your production domain

ADMIN_EMAILS: Comma-separated list of authorized administrator emails.

Access Control Hierarchy
Unauthorized: Redirected to /login.

Viewer Role: Can navigate the system and view user lists, but "Add User" and "Delete" actions are hidden and server-protected.

Super Admin: Full system authority, including the ability to modify the user registry and system settings.
