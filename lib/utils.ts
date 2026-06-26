import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currencySymbol = "$") {
    const priceStr = price.toString();

    return priceStr.length <= 3
        ? `${currencySymbol} ${priceStr}`
        : `${currencySymbol} `.concat(
              price
                  .toString()
                  .split("")
                  .reverse()
                  .map((value, index) => {
                      if (index == 0) return value;
                      return index % 3 == 0 ? value + "," : value;
                  })
                  .reverse()
                  .join(""),
          );
}
