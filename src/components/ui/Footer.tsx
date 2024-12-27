

const Footer = () => {
  return (
    <footer className="p-6 bg-gray-900 text-center">
      <nav className="flex justify-center space-x-4">
        <a href="/about" className="hover:text-primary">About</a>
        <a href="/features" className="hover:text-primary">Features</a>
        <a href="/resources" className="hover:text-primary">Resources</a>
        <a href="/contact" className="hover:text-primary">Contact</a>
      </nav>
    </footer>
  );
};

export default Footer;
