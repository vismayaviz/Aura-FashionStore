const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-4 text-sm text-center">
      <div className="container-custom">
        <p>&copy; {new Date().getFullYear()} AURA. Premium Fashion Store.</p>
      </div>
    </footer>
  );
};

export default Footer;