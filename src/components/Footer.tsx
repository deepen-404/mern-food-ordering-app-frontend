import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="py-6 bg-orange-500">
      <div className="container flex flex-col items-center justify-between mx-auto md:flex-row">
        <span className="mb-3 text-2xl font-semibold tracking-tighter md:mb-0 text-gray-50">
          MernEats.Com
        </span>
        <span className="flex flex-col gap-1 font-semibold tracking-tight md:flex-row text-gray-50">
          <Button
            className="hover:border-white border border-transparent hover:bg-transparent"
            variant="ghost"
          >
            Privacy Policy
          </Button>
          <Button
            className="hover:border-white border border-transparent hover:bg-transparent"
            variant="ghost"
          >
            Terms of service
          </Button>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
