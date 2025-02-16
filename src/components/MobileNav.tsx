import { CircleUserRound, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";

const MobileNav = () => {
    const { isAuthenticated, loginWithRedirect, user } = useAuth0()
    return (
        <nav>
            <Sheet>
                <SheetTrigger>
                    <Menu
                        className="text-orange-500" />
                </SheetTrigger>
                <SheetContent
                    className="space-y-3">
                    <SheetTitle
                        className="text-base md:text-lg lg:text-xl">
                        {isAuthenticated ? (
                            <span className="flex items-center gap-1 text-gray-900 hover:text-orange-500">
                                <span
                                    className="w-6 overflow-hidden text-sm rounded-full font- normal aspect-square">
                                    {user?.picture ? (
                                        <img src={user?.picture} alt={user.family_name && (user?.given_name + user?.family_name) || "User Photo"} />
                                    ) : (
                                        <CircleUserRound
                                            className="text-sm" />
                                    )}

                                </span>
                                <span
                                    className="hidden text-xs font-normal sm:block">
                                    {user?.email}
                                </span>
                            </span>
                        ) : (
                            <span>
                                Welcome to MernEats
                            </span>)}

                    </SheetTitle>
                    <Separator />
                    <SheetDescription className="flex">
                        {isAuthenticated ? (
                            <MobileNavLinks />
                        ) : (
                            <Button
                                onClick={async () => await loginWithRedirect()}
                                className="flex-1 font-semibold bg-orange-500">
                                LogIn
                            </Button>
                        )}
                    </SheetDescription>
                </SheetContent>
            </Sheet>
        </nav >
    );
}

export default MobileNav;