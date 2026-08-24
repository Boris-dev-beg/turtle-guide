"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Procedures_infos } from "@/data/GlobalData";
import { useProcedures } from "@/hooks/useProcedures";
import { ArrowRight, ChevronRight, IdCardLanyard, User } from "lucide-react";
import Link from "next/link";

export default function PopularProcedures() {
  const { Popularprocedures, loading } = useProcedures();
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="w-full flex justify-between md:items-center">
        <h2 className="font-semibold text-2xl">{Procedures_infos.title}</h2>
        <Link
          href={Procedures_infos.link.href}
          className="text-turtle-primary font-semibold flex gap-1 items-center text-sm hover:underline"
        >
          <p className="hidden sm:flex">{Procedures_infos.link.label}</p>
          <ArrowRight />
        </Link>
      </div>
      {/* Body */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {loading ? (
          <>
            <Card_loader />
            <Card_loader />
            <Card_loader />
            <Card_loader />
          </>
        ) : (
          Popularprocedures.map((proc, index) => (
            <>
              <Card_
                key={index}
                title={proc.title}
                categoryName={proc.category.name}
              />
            </>
          ))
        )}
      </div>
    </section>
  );
}

const Card_ = ({
  title,
  categoryName,
}: {
  title: string;
  categoryName: string;
}) => {
  return (
    <Card className="flex-row items-start gap-2 px-4 group">
      <span className="p-4 rounded-full bg-turtle-primary-light text-turtle-primary">
        <IdCardLanyard className="size-10" />
      </span>
      <CardHeader className="w-full">
        <CardTitle className="line-clamp-2 font-semibold">{title}</CardTitle>
        <CardDescription className="flex items-center">
          <p>{categoryName}</p>
          <ChevronRight className="ml-auto group-hover:translate-x-1" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

const Card_loader = () => {
  return (
    <Card className="flex-row gap-2 px-4">
      <Skeleton className="p-4 rounded-full bg-turtle-primary-light text-turtle-primary">
        <User className="size-10" />
      </Skeleton>
      <CardHeader className="w-full">
        <Skeleton className="h-6 w-full" />
        <CardDescription className="flex items-center">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-6 w-6 ml-auto" />
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
