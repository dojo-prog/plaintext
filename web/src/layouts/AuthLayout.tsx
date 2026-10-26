import { BookOpenText } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Link
          to="/"
          className="mb-6 flex items-center justify-center gap-2 font-semibold tracking-tight"
          aria-label="Dojo home"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpenText className="size-4" aria-hidden="true" />
          </span>
          <span className="text-lg">Dojo</span>
        </Link>
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;
