import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Balances from "./pages/Balances";
import Correlations from "./pages/Correlations";
import Models from "./pages/Models";
import Alerts from "./pages/Alerts";
import Admin from "./pages/Admin";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="balances" element={<Balances />} />
          <Route path="correlaciones" element={<Correlations />} />
          <Route path="modelos" element={<Models />} />
          <Route path="alertas" element={<Alerts />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* Redirect root to landing */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
