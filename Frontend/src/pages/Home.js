import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Home.css"; 

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth"); 
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800">
      <div className="parallax">
        <div className="overlay">
          <motion.h2
            className="parallax-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Bridging the Digital Divide
          </motion.h2>
          <motion.p
            className="parallax-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Reusing technology to empower education and 
            <br></br>
            reduce e-waste.
          </motion.p>
          <motion.button
            className="donate-btn"
            whileHover={{ scale: 1.1 }}
            onClick={handleRedirect}
          >
            Get Started
          </motion.button>
        </div>
      </div>

      <section className="section">
        <h3 className="title">Our Mission</h3>
        <p className="content">
          Our mission is to bridge the digital divide by connecting surplus technology with those in need. Through donation, refurbishment, and redistribution, we aim to empower underprivileged communities, promote inclusive access to education and employment, and reduce electronic waste for a more sustainable future.
        </p>
      </section>

      <section className="section how-it-works">
        <h3 className="title">How It Works</h3>
        <div className="steps">
          {[
            { title: "Donate", description: "Individuals and organizations list their unused devices on the platform with detailed descriptions." },
            { title: "Refurbish", description: "Donated gadgets undergo quality checks, necessary repairs, and software updates to optimize their performance." },
            { title: "Distribute", description: "Verified recipients, such as students and job seekers, can request devices that match their needs." }
          ].map((step, index) => (
            <motion.div
              key={step.title}
              className="step"
              whileHover={{ scale: 1.05 }}
              onClick={handleRedirect} 
            >
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section impact">
        <h3 className="title">Our Impact</h3>
        <div className="stats">
          {[5000, 10000, 20000].map((stat, index) => (
            <motion.div key={index} className="stat" whileHover={{ scale: 1.05 }}>
              <p>{stat.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer id="contact-section" className="footer">
        <div className="contact-info">
          <h3>Contact Us</h3>
          <p>Email: nandkishorvasi@gmail.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: PCCOE Akurdi, Pune - 44</p>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Retech. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
