import { UseFormReturn } from "react-hook-form";

export type PurchaseFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDialogChange: (open: boolean) => void;
  document: { name: string };
  price: string;
  method: string;
  form: UseFormReturn<
    {
      documentId: string;
      method: "card" | "kpay";
    },
    unknown,
    {
      documentId: string;
      method: "card" | "kpay";
    }
  >;
  handlePay: (e: React.SubmitEvent) => void;
  pending: boolean;
};

export type PersanalizeFormTypeProps = {
  customizationOpen: boolean;
  setCustomizationOpen: (val: boolean) => void;
  handleCustomizationDialogChange: (open: boolean) => void;
  stepIndex: number;
  totalSteps: number;
  currentStepFields:
    | readonly ["firstName", "lastName", "birthDate", "age"]
    | readonly ["phone", "email", "city", "address"]
    | readonly ["purpose", "notes"];
  handleCustomize: (e: React.SubmitEvent) => void;
  nextStep: () => void;
  previousStep: () => void;
  personalizationForm: UseFormReturn<FormType, unknown, FormType>;
};

type FormType = {
  firstName: string;
  lastName: string;
  birthDate: string;
  age: string;
  phone: string;
  city: string;
  address: string;
  purpose: string;
  email?: string | undefined;
  notes?: string | undefined;
};