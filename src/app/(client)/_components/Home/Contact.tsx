import Image from "next/image";
import contact_img from "../../../../assets/images/contact.png";
import { Contact_infos } from "@/data/GlobalData";

export default function Contact() {
  return (
    <section className="flex flex-col gap-4 relative justify-end py-3">
      {/* Image */}
      <Image
        src={contact_img}
        alt="Contact image"
        width={800}
        height={800}
        loading="eager"
        className="object-cover w-full h-50"
      />

      {/* Text and Actions */}
      <div className="absolute right-0 flex flex-col gap-4 ml-auto h-full justify-center md:mr-20 backdrop-blur-md py-5 px-4">
        <h1 className="text-2xl font-semibold">{Contact_infos.title}</h1>
        <p className="text-sm text-turtle-text-main">
          {Contact_infos.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <button className="btn btn-primary w-full py-3">
            Consulter les guides
          </button>
          <button className="btn btn-outline w-full py-3">
            Contacter le support
          </button>
        </div>
      </div>
    </section>
  );
}
