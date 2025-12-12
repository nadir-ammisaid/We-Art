import "./Logo.css";
import logoWeArt from "../assets/images/logoWeArt.png";

function Logo() {
  return (
    <div className="logoWeArt">
      <img src={logoWeArt} alt="WeArt Logo" />
      <span className="logo-text">WEART</span>
    </div>
  );
}

export default Logo;
