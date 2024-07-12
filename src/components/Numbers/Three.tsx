import { ComponentPropsWithoutRef } from "react";

export const Three = (props: ComponentPropsWithoutRef<"svg">) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <g clipPath="url(#clip0_429_10996)">
        {" "}
        <path
          d="M8 19.0004C8.83566 19.6281 9.87439 20 11 20C13.7614 20 16 17.7614 16 15C16 12.2386 13.7614 10 11 10L16 4H8"
          stroke="#871a1a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>{" "}
      </g>{" "}
      <defs>
        {" "}
        <clipPath id="clip0_429_10996">
          {" "}
          <rect width="24" height="24" fill="none"></rect>{" "}
        </clipPath>{" "}
      </defs>{" "}
    </g>
  </svg>
);
