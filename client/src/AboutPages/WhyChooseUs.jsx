
const cards = [
  {
    image: "https://placehold.co/400x300/4ab33a/ffffff?text=Expertise",
    title: "Expertise",
    text: "Our team of seasoned professionals brings decades of experience in academic publishing, patent law, and faculty development.",
  },
  {
    image: "https://placehold.co/400x300/4ab33a/ffffff?text=Solutions",
    title: "End-to-End Solutions",
    text: "We manage the entire process from content creation and patent filing to program facilitation and event management.",
  },
  {
    image: "https://placehold.co/400x300/4ab33a/ffffff?text=Service",
    title: "Personalized Service",
    text: "Every project is unique. We tailor solutions to meet your specific goals and requirements.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <h2 className="text-center text-4xl font-bold mb-12">
        Why Choose Us
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
          >
            <img
              src={card.image}
              alt={card.title}
              className="rounded-xl mb-5 w-full"
            />

            <h3 className="text-2xl font-semibold mb-3">
              {card.title}
            </h3>

            <p className="text-gray-600 leading-7">
              {card.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}