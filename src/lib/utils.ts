import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateHandler(date:string) {
  const myDate = new Date(date);
  const year = myDate.getFullYear()
  const month = myDate.getMonth() +1
  const day = myDate.getDate()
  return `${day}/${month}/${year}`
}