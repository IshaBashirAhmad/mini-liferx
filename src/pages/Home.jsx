import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyLifeRx from "../components/WhyLifeRx";
import HowItWorks from "../components/HowItWorks";

export default function Home() {
  return (
    <div className="main flex flex-col">
      <Navbar />
      <HeroSection />
      <WhyLifeRx />
      <HowItWorks />
    </div>
  );
}