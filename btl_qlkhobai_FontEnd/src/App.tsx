import { useState } from "react";
import Header from "./component/header";
import Sidebar from "./component/sidebar";
import Footer from "./component/footer";

import Containers from "./pages/Containers";
import ContainerHistory from "./pages/Containerhistory";
import ItemTypes from "./pages/ItemTypes";
import Warehouses from "./pages/Warehouses";

import "./App.css";
import Vehicles from "./pages/Vehicles";
import Trips from "./pages/Trips";
import Ports from "./pages/Ports";
import Customers from "./pages/Customers";
import Contracts from "./pages/Contracts";
import Costs from "./pages/Costs";
import Invoices from "./pages/Invoices";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";

function App() {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [module, setModule] = useState<string>("dashboard");

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderModule = () => {
    switch (module) {

      case "containers":
        return <Containers />;

      case "containerhistory":
        return <ContainerHistory />;
      case "itemtypes":
          return <ItemTypes />;
      case "warehouses":
          return <Warehouses />;
      case "vehicles":
          return <Vehicles />;
      case "trips":
          return <Trips/>
      case "ports":
        return <Ports/>
      case "customers":
        return <Customers/>
      case "contracts":
        return <Contracts/>
      case "costs":
        return <Costs/>
      case "invoices":
        return <Invoices/>
      case "users":
        return <Users/>
      case "dashboard":
        return <Dashboard/>

      default:
        return <h2>Chưa có dữ liệu</h2>;
    }
  };

  return (
    <div className="app">
  
      <Header user={user} onLogout={handleLogout} />
  
      <div className="container">
  
        <Sidebar onSelect={setModule} />
  
        <div className="main-content">
          {renderModule()}
        </div>
  
      </div>
  
      <Footer />
  
    </div>
  );
}

export default App;