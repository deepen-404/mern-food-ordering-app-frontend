import { Link } from "react-router-dom";
import MobileNav from "./MobileNav";
import MainNav from "./MainNav";

const Header = () => {
  return (
    <header className="py-6 border-b-2 shadow-md border-b-orange-500">
      <div className="container flex items-center justify-between mx-auto">
        <Link
          className="text-2xl font-semibold tracking-tighter text-orange-500"
          to="/"
        >
          MernEats.Com
        </Link>
        <div className="md:hidden">
          <MobileNav />
        </div>
        <div className="hidden md:block">
          <MainNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
