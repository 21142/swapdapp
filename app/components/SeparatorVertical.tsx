const SeparatorVertical = () => {
  return (
    <div className="hidden md:block">
      <svg
        width="1"
        height="34"
        viewBox="0 0 1 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="1"
          height="34"
          fill="url(#paint0_linear_1219_21793)"
        ></rect>
        <defs>
          <linearGradient
            id="paint0_linear_1219_21793"
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ECECEC" stopOpacity="0"></stop>
            <stop offset="0.515625" stopColor="#D9D9D9"></stop>
            <stop offset="1" stopColor="#D9D9D9" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default SeparatorVertical;
