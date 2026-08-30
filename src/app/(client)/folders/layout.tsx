import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <section className="wrapper flex w-full">
      {children}
    </section>
  )
}
