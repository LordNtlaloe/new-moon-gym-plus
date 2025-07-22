import {
    Home,
    SmartphoneNfc,
    UserPlus,
    Handshake,
    Calendar,
    Box,
    Users,
    Star,
    LayoutDashboardIcon
  } from "lucide-react";
  
  export const menuItems = [
    {
      id: 1,
      label: "Home",
      href: "/",
      icon: Home,
      current: true
    },
    {
      id: 2,
      label: "Products",
      href: "/products",
      icon: Handshake,
      current: false
    },
    {
      id: 3,
      label: "Contact",
      href: "/contact",
      icon: SmartphoneNfc,
      current: false
    },
    {
      id: 4,
      label: "About",
      href: "/about",
      icon: UserPlus,
      current: false
    },
  ];
  
  export const dashboardMenu = [
    {
      id: 1,
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboardIcon,
      current: false,
      color: "#202020"
    },
    {
      id: 2,
      label: "Members",
      href: "/admin/members",
      icon: Users,
      current: false,
      color: "#1E1E2C"
    },
    {
      id: 3,
      label: "Waiting List",
      href: "/admin/waiting-list",
      icon: Handshake,
      current: false,
      color: "#20283E"
    },
    {
      id: 4,
      label: "Consultations",
      href: "/admin/consultations",
      icon: Box,
      current: false,
      color: "#25476A"
  
    },
    {
      id: 5,
      label: "Online Sessions",
      href: "/admin/online-session",
      icon: Calendar,
      current: false,
      color: "#191C24"
    },
    {
      id: 6,
      label: "Users",
      href: "/admin/users",
      icon: Users,
      current: false,
      color: "#1E1E2C"
    },
  ];