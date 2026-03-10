import logo from "../assets/LifeRxmd.svg";


export default function Navbar() {
  return (
    <header className="w-full bg-transparent py-8 md:pt-[40px] md:pb-[20px] max-w-[1160px] mx-auto relative z-[100]">
      <div className="relative">
        <div className="flex items-center justify-between">
          <a className="flex items-center px-8 lg:px-2 flex-shrink-0" href="/">
            <img
              alt="LifeRx MD Logo"
              loading="lazy"
              width="120"
              height="40"
              className="w-[90px] md:w-[120px] md:h-[40px]"
              src={logo}
              style={{ color: "transparent" }}
            />
          </a>

          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8 md:gap-[49.42px] md:space-x-0">
            <a className="text-[#545454] text-[18px]" href="/">Home</a>
            <a className="text-[#545454] text-[18px]" href="/">Treatments</a>
            <a className="text-[#545454] text-[18px]" href="/">Reviews</a>
            <a className="text-[#545454] text-[18px]" href="/">Blog</a>
            <a className="text-[#545454] text-[18px]" href="/">FAQ</a>
          </nav>

          <div className="lg:flex flex-shrink-0">
            <button
              type="button"
              className="w-[106px] text-center py-[10px] px-[30px] customebtn-bg text-white rounded-[10px] text-[16px] font-normal"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}