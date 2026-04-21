import { motion } from "framer-motion";
import { Search, Heart, ShieldCheck, Users, Clock } from "lucide-react";
import { useNavigate   } from "react-router-dom";
import AdoptablePetSlider from "./AdoptablePetSlider";
import { useAuth } from "../../contexts/AuthContext";
import "./header.css";

const stats = [
  { label: "Pets Adopted", value: "2,500+", icon: Heart },
  { label: "Lost Found", value: "1,200+", icon: Search },
  { label: "Active Rescuers", value: "8,000+", icon: Users },
  { label: "Success Rate", value: "94%", icon: ShieldCheck },
];

const steps = [
  {
    title: "Report or Register",
    desc: "Create a detailed report for a lost/found pet or register a pet for adoption with ease.",
    icon: Clock,
  },
  {
    title: "Verified by Admin",
    desc: "Every report is reviewed by our dedicated team to ensure safety and authenticity.",
    icon: ShieldCheck,
  },
  {
    title: "Safe Reunion/Adoption",
    desc: "Connect securely with owners or potential families to complete the journey.",
    icon: Users,
  },
];

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <header id="home">
        <div className="scection__container header__container">
          <div className="header__content">
            <h4>Welcome!</h4>
            <h1>Pet<br />
              <span>Rescue.</span>
            </h1>
            <h2>Find a friend. Save a life.</h2>
            <p>
              Browse adoptable pets, report lost/found pets,
              help reunite families.
            </p>

            {!user && (
            <div className="header__btn">
              <button onClick={() => navigate("/Signup")}>
                Get Involved!
                <span>
                  <i className="ri-arrow-right-s-fill"></i>
                </span>
              </button>
            </div>)}
          </div>

          <div className="header__image">
            <img
              src="paw1.png"
              alt="header-bg"
              className="header__image-bg"/>
            <img src="dog1.png" alt="header" />
          </div>

          <div className="header__adopt-card"
            onClick={() => navigate("/adopt")}>
            <AdoptablePetSlider />
          </div>
        </div>

        <div className="header__bottom">
          <div className="header__adopt-card-mobile"
            onClick={() => navigate("/adopt")}>
            <AdoptablePetSlider />
          </div>
        </div>
        <div className="header__bottom2">
          
        </div>
      </header>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="stat-card1">
                <div className="stat-icon1">
                  <stat.icon size={24} />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="how-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="how-header">
            <h2>How PetRescue Works</h2>
            <p>
              Our simple process makes it easy to report lost pets or find your new companion.
            </p>
          </motion.div>

          <div className="how-grid">
            {steps.map((step, i) => (
              <motion.div
              key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="how-card">
                <div className="how-icon">
                  <step.icon size={32} />
                </div>

                <h3>{step.title}</h3>
                <p>{step.desc}</p>

                <div className="how-number">0{i + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
