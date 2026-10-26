type EmptyStateProps = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <section className="rounded-xl border border-dashed px-6 py-12 text-center">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </section>
  );
};

export default EmptyState;
