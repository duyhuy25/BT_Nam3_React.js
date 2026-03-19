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

function App() {

  const [module, setModule] = useState<string>("containers");

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

      default:
        return <h2>Chưa có dữ liệu</h2>;
    }
  };

  return (
    <>
      <Header />

      <div className="container">

        <Sidebar onSelect={setModule} />

        <div className="main-content">
          {renderModule()}
        </div>

      </div>

      <Footer />
    </>
  );
}

export default App;