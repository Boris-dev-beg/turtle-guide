import Header from "./_components/layouts/Header";
import SideBar from "./_components/layouts/SideBar";

export default function page() {
  return (
    <div className="flex max-w-full w-screen">
      <SideBar />
      <main className="flex w-full">
        <Header />
      </main>
    </div>
  );
}
