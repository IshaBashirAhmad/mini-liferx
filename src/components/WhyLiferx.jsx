
import c11 from "@assets/C11.svg";
import c22 from "@assets/C22.svg";
import c44 from "@assets/C44.svg";
import c55 from "@assets/C55.svg";

const features = [
  { icon: c22, label: "Online consultation" },
  { icon: c44, label: "Licensed Providers" },
  { icon: c11, label: "Prescribed by Licensed Providers" },
  { icon: c55, label: "24/7 Customer Support" },
];

export default function WhyLifeRx() {
  return (
    <section className="w-full flex items-center justify-center bg-[#1f5d52] rounded-2xl mx-auto">
      <div className="flex flex-col max-w-[1160px] items-center gap-8 py-8 sm:py-12 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0">
        <div className="w-full">
          <h1 className="text-[#B9D8AD] text-center sm:text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal font-didot leading-tight sm:leading-[1.2] lg:leading-[101px]">
            Why LifeRx.md?
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Left - Description */}
            <div className="w-full lg:w-auto lg:max-w-[390px] xl:max-w-[420px]">
              <p className="text-[#FBF6EC] text-base sm:text-lg md:text-xl lg:text-[1.40rem] leading-7 sm:leading-[30px] md:leading-[34px] lg:leading-[44px] font-normal text-center sm:text-left">
                LifeRx.md connects you with licensed providers for personalized
                healthcare solutions that treat the whole you.
              </p>
            </div>

            {/* Right - Feature Cards */}
            <div className="w-full lg:flex-1 lg:flex lg:justify-end">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-x-8 gap-y-3 w-full sm:w-auto mx-auto lg:mx-0">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#00000040] rounded-2xl h-16 sm:h-18 md:h-20 p-4 sm:p-5 flex items-center justify-start space-x-4 sm:space-x-5 hover:bg-[#00000060] transition-colors w-full lg:w-[320px] xl:w-[340px]"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={feature.icon}
                        className="w-8 h-6 sm:w-9 sm:h-7 md:w-10 md:h-8"
                        alt={feature.label}
                      />
                    </div>
                    <span className="text-[#FBF6EC] text-sm sm:text-base md:text-lg font-medium leading-tight">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}