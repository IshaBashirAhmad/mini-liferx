import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WhyLifeRx from "../components/WhyLifeRx";
import HowItWorks from "../components/HowItWorks";
import Posts from "../components/Posta";    

export default function Home() {
  return (
    <div className="main flex flex-col">
      <HeroSection />
      <WhyLifeRx />
      <HowItWorks />
      <Posts />
    </div>
  );
}