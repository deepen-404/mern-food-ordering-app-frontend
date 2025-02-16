import { DriverProvider } from "@/components/DriverJS/provider/DriverProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { DEFAULT_DRIVER_OPTIONS } from "@/config/DriverJS/DefaultDriverJSOptions";
import { LANDING_PAGE_TUTORIAL_KEY } from "@/config/DriverJS/LandingPage";
import React from "react";

type layoutProps = {
  children: React.ReactNode;
  showHero?: boolean;
};
const Layout: React.FC<layoutProps> = ({ children, showHero = false }) => {
  return (
    <DriverProvider  tutorialKey={LANDING_PAGE_TUTORIAL_KEY}
    driverOptions={{ ...DEFAULT_DRIVER_OPTIONS, disableActiveInteraction: true }}>
      <div className="flex flex-col min-h-screen">
        <Header />
        {showHero && <Hero />}
        <div className="container flex-1 py-10 mx-auto">{children}</div>
        <Footer />
      </div>
    </DriverProvider>
  );
};

export default Layout;
