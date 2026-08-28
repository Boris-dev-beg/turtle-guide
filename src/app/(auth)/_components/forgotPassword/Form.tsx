"use client";
import { useState } from "react";
import AccountVerification from "./elements/steps/AccountVerification";
import CodeVerfication from "./elements/steps/CodeVerfication";
import NewPassword from "./elements/steps/NewPassword";
import Done from "./elements/steps/Done";
import { FormProvider, useForm } from "react-hook-form";
import {
  ForgotPasswordSchema,
  ForgotPasswordType,
} from "../../_schema/forgotPassword.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotPasswordForm() {
  // ! States
  const [currentStep, setCurrentStep] = useState<number>(1);
  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(ForgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // ! Functions
  const handleClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  const handleSubmit = async (data: ForgotPasswordType) => {
    // API reset password
    console.log("Datas:", data);
  };
  console.log("form Errors:", form.getErrors);

  // ! Render
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {currentStep === 1 && <AccountVerification OnClick={handleClick} />}
        {currentStep === 2 && <CodeVerfication OnClick={handleClick} />}
        {currentStep === 3 && <NewPassword />}
        {currentStep === 4 && <Done />}
      </form>
    </FormProvider>
  );
}
