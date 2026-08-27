"use client";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { RightIcon } from "./icons";

export const Procedure_card = ({
  procedure,
}: {
  procedure: {
    title: string;
    description: string;
    category: {
      name: string;
    };
  };
}) => {
  // ! States
  const category = procedure.category?.name?.toLocaleLowerCase() || "Bonjour";
  const title = procedure.title.toLocaleLowerCase();

  // ! Render
  return (
    <Card className="group hover:shadow-md hover:shadow-turtle-primary-light cursor-pointer rounded-sm">
      <CardHeader className="flex items-center gap-2">
        <RightIcon title={title} category={category} />
        <CardTitle className="font-semibold text-lg">
          {procedure.title}
        </CardTitle>
      </CardHeader>
      <CardDescription className="px-4 line-clamp-2">
        {procedure.description}
      </CardDescription>
      <CardFooter className="flex h-15 mt-auto">
        <p className="bg-turtle-primary-light py-1 px-3 rounded-lg text-turtle-primary border-turtle-primary-border border font-semibold">
          {procedure.category?.name}
        </p>
        <ChevronRight className="ml-auto group-hover:translate-x-1" />
      </CardFooter>
    </Card>
  );
};
