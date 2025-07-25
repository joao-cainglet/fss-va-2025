import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    sessionStorage.setItem('path', pathname);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="flex-1 flex flex-col">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
