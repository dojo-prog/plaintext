import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

const ErrorState = ({
  title = "We couldn’t load this content",
  description = "Something went wrong while loading the page. Please try again.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) => {
  return (
    <section
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </section>
  );
};

export default ErrorState;
