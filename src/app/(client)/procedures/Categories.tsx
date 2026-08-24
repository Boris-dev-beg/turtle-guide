"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";
import {
  Blocks,
  BriefcaseBusiness,
  CarFront,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Home,
  IdCard,
  MoreHorizontal,
  Scale,
  Users,
} from "lucide-react";

export function Categories() {
  const { categories, loading } = useCategories();
  console.log("Categories: ", categories);
  return (
    <>
      <div className="border-r border-turtle-border min-w-52 hidden lg:flex flex-col gap-2 pr-1">
        {loading ? (
          <CategoriesSkeletons />
        ) : (
          categories.map((Cat, index) => (
            <Category_link key={index} label={Cat.name} />
          ))
        )}
      </div>
    </>
  );
}

const Category_link = ({ label }: { label: string }) => {
  const lowLabel = label.toLocaleLowerCase();
  const Icon = lowLabel.includes("toutes")
    ? Blocks
    : lowLabel.includes("civil")
      ? Users
      : lowLabel.includes("documents")
        ? IdCard
        : lowLabel.includes("famille")
          ? HeartHandshake
          : lowLabel.includes("logement")
            ? Home
            : lowLabel.includes("travail")
              ? BriefcaseBusiness
              : lowLabel.includes("éducation")
                ? GraduationCap
                : lowLabel.includes("justice")
                  ? Scale
                  : lowLabel.includes("santé")
                    ? HeartPulse
                    : lowLabel.includes("transport")
                      ? CarFront
                      : MoreHorizontal;
  return (
    <button
      className={`w-full p-2 ${Icon == Blocks ? "bg-turtle-primary-light font-medium rounded-sm text-turtle-primary shadow shadow-accent border-b border-turtle-border" : "hover:bg-turtle-primary-light hover:font-medium hover:text-turtle-primary text-turtle-text-muted hover:border-b border-turtle-border"} flex gap-2 items-center text-sm cursor-pointer `}
    >
      <Icon className="size-5" />
      {label}
    </button>
  );
};

function CategoriesSkeletons() {
  return (
    <>
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-full" />
    </>
  );
}
