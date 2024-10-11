import React from "react";
import { CheckIcon } from "lucide-react";

interface AnimatedStepperProps {
  steps: string[];
  currentStep: number;
}

export function AnimatedStepper({ steps, currentStep }: AnimatedStepperProps) {
  return (
    <div className="flex items-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={`flex flex-col items-center ${
              index <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                index <= currentStep
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200"
              }`}
            >
              {index < currentStep ? <CheckIcon size={20} /> : index + 1}
            </div>
            <span className="mt-2 text-xs">{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300"
                style={{
                  width:
                    index < currentStep
                      ? "100%"
                      : index === currentStep
                      ? "50%"
                      : "0%",
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
