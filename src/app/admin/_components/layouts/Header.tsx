export default function Header() {
  return (
    <header className="flex w-full h-20 bg-brand-green text-white items-center justify-between py-5 px-3">
      <div className="flex flex-col">
        <h1 className="font-bold text-3xl">Turtle Guide</h1>
        <p>Admin interface</p>
      </div>

      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">MANGWA BORIS</h1>
        <p>Developper de la plateforme</p>
      </div>
    </header>
  );
}
