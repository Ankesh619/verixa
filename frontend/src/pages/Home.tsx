import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Search from "../components/Search";
import Services from "../components/Services";
import WhyVerixa from "../components/WhyVerixa";
import AIAssistant from "../components/AIAssistant";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Search />
      <Services />
      <WhyVerixa />
      <AIAssistant />
      <Footer />
      <AIChat />
    </>
  );
}

export default Home;