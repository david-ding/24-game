import Game from "@/components/game"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-800">24 Game</h1>
      <p className="text-center text-gray-600 mb-8 max-w-md">
        Use all four numbers exactly once with basic arithmetic operations (+, -, ×, ÷) to make 24.
      </p>
      <Game />
    </main>
  )
}

