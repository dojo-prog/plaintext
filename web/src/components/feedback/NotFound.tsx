import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 size-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute left-[15%] top-[20%] size-2 rounded-full bg-primary/20" />
        <div className="absolute right-[18%] top-[30%] size-3 rounded-full bg-primary/10" />
        <div className="absolute bottom-[20%] left-[25%] size-3 rounded-full bg-primary/10" />
        <div className="absolute bottom-[25%] right-[20%] size-2 rounded-full bg-primary/20" />
      </div>

      <div className="flex max-w-xl flex-col items-center text-center">
        {/* Icon */}
        <div className="relative mb-4">
          <div className="absolute inset-0 scale-125 rounded-full bg-primary/5 blur-xl" />

          <div className="relative flex size-24 items-center justify-center rounded-full border bg-background shadow-sm shadow-primary">
            <SearchX className="size-10 text-primary" />
          </div>
        </div>

        {/* 404 */}
        <p className="text-7xl font-black tracking-tighter text-primary/59 sm:text-8xl py-2">
          404
        </p>

        <div className="-mt-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
            Looks like this page took a wrong turn. The page you're looking for
            doesn't exist or may have been moved somewhere else.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="sm:min-w-32"
          >
            <ArrowLeft className="mr-2 size-4" />
            Go Back
          </Button>

          <Button size="lg" className="sm:min-w-36 text-white">
            <Link to="/" className="flex items-center">
              <Home className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Small hint */}
        <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-px w-8 bg-border" />
          <span>Dojo</span>
          <span className="h-px w-8 bg-border" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
