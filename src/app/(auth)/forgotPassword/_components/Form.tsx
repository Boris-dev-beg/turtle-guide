"use client";
import { useState } from "react";
import AccountVerification from "./steps/AccountVerification";
import CodeVerfication from "./steps/CodeVerfication";
import NewPassword from "./steps/NewPassword";
import Done from "./steps/Done";

export default function ForgotPasswordForm() {
  // ! States
  const [currentStep, setCurrentStep] = useState<number>(1);

  // ! Functions
  const handleClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  
  // ! Render
  return (
    <>
      {currentStep === 1 && <AccountVerification OnClick={handleClick} />}
      {currentStep === 2 && <CodeVerfication OnClick={handleClick} />}
      {currentStep === 3 && <NewPassword OnClick={handleClick} />}
      {currentStep === 4 && <Done />}
    </>
  );
}
