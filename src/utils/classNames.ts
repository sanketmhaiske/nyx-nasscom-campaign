import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines classNames and tailwind classes into a single string.
 *
 * @description This function takes an arbitrary number of classNames or tailwind classes and uses `clsx` from `clsx` library to combine them. It then uses `twMerge` from `tailwind-merge` to merge tailwind classes with a higher priority. Finally, it returns the combined string of classNames and tailwind classes.
 *
 * @param {...ClassValue[]} args - An array of classNames or tailwind classes to combine.
 * @returns {string} The combined string of classNames and tailwind classes.
 *
 * @example
 * // Assuming clsx and twMerge are implemented elsewhere
 * const buttonClasses = classNames('btn', 'btn-primary', 'hover:bg-blue-500');
 * console.log(buttonClasses); // Output: "btn btn-primary hover:bg-blue-500" (assuming clsx returns the combined classNames)
 */
export default function classNames(...args: ClassValue[]) {
  return twMerge(clsx(args));
}
