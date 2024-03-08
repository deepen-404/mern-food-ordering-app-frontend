import { useAuth0 } from "@auth0/auth0-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const UserNameMenu = () => {
    const { user, logout } = useAuth0()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="flex items-center px-3 font-semibold hover:text-orange-500">
                <button className="flex items-center gap-1 text-gray-900 hover:text-orange-500">

                    <span
                        className="w-8 overflow-hidden text-sm rounded-full font- normal aspect-square">
                        {user?.picture ? (
                            <img src={user?.picture} alt={user.family_name && (user?.given_name + user?.family_name) || "User Photo"} />
                        ) : (
                            <CircleUserRound
                                className="text-sm" />
                        )}

                    </span>
                    <span
                        className="text-sm font-normal">
                        {user?.email}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link
                        to="/user-profile"
                        className="font-semibold hover:text-orange-500">
                        User Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Button
                        onClick={() => logout()}
                        className="flex flex-1 font-semibold bg-orange-500">
                        Log Out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserNameMenu;