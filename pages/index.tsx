import {
  ShoppingCartOutlined,
  DollarOutlined,
  BookOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  MenuProps,
  Typography,
} from "antd";
import Sider from "antd/lib/layout/Sider";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import Head from 'next/head';
import ProductsPage from "./products";
import OrdersPage from "./orders";
import KitchenPage from "./kitchen";
import CashierPage from "./cashier";

const { Title, Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

// Sidebar Menu
const items: MenuItem[] = [
  getItem("Menu", "menu", <BookOutlined />),
  getItem("Orders", "orders", <ShoppingCartOutlined />,),
  getItem("Kitchen", "kitchen", <ShopOutlined />),
  getItem("Cashier", "cashier", <DollarOutlined />),
];

const Dashboard = () => {
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(<ProductsPage/>);
  const [sidebarMenu, setSidebarMenu] = useState(items);

  function handleMenuClick(key: React.Key) {
    if (key === "menu") {
      setCurrentComponent(<ProductsPage />);
    } else if(key === "orders") {
      setCurrentComponent(<OrdersPage />);
    } else if(key === "kitchen") {
      setCurrentComponent(<KitchenPage />);
    } else if(key === "cashier") {
      setCurrentComponent(<CashierPage />);
    } 
  }

  function renderCurrentComponents() {
      return (
        <>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            {currentComponent}
          </Content>
        </>
      );
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layout hasSider>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="p-4">
            <Title level={5} style={{ fontSize: 20, color: "#00f661" }}>
              Resto System
            </Title>
          </div>
          <Menu
            defaultSelectedKeys={["menu"]}
            defaultOpenKeys={["menu"]}  
            mode="inline"
            theme="dark"
            items={sidebarMenu}
            onClick={({ key }) => handleMenuClick(key)}
          />
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header
            style={{
              background: "#FFF",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
          </Header>
          {renderCurrentComponents()}
        </Layout>
      </Layout>
    </>
  );
};

export default Dashboard;
