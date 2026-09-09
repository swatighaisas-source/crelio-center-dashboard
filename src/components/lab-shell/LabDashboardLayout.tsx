import { createContext, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { InflowProvider } from "../../context/InflowContext";
import { PaymentModesProvider } from "../../context/PaymentModesContext";
import { OrderPaymentListProvider } from "../../context/OrderPaymentListContext";
import { AccountManagementProvider } from "../../context/AccountManagementContext";
import { LabAoeConfigProvider } from "../../context/LabAoeConfigContext";
import { InflowModalsHost } from "../inflow/InflowModalsHost";
import { GlobalTopBar } from "./GlobalTopBar";

interface SidebarCollapseContextValue {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

export function useSidebarCollapse() {
  const ctx = useContext(SidebarCollapseContext);
  if (!ctx) {
    return {
      collapsed: false,
      setCollapsed: () => undefined,
      toggleCollapsed: () => undefined,
    };
  }
  return ctx;
}

export function LabDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const value: SidebarCollapseContextValue = {
    collapsed,
    setCollapsed,
    toggleCollapsed: () => setCollapsed((c) => !c),
  };

  return (
    <SidebarCollapseContext.Provider value={value}>
      <PaymentModesProvider>
        <OrderPaymentListProvider>
          <AccountManagementProvider>
            <LabAoeConfigProvider>
            <InflowProvider>
              <div className={`lab-shell${collapsed ? " lab-shell--sidebar-collapsed" : ""}`}>
                <GlobalTopBar />
                <Outlet />
                <InflowModalsHost />
              </div>
            </InflowProvider>
            </LabAoeConfigProvider>
          </AccountManagementProvider>
        </OrderPaymentListProvider>
      </PaymentModesProvider>
    </SidebarCollapseContext.Provider>
  );
}
