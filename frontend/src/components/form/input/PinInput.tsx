import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";

interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export default function PinInput({ length = 6, value, onChange, isLoading = false }: PinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Convert the string into an array of length `length`
  const pinArray = value.split("").concat(Array(length).fill("")).slice(0, length);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    if (!val) return;

    // We only take the last character typed (in case they type faster than re-render)
    const char = val.charAt(val.length - 1);
    const newPinArray = [...pinArray];
    newPinArray[index] = char;
    
    onChange(newPinArray.join(""));

    // Move to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newPinArray = [...pinArray];
      
      // If there's a value in the current input, clear it
      if (newPinArray[index]) {
        newPinArray[index] = "";
        onChange(newPinArray.join(""));
      } else if (index > 0) {
        // Otherwise, clear the previous and move focus back
        newPinArray[index - 1] = "";
        onChange(newPinArray.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);
    
    // Focus the next empty input, or the last one
    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-4 my-6" dir="ltr">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={value[i] ? 2 : 1} // Trick to allow natural replacement
          value={pinArray[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          disabled={isLoading}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-gray-50 dark:bg-gray-800 border ${
            pinArray[i] ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-300 dark:border-gray-700"
          } rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 transition-all text-gray-800 dark:text-gray-100 placeholder-transparent disabled:opacity-50`}
        />
      ))}
    </div>
  );
}
