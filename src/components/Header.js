import React, { useState } from "react";

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section
      class="w-full fixed z-50 backdrop-blur-2xl bg-vulcan-900/20 border-b border-white/5 lg:bg-vulcan-900/0 overflow-hidden relatve"
      aria-labelledby="navigation"
      id="navigation"
    >
      <div class="w-full mx-auto relative ">
        <div
          class="flex mx-auto w-full flex-col lg:px-32 md:flex-row md:items-center md:justify-between md:px-12 px-8 py-5 relative"
          x-data="{ open: false }"
        >
          <div class="flex justify-between flex-row items-center lg:justify-start text-white">
            <a href="/" class="lg:pr-8">
              <div class="gap-3 items-center inline-flex">
                <img src="/icons/Blend-logo.png" className="w-10" />
                {/* <p class="font-bold text-2xl uppercase">Mixer.xAI </p> */}
              </div>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              class="text-white items-center inline-flex focus:outline-none justify-center focus:text-white hover:text-indigo-400 md:hidden p-2"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class={`${isOpen ? "hidden" : "inline-flex"}`}
                ></path>
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class={`${isOpen ? "inline-flex" : "hidden"}`}
                ></path>
              </svg>
            </button>
          </div>
          <nav
            class={`${
              isOpen ? "flex" : "hidden"
            } md:flex flex-col flex-grow items-center md:flex-row md:justify-end md:pb-0 `}
          >
            <a
              href="#home"
              class="text-sm font-normal px-2 hover:text-accent lg:px-6 md:px-3 py-2 text-white lg:ml-auto"
            >
              Home
            </a>{" "}
            <a
              href="#features"
              class="text-sm font-normal px-2 hover:text-accent lg:px-6 md:px-3 py-2 text-white"
            >
              Features
            </a>
            <a
              href="#tokenomics"
              class="text-sm font-normal px-2 hover:text-accent lg:px-6 md:px-3 py-2 text-white"
            >
              Tokenomics
            </a>
            <a
              href="#roadmap"
              class="text-sm font-normal px-2 hover:text-accent lg:px-6 md:px-3 py-2 text-white"
            >
              Roadmap
            </a>
            <a
              href="#"
              target="_blank"
              class="text-sm py-2 text-white focus:outline-none items-center justify-center rounded-lg bg-gradient-to-r duration-200 focus-visible:outline-black focus-visible:ring-black font-medium px-6 text-center inline-flex lg:ml-auto bg-accent hover:bg-accent/80"
            >
              Launch Dapp
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Hero;
