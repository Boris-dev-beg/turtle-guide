export default function Header({title, description}:{title: string, description: string}) {
  return (
    <div className="flex h-40 lg:h-30 items-center w-full border-b border-border">
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-[26px] md:text-3xl font-bold leading-8">
          {title}
        </h1>
        <p className="md:text-lg leading-5 font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
