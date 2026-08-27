
export default function layout({children}: {children: React.ReactNode}) {
  return (
    <section className="wrapper flex flex-col h-full w-full">
      {children}
    </section>
  )
}
