import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Search from "./components/Search";
import Services from "./components/Services";
import WhyVerixa from "./components/WhyVerixa";
import AIAssistant from "./components/AIAssistant";
import Footer from "./components/Footer";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef5ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Navbar />
      <Hero />
      <Search />
      <Services />
      <WhyVerixa />
      <AIAssistant />
      <Footer />
    </div>
  );
}

export default App;