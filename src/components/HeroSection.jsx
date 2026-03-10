
import weightlossMed from "../assets/weightloss-med.png";
import boostPerformance from "../assets/BoostPerformance.webp";
import hairloss from "../assets/hairloss.webp";


const ArrowButton = () => (
  <button
    className="arrow-btn w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ background: "#1a7a5e" }}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14M12 5l7 7-7 7"
      />
    </svg>
  </button>
);

export default function HeroSection() {
  return (
    <section className="w-full radial-gradient">
      <div className="section-div max-w-[1160px] mx-auto mt-[40px] md:mt-0 lg:py-16 py-4 md:py-12 px-4 lg:pb-0 lg:px-0 lg:pt-[107px]">
        
        <div className="section-heading md:mb-6 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-didot">
            Have Better Health
          </h1>
        </div>
        <div className="w-full space-y-6 md:space-y-8 mt-2.5 sm:mt-0 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:pb-[128px] lg:pt-[60px]">
          <div className="card bg-white rounded-3xl p-8 flex flex-col justify-center lg:h-[570px] relative overflow-hidden cursor-pointer row-span-2 shadow-sm transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center">
              <div className="relative">
                <img src={weightlossMed} alt="Weight Loss" />
              </div>
            </div>
            <div className="flex flex-col justify-between flex-1">
              <div className="text-black text-3xl font-normal text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-normal text-center mt-5">
                  Weight Loss with GLP-1s
                </h2>
              </div>
              <div className="w-full flex items-end justify-end">
                <ArrowButton />
              </div>
            </div>
          </div>
          <div className="card bg-white rounded-3xl p-7 flex flex-col items-center justify-between shadow-sm cursor-pointer transform hover:scale-105 transition-all duration-300 lg:h-[270px]">
            <div className="w-full items-center flex justify-between flex-col md:flex-row flex-1 pr-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-normal text-center mt-5">
                Boost Sexual <br /> Performance
              </h3>
              <div className="flex-shrink-0">
                <img src={boostPerformance} alt="Boost Performance" />
              </div>
            </div>
            <div className="w-full flex justify-end items-end">
              <ArrowButton />
            </div>
          </div>
          <div className="card bg-white rounded-3xl p-7 flex flex-col items-center justify-between shadow-sm cursor-pointer transform hover:scale-105 transition-all duration-300 lg:h-[270px]">
            <div className="w-full items-center flex justify-between flex-col md:flex-row flex-1 pr-4">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-normal text-center mt-5">
                Fight Hair Loss
              </h3>
              <div className="flex-shrink-0">
                <img src={hairloss} alt="Hair Loss" />
              </div>
            </div>
            <div className="w-full flex justify-end items-end">
              <ArrowButton />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
