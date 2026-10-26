import { useState } from "react";
import {
  BookOpenText,
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCategories } from "@/features/category/hooks/useCategories";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: user, isPending: isUserPending } = useCurrentUser();
  const { data: categoryPages } = useCategories({ page: 1 });
  const logout = useLogout();
  const categories = categoryPages?.pages.flatMap((page) => page.data) ?? [];

  const handleSignOut = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          aria-label="Dojo home"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenText className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg">Dojo</span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {isUserPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open account menu"
              >
                <Avatar>
                  <AvatarFallback>
                    {user.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
                  {user.name}
                </span>
                <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserRound aria-hidden="true" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/liked-post")}>
                  <Heart aria-hidden="true" />
                  Liked posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/posts/create")}>
                  <Plus aria-hidden="true" />
                  Create post
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={logout.isPending}
                >
                  <LogOut aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/auth"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Register
              </Link>
            </div>
          )}

          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            {isMobileMenuOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          aria-label="Mobile categories"
          className="border-t px-4 py-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              All posts
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/?category=${encodeURIComponent(category.slug)}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
