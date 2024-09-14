import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-white border-b-2 border-gray-300 p-6 mb-12 shadow-md">
        <h1 className="text-3xl font-bold text-center">Silver Task Manager</h1>
      </header>
      <main className="flex-grow flex flex-col items-center p-4">
        <div className="flex flex-col sm:flex-row gap-6">
          <Button className="text-xl py-6 px-8 w-64">Sign Up</Button>
          <Button className="text-xl py-6 px-8 w-64">Sign In</Button>
        </div>
      </main>
    </div>
  )
}

export default App;
