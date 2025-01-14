# Real-time Chess Game

A modern, real-time chess game built with Next.js, tRPC, and WebSocket.

## Features

- Real-time multiplayer chess
- Move validation and game rules
- Game analysis and move history
- Connection strength monitoring
- Beautiful black and pink UI theme
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- tRPC for type-safe APIs
- Socket.IO for real-time communication
- Tailwind CSS for styling
- Framer Motion for animations
- Chess.js for game logic

## Development

1. Clone the repository:
```bash
git clone <repository-url>
cd poc-chess
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Create a new project
   - Import your repository
   - Select the "Next.js" framework preset

3. Configure environment variables:
   ```
   NEXT_PUBLIC_WEBSOCKET_URL=your-vercel-domain.vercel.app
   ```

4. Deploy:
   - Vercel will automatically build and deploy your application
   - The WebSocket server will be deployed as a serverless function

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Playing the Game

1. Create a new game or join an existing one with a game ID
2. Share the game link with your opponent
3. White moves first, then players alternate turns
4. The game automatically detects check, checkmate, and draws

## License

MIT
