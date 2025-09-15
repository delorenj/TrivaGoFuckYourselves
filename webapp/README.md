# TrivaGoFuckYourselves: An Investigation

This is a React-based web application that serves as an interactive infographic detailing consumer complaints and regulatory action against the travel company Trivago. It includes a feature using the Google Gemini API to generate formal complaint letters for users based on their experiences.

This project was bootstrapped with Vite and uses TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- Node.js (v18 or later recommended)
- npm, yarn, or pnpm
- A Google Gemini API Key

## Getting Started

### 1. Clone the Repository

Clone your repository to your local machine:
\`\`\`bash
git clone https://github.com/delorenj/TrivaGoFuckYourselves.git
cd TrivaGoFuckYourselves
\`\`\`

### 2. Install Dependencies

Install the project dependencies using your preferred package manager:
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

This project requires a Google Gemini API key to function.

1.  Create a new file named \`.env\` in the root of your project.
2.  Open the \`.env\` file and add your API key in the following format:

    \`\`\`
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
    \`\`\`
    *Replace \`YOUR_GEMINI_API_KEY_HERE\` with your actual key.*

    **Note:** The \`VITE_\` prefix is required by Vite to expose the environment variable to the client-side code.

### 4. Run the Development Server

Start the local development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) (or whatever port is indicated in your terminal) to view the application in your browser.

## Building for Production

To create a production-ready build of the application, run:
\`\`\`bash
npm run build
\`\`\`

This command will generate a \`dist\` folder in the project root containing the optimized, static assets for your website. You can deploy the contents of this folder to any static hosting provider like Vercel, Netlify, or GitHub Pages.
