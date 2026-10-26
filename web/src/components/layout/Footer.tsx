import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" className="font-semibold text-foreground">
          Dojo
        </Link>
        <p>Share what you learn. © {currentYear} Dojo.</p>
      </div>
    </footer>
  );
};

export default Footer;
