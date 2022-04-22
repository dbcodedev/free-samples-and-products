import { Routes, Route, useNavigate } from "react-router";
import { useClientRouting } from '@shopify/app-bridge-react';
import { useMemo } from "react";
import { ManageProducts } from "../components/ManageProducts";
import { Settings } from "../components/Settings";
import { Customize } from "../components/Customize";

function AppRoutes(props) {

  const navigate = useNavigate();
  const history = useMemo(() => {
    return {
      replace: (path) => navigate(path, {replace: true})
    }
  }, []);

  useClientRouting(history);

  return (
    <Routes>
        <Route path="/" element={<ManageProducts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/customize" element={<Customize />} />
    </Routes>
  )
}

export default AppRoutes;