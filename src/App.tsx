import { Button } from "@/components/ui/button";
import ApiHealthCheck from "./components/ApiHealthCheck";

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
      <footer className="w-full bg-gray-100 border-t-2 border-gray-300 p-4 mt-12">
        <div className="container mx-auto px-4">
          <ApiHealthCheck />
        </div>
      </footer>
    </div>
  )
}

export default App;
