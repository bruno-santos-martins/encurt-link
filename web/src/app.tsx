
import { AppRoutes } from "./router"
import { BrowserRouter } from "react-router-dom";

export function App() {
  return (
    <main className="h-dvh flex flex-col items-center justify-center p-4">
      <BrowserRouter>
        <AppRoutes></AppRoutes>
      </BrowserRouter>
    </main>
  )
}

export default App
