

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#c9f2be] via-[#eef8eb] to-[#b6e8a8] rounded-3xl p-10 md:p-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>
          <p className="text-[#4ab33a] font-semibold uppercase tracking-wider mb-10">
            Veri<span className="text-gray-700">taz</span> International Press
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-[#0f1f4d] mb-6">
            Who Are <span className="text-[#4ab33a]">We?</span>
          </h1>

          <p className="text-gray-700 leading-relaxed mb-8 ">
            Veritaz International Press is a professional academic services company and a trusted partner, offering comprehensive solutions in academic publishing, patent services, and educational event management. Our mission is to empower educators, researchers, and innovators by providing expert support at every stage — from concept development to publication and beyond. With a growing client base across India and internationally, Veritaz is dedicated to facilitating the advancement and global dissemination of knowledge.
          </p>


        </div>

        {/* Right Image */}
        <div className="relative flex justify-center  ml-30">
          <div className="absolute bg-[#4ab33a]/20 rounded-full blur-3xl"></div>

          <img
            src="https://placehold.co/600x400/4ab33a/ffffff?text=Who+We+Are"
            alt="Who We Are"
            className="relative z-10 max-w-full "
          />
        </div>
      </div>
    </section>
  );
}