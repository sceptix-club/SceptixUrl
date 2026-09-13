# sceptix.in - Modern URL Shortener

![sceptix.in Screenshot](./public/ss_sceptix.png)

A modern, fast URL shortener for the sceptix club at St Joseph Engineering College. This project was forked from [kuruk.am](https://kuruk.am), moved into the independent [`dionjoshualobo/sceptix-url-shortener`](https://github.com/dionjoshualobo/sceptix-url-shortener) repository, and customized with sceptix.in's monochrome visual identity.

## ✨ Features

- **🔗 URL Shortening**: Convert long URLs into short, memorable links
- **🎨 Custom Aliases**: Create personalized short codes for your links
- **📊 Click Tracking**: Monitor how many times your links are accessed
- **🌗 Dark/Light Mode**: Seamless theme switching
- **📱 Responsive Design**: Works perfectly on all devices
- **⚡ Real-time**: Instant URL shortening with live feedback
- **🎭 Smooth Animations**: Beautiful Framer Motion transitions
- **🎨 Modern UI**: Clean black-and-white interface with an animated mesh background and Fira Sans

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Database**: [Supabase](https://supabase.com/) PostgreSQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a monochrome color system
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Background**: [Paper Design Shaders](https://github.com/paper-design/shaders-react) for animated mesh gradient
- **Typography**: [Fira Sans](https://fonts.google.com/specimen/Fira+Sans)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- Docker Desktop (for local Supabase) or a hosted Supabase project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dionjoshualobo/sceptix-url-shortener.git
   cd sceptix-url-shortener
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up local Supabase**

   ```bash
   supabase start
   ```

   The schema in `supabase/migrations/` is applied automatically. If you are using a hosted Supabase project instead, apply the migration in the Supabase SQL editor.

4. **Environment Setup**

   Create `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54325
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   To populate local key values after `supabase start`, run:

   ```bash
   supabase status
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ How It Works

### URL Shortening Process

1. **Input Validation**: User submits a long URL with optional custom alias
2. **Code Generation**: System generates a unique 6-character short code using Base62 encoding
3. **Database Storage**: URL mapping is stored in Supabase with metadata
4. **Response**: Returns shortened URL in format `https://url.sceptix.in/shortcode` when deployed with that domain

### Redirection Process

1. **Route Matching**: Next.js dynamic route `[shortCode]` captures the short code
2. **Database Lookup**: Query Supabase for the corresponding long URL
3. **Analytics Update**: Increment click counter for tracking
4. **Redirect**: Server-side redirect (with client-side fallback) to the original URL

### Code Structure

```
sceptix-url-shortener/
├── app/                    # Next.js App Router
│   ├── [shortCode]/       # Dynamic route for redirects
│   ├── api/shorten/       # URL shortening API endpoint
│   ├── layout.tsx         # Root layout with theme provider
│   └── page.tsx           # Main URL shortener interface
├── components/            # React components
│   ├── box/              # Main container wrapper
│   ├── header/           # Navigation header
│   ├── mesh-gradient.tsx # Animated background
│   └── ui/               # UI components
├── lib/
│   └── supabase.ts       # Supabase client configuration
└── public/               # Static assets
```

## 🎨 Design Features

- **Animated Background**: Dynamic black-and-white mesh gradient
- **Theme Awareness**: Automatic theme switching
- **Micro-interactions**: Hover effects, loading states, and smooth transitions
- **Responsive**: Mobile-first design approach

## 📊 Database Schema

```sql
Table: urls
├── id (UUID, Primary Key)
├── long_url (TEXT, NOT NULL)
├── short_code (TEXT, UNIQUE, NOT NULL)
├── custom_alias (TEXT, NULLABLE)
├── created_at (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
├── click_count (INTEGER, DEFAULT 0)
└── analytics_token (TEXT, UNIQUE, NULLABLE)
```

The `clicks` table stores detailed click events for analytics, including the short code,
timestamp, referrer, user agent, and optional IP address.

## 🔧 API Reference

### POST /api/shorten

Create a new short URL.

**Request Body:**

```json
{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "mylink" // optional
}
```

**Response:**

```json
{
  "shortUrl": "https://url.sceptix.in/mylink",
  "shortCode": "mylink"
}
```

**Error Responses:**

- `400`: Invalid URL or custom alias already exists
- `500`: Internal server error

## 🚀 Deployment

### Vercel (Recommended)

1. Connect `dionjoshualobo/sceptix-url-shortener` to Vercel
2. Add environment variables in Vercel dashboard
3. Add `url.sceptix.in` as the project's custom domain
4. Set `NEXT_PUBLIC_SITE_URL=https://url.sceptix.in`
5. Deploy automatically on push to the `main` branch

### Manual Deployment

1. Build the project: `npm run build`
2. Start the production server: `npm start`

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🏫 About

A modern URL shortener forked from **kuruk.am**, then moved to an independent repository and rebranded for the **sceptix club** at St Joseph Engineering College.

---

**Credits**: Forked from [kuruk.am](https://kuruk.am) | Rebranded and maintained by [sceptix.in](https://sceptix.in)
