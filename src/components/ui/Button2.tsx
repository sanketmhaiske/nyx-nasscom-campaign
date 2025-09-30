import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva("nyx-button", {
  variants: {
    intent: {
      primary: [
        "border",
        "border-amber-400",
        "text-white",
        "hover:text-black",
        "hover:bg-amber-300 hover:shadow-glow"
      ],
      secondary: [
        "text-black",
        "border",
        "border-black",
        "hover:bg-black",
        "hover:text-white"
      ],
    },
    size: {
      small: ["text-sm", "font-light", "px-2", "py-1"],
      normal: ["text-base", "font-normal", "px-5", "py-2"],
      medium: ["text-lg", "font-medium", "px-5", "py-2"],
    },
    rounded: {
      normal: ["rounded-md"],
      full: ["rounded-full"]
    }
  },
  compoundVariants: [{ intent: ["primary", "secondary"], size: ["small", "normal", "medium"], rounded: ["normal", "full"], class: "text-center" }],
  defaultVariants: {
    intent: "primary",
    size: "normal",
    rounded: "normal"
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof button> { }

const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  rounded,
  children,
  ...props
}) => <button className={twMerge(button({ intent, size, rounded, className }))} {...props}>{children}</button>;

export default Button;