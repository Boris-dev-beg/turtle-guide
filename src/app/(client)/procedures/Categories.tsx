"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { RightIcon } from "./icons";
import { useState } from "react";

export function Categories({
  categories,
  loading,
  OnClick,
}: {
  categories: { name: string }[];
  loading: boolean;
  OnClick: (val: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("toutes");
  return (
    <>
      <div className="border-r border-turtle-border min-w-52 hidden lg:flex flex-col gap-2 pr-1">
        {loading ? (
          <CategoriesSkeletons />
        ) : (
          categories.map((Cat, index) => (
            <Category_link
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              OnClick={OnClick}
              key={index}
              label={Cat.name}
            />
          ))
        )}
      </div>
    </>
  );
}

const Category_link = ({
  label,
  OnClick,
  setActiveCategory,
  activeCategory,
}: {
  label: string;
  OnClick: (val: string) => void;
  setActiveCategory: (val: string) => void;
  activeCategory: string;
}) => {
  // ! States
  const lowLabel = label.toLocaleLowerCase();
  const LabelToCompare = lowLabel.split(" ")[0];

  // ! Functions
  const handleClick = () => {
    OnClick(lowLabel);
    setActiveCategory(LabelToCompare);
  };

  // ! Render
  return (
    <button
      onClick={handleClick}
      className={`w-full p-2 ${activeCategory === LabelToCompare ? "bg-turtle-primary-light font-medium rounded-xs text-turtle-primary shadow shadow-accent border-b border-turtle-border" : "hover:bg-turtle-primary-light hover:font-medium hover:text-turtle-primary text-turtle-text-muted hover:border-b border-turtle-border"} flex gap-2 items-center text-sm cursor-pointer `}
    >
      <RightIcon category={lowLabel} className="size-5" />
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
