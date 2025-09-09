import { Heart, LogIn, UserCircle2, UserPlus2 } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import LogOut from "../LogOut";
import Cookies from "universal-cookie";

const Profile = () => {
  const cookies = new Cookies();
  const [isOpen, setIsOpen] = useState(false);
  if (cookies.get("Bearer")) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <UserCircle2 size={32} cursor={"pointer"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" side="bottom" align="end">
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={"/profile"}
              className="text-lg flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle2 className="size-7" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={"/favorite"}
              className="text-lg flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="size-7" />
              Favorite
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpen(false)}>
            <LogOut parent="menu" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <UserCircle2 size={32} cursor={"pointer"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" side="bottom" align="end">
          <DropdownMenuLabel>Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={"/login"}
              className="text-lg flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="size-7" />
              Log in
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={"/sign-up"}
              className="text-lg flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus2 className="size-7" />
              Sign Up
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};
export default Profile;
