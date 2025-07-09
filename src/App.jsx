import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext"; // 👈
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <CarritoProvider> {/* 👈 AQUI */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
