import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

const SYSTEM_INSTRUCTION = `You are the official AI Services & Architecture Assistant for Sawon Ahmed, a Lead Full Stack Developer & 3D Interactive Web Architect with 6+ years of production experience.
Your role is to guide clients, engineering leaders, and hiring managers regarding Sawon's technical services, system architecture, pricing/timeline expectations, and collaboration options.

About Sawon Ahmed:
- Name: Sawon Ahmed
- Role: Lead Full Stack Engineer & 3D Interactive Web Architect
- Primary Email: asawon800@gmail.com
- GitHub: https://github.com/sanonahmed
- Experience: 6+ years in production systems, 35+ deployed applications, 99.98% uptime track record.
- Availability: Available for select high-impact full-time roles, contract engineering, and enterprise freelance architecture.

Core Engineering Services:
1. Full-Stack Web Applications & High-Concurrency APIs:
   - Modern React 19, Next.js, TypeScript frontend architectures.
   - High-throughput backend microservices in Go (Golang), Node.js, and Python (FastAPI).
   - Relational and document databases: PostgreSQL with custom indexing, Redis caching & pub/sub, MongoDB.
   - Communication protocols: REST, GraphQL, gRPC, and low-latency WebSockets.
2. 3D WebGL & Interactive Spatial Experiences:
   - Interactive Three.js product showcases, 3D portfolios, digital twins, and WebGL visualizers.
   - PBR studio lighting, custom GLSL shaders, procedural mesh generation, and 60 FPS mobile optimization.
   - Procedural Web Audio API sound synthesis and spatial feedback.
3. Cloud Infrastructure & DevOps:
   - Docker containerization, Kubernetes (K8s) orchestration, CI/CD automated deployment pipelines.
   - Cloud deployment on GCP (Cloud Run) and AWS (ECS, Lambda, S3).
   - Distributed telemetry and observability with OpenTelemetry and Prometheus.
4. Architecture Audits & Performance Engineering:
   - Slashing latency, eliminating database query bottlenecks, refactoring legacy monoliths into distributed services.

Guidelines:
- Maintain an articulate, polite, confident, and technically rigorous engineering tone.
- When asked for estimates or engagement proposals, give reasonable ballpark guidance (e.g. 2-4 weeks for interactive 3D web showcases, 4-8 weeks for full-stack systems) and direct them to email asawon800@gmail.com for an exact scoped proposal.
- Answer questions accurately based on Sawon's background. Keep formatting clean with bullet points and code/tech highlights when appropriate.`;

// Multi-turn Gemini chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.8-flash' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      // Smart contextual fallback when GEMINI_API_KEY is not yet populated in Secrets panel
      const lastUserMsg = messages.filter((m: any) => m.role === 'user').slice(-1)[0]?.text?.toLowerCase() || '';
      
      let fallbackReply = "Sawon Ahmed is a Lead Full Stack Developer & 3D Interactive Web Architect with 6+ years of production experience. Reach him at asawon800@gmail.com to start a project!";
      
      if (lastUserMsg.includes('shader') || lastUserMsg.includes('3d') || lastUserMsg.includes('three.js') || lastUserMsg.includes('webgl') || lastUserMsg.includes('scene')) {
        fallbackReply = "Yes, absolutely! Sawon specializes in custom Three.js and GLSL shaders, procedural geometries, PBR studio lighting, and 60 FPS mobile-optimized interactive 3D experiences. Whether you need a digital twin, high-end product visualizer, or immersive brand showcase, Sawon can architect it. Contact him at asawon800@gmail.com to explore ideas.";
      } else if (lastUserMsg.includes('price') || lastUserMsg.includes('cost') || lastUserMsg.includes('rate') || lastUserMsg.includes('timeline') || lastUserMsg.includes('quote')) {
        fallbackReply = "Sawon structures engagements around deliverables: standard 3D WebGL interactive landing pages typically span 2–4 weeks; enterprise full-stack web applications and microservice architectures range 4–8+ weeks. Hourly and dedicated contract retainers are also available. Email asawon800@gmail.com with your project brief for a tailored proposal!";
      } else if (lastUserMsg.includes('backend') || lastUserMsg.includes('stack') || lastUserMsg.includes('database') || lastUserMsg.includes('cloud')) {
        fallbackReply = "Sawon's core engineering stack covers:\n• Frontend: React 19, TypeScript, Tailwind CSS, Three.js, Web Audio API\n• Backend & APIs: Go (Golang), Node.js, Express, REST, GraphQL, WebSockets\n• Data Layer: PostgreSQL (indexed & tuned), Redis caching, MongoDB\n• Cloud & DevOps: Docker, Kubernetes, GCP Cloud Run, AWS, CI/CD automated pipelines.";
      } else if (lastUserMsg.includes('contact') || lastUserMsg.includes('hire') || lastUserMsg.includes('email') || lastUserMsg.includes('schedule')) {
        fallbackReply = "You can contact Sawon directly via email at asawon800@gmail.com or explore his open-source work at github.com/sanonahmed. He is currently open to select contract engagements and full-time leadership roles.";
      } else if (lastUserMsg.includes('service') || lastUserMsg.includes('offer') || lastUserMsg.includes('what do you do')) {
        fallbackReply = "Sawon offers three core service pillars:\n1. Full-Stack Web Engineering: High-concurrency React 19 + TypeScript frontends with Go/Node.js microservices.\n2. 3D WebGL Experiences: Custom Three.js interactive scenes, shaders, and spatial web apps.\n3. Cloud & System Architecture: Scalable PostgreSQL, Redis, Docker, and Kubernetes infrastructure.";
      }

      return res.json({ reply: fallbackReply });
    }

    // Format contents according to @google/genai multi-turn history
    const contents = messages.map((m: { role: 'user' | 'model'; text: string }) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });

    const reply = response.text || "I am available to assist with any questions regarding Sawon's full-stack and 3D web engineering services.";
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.json({
      reply: "Sawon Ahmed provides expert Full Stack development (React, Node, Go, PostgreSQL) and 3D WebGL experiences (Three.js). You can reach him directly at asawon800@gmail.com."
    });
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
