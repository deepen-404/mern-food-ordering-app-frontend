import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UserNameMenu from "./UserNameMenu";
import { Loader2 } from "lucide-react";

const MainNav = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loader2 className="animate-spin w-4 h-4" />;
  }
  return (
    <span className="flex items-center space-x-2">
      {isAuthenticated ? (
        <UserNameMenu />
      ) : (
        <Button
          onClick={async () => await loginWithRedirect()}
          className="text-base font-semibold hover:text-orange-500 hover:bg-gray-50"
          variant="ghost"
        >
          Log In
        </Button>
      )}
    </span>
  );
};

export default MainNav;
