# 🔖 Smart Bookmark Manager

A full-stack, real-time bookmark management application built with Next.js and Supabase. This app allows users to securely log in with their Google account, save their favorite URLs, and see their bookmark list update in real-time across multiple devices without needing to refresh the page.

## ✨ Features

- **Secure Authentication:** Google OAuth integration using Supabase Auth.
- **Real-time Sync:** Bookmarks update instantly across all open tabs via Supabase WebSockets.
- **Row Level Security (RLS):** Database policies ensure users can only view, add, or delete their own personal bookmarks.
- **Server-Side Protection:** The application uses Next.js server components to verify user sessions before rendering, eliminating UI flickering.
- **Responsive UI:** Clean, modern interface styled with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **Backend/BaaS:** Supabase
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (Google OAuth 2.0 with PKCE flow) & `@supabase/ssr`

## 🧠 Challenges & Solutions

Building a real-time application with server-side rendering introduced a few unique challenges. Here is how I solved them:

### 1. Syncing Auth State between Server and Client

**The Problem:** Using standard client-side `useEffect` hooks to check if a user is logged in caused a brief "flash" of the dashboard before kicking unauthenticated users back to the login screen.
**The Solution:** I implemented a "Gatekeeper" pattern in the `layout.js` Server Component using `@supabase/ssr`. By fetching the session via cookies on the server (`await supabase.auth.getUser()`), the app evaluates the user's auth state _before_ painting the DOM. If there is no session, it strictly renders the `<Auth />` component, ensuring a highly secure and flicker-free user experience.

### 2. Real-time WebSockets & React Strict Mode

**The Problem:** While implementing the Supabase Real-time listener to automatically refresh the bookmark list, React 18's Strict Mode (which mounts, unmounts, and remounts components in development) was aggressively severing the WebSocket connection, throwing "WebSocket closed before connection established" errors. Furthermore, Supabase doesn't broadcast changes by default.
**The Solution:** First, I enabled the `supabase_realtime` publication for the `bookmarks` table in the PostgreSQL database. Second, I attached the channel subscription to a variable and returned a precise cleanup function (`supabase.removeChannel(channel)`) inside the `useEffect`. This cleanly managed the Strict Mode lifecycle and prevented memory leaks, allowing perfect real-time syncing across multiple browser windows.

### 3. State Management for Form Handling

**The Problem:** Initially, managing both the form's visibility (boolean) and the form's input data (object) within a single or entangled state caused UI bugs where the form would unexpectedly hide while typing.
**The Solution:** I decoupled the states (`isFormHidden` vs `formData`) and implemented strict Controlled Components (`value={data.title}`). This allowed me safely clear the input fields immediately after a successful Supabase `.insert()` while keeping the UI stable.
