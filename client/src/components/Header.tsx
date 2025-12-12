import "./Header.css";
import Logo from "./Logo";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="Header">
      <div className="header-container">
        <Logo />
        <Navbar />
      </div>
    </header>
  );
}
