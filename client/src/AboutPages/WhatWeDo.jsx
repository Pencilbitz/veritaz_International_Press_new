

export default function WhatWeDo() {
  return (
    <section className="py-16">
      <h2 className="text-center text-4xl font-bold mb-10">
        What We Do ?
      </h2>

      <div className="grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <h3 className="text-3xl font-semibold mb-4">
            Academic Publishing
          </h3>

          <p className="text-gray-700 leading-8 text-justify">
            We publish Textbooks and scholarly journals that support teaching and research across disciplines. As an established academic book publishing company, our publications are used by educators, researchers, and academic institutions in India and abroad. We work with both experienced scholars and first-time authors, offering clear and practical support at each stage of the process. Our services include manuscript development, peer review coordination, editing, design, and distribution. Every publication is handled with careful attention to academic standards and ethical practices. We focus on timely release, reliable dissemination, and long-term academic value through recognized publishing channels.

          </p>
        </div>

        <div className="lg:col-span-4">
          <img
            src="https://placehold.co/600x400/4ab33a/ffffff?text=Academic+Publishing"
            alt="Academic Publishing"
            className="rounded-xl w-full"
          />
        </div>
      </div>
    </section>
  );
}