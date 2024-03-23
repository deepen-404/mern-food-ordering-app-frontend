import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useAuth0 } from "@auth0/auth0-react";

const MobileNavLinks = () => {
    const { logout } = useAuth0()
    return (
      <div className="flex flex-col items-center justify-center w-full gap-1">
        <Link
          to="/user-profile"
          className="w-full py-2 font-semibold text-center bg-gray-50 hover:text-orange-500"
        >
          User Profile
        </Link>
        <Separator />
        <Link
          to="/manage-restaurant"
          className="w-full py-2 font-semibold text-center bg-gray-50 hover:text-orange-500"
        >
          Manage Restaurant
        </Link>
        <Separator />
        <Button onClick={() => logout()} className="w-full bg-orange-500">
          Log Out
        </Button>
      </div>
    );
}

export default MobileNavLinks;