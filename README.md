# Sawon Ahmed - 3D Interactive Full Stack Developer Portfolio

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/sanonahmed/sawon-ahmed-3d-portfolio)

An interactive 3D developer portfolio and creative technology showcase for **Sawon Ahmed**, Lead Full Stack Engineer & 3D Interactive Web Architect.

Built with **React 19**, **Three.js**, **Tailwind CSS v4**, and powered by an **Express + Google Gemini 3.8 Flash** server-side AI assistant.

---

## ✨ Features

- **🎮 Interactive 3D Workstation Scene**: Procedurally rendered desk environment with custom PBR lighting, mechanical keyboard, curved monitor with live terminal modes, succulent, and coffee mug with particle steam.
- **✨ Real-Time GLSL Shaders & Bloom**: Custom retro synthwave grid, cyber matrix fog, volumetric glow, and multi-theme mood lighting.
- **🤖 Server-Side Gemini AI Chatbot**: Built-in architecture & services assistant using `@google/genai` (Gemini 3.8 Flash) with intelligent fallback handling.
- **🔊 Procedural Web Audio FX**: Synthesized mechanical switch clicks, hover hums, and UI feedback without external audio files.
- **📱 Fully Responsive**: Dynamic viewport camera positioning, touch interactions, collapsible dock, and mobile-optimized rendering.
- **⚡ High Performance**: 60 FPS mobile/desktop optimization with live FPS & memory telemetry dock.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Three.js, Motion (Framer Motion), Lucide Icons, Tailwind CSS v4, Vite 8
- **Backend**: Node.js, Express, tsx
- **AI Integration**: Google Gemini API via `@google/genai` SDK
- **Testing**: Node.js native test runner (`tsx --test`)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v20+ or v22+)
- npm (v10+)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sanonahmed/sawon-ahmed-3d-portfolio.git
   cd sawon-ahmed-3d-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   *(Note: The chatbot includes built-in contextual fallback answers even if an API key is not configured yet).*

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Tests**:
   ```bash
   npm run test
   ```

---

## 🌐 Deploy to Render

### Option 1: Automatic Blueprint (Recommended)
1. Fork or push this repository to your GitHub account (`https://github.com/sanonahmed/sawon-ahmed-3d-portfolio`).
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Select your `sawon-ahmed-3d-portfolio` repository.
5. Render will automatically read `render.yaml` and configure the Web Service:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. (Optional) Provide your `GEMINI_API_KEY` under Environment Variables.
7. Click **Apply** to deploy!

### Option 2: Manual Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `sawon-ahmed-3d-portfolio`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
6. Click **Deploy Web Service**.

---

## 📄 License
MIT © [Sawon Ahmed](https://github.com/sanonahmed)
