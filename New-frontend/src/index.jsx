import ReactDOM from "react-dom/client";
import { BrowserRouter as Router} from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import "remixicon/fonts/remixicon.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <AuthProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
    </AuthProvider>
  </Router>
);
