
import step1 from "@assets/Step-11.webp";
import step2 from "@assets/Step-22.webp";
import step3 from "@assets/Step-33.webp";

const steps = [
  { img: step1, title: "Tell Us About You", desc: "Fill out a Brief Questionnaire." },
  { img: step2, title: "Connect with a Provider", desc: "Our team reviews your eligibility and recommends a personalized plan." },
  { img: step3, title: "Receive Your Prescription", desc: "Get your package delivered within 3-5 business days." },
];

export default function HowItWorks() {
  return (
    <section className="py-14 md:py-[128px]">
      <div className="how-it-works-section flex flex-col gap-12 max-w-[1160px] mx-auto px-4 sm:px-6 md:px-8 lg:px-0">
        
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-didot font-normal text-start text-[#1F5D52]">
          How it works
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-[16px] w-full h-44 sm:h-56 md:h-80 lg:h-64 overflow-hidden mb-4 sm:mb-6 md:mb-[1.875rem]">
                <img src={step.img} className="w-full h-full object-cover" alt={step.title} />
              </div>
              <div className="w-full flex flex-col items-center space-y-2 sm:space-y-3 md:space-y-4">
                <h4 className="text-lg font-bold text-[#1F5D52] text-center leading-tight">
                  {step.title}
                </h4>
                <span className="text-[#575D55] text-sm sm:text-base font-normal text-center leading-relaxed">
                  {step.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}