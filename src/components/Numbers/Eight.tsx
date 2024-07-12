import { ComponentPropsWithoutRef } from "react";

export const Eight = (props: ComponentPropsWithoutRef<"svg">) => (
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
      <g clipPath="url(#clip0_429_10994)">
        {" "}
        <circle
          cx="12"
          cy="15"
          r="5"
          stroke="#424242"
          strokeWidth="2.5"
          strokeLinejoin="round"
        ></circle>{" "}
        <circle
          cx="12"
          cy="7"
          r="3"
          stroke="#424242"
          strokeWidth="2.5"
          strokeLinejoin="round"
        ></circle>{" "}
      </g>{" "}
      <defs>
        {" "}
        <clipPath id="clip0_429_10994">
          {" "}
          <rect width="24" height="24" fill="none"></rect>{" "}
        </clipPath>{" "}
      </defs>{" "}
    </g>
  </svg>
);
