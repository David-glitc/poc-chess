import { GameCreation } from "~/app/_components/GameCreation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-center">
            Chess Game
          </h1>
          <p className="text-2xl opacity-80">
            Play chess with your friends in real-time
          </p>
        </div>

        <GameCreation />

        <div className="text-center opacity-70">
          <h2 className="text-xl font-semibold mb-2">How to play</h2>
          <ol className="list-decimal text-left space-y-2 max-w-md mx-auto">
            <li>Create a new game or join an existing one with a game ID</li>
            <li>Share the game link with your opponent</li>
            <li>White moves first, then players alternate turns</li>
            <li>Make your moves by clicking on a piece and then its destination</li>
            <li>The game automatically detects check, checkmate, and draws</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
