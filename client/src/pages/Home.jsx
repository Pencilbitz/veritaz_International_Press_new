import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";

export default function Home() {

    const bSliderRef = useRef(null);
    const modalRef = useRef(null);
    const videoRef = useRef(null);

    let isPaused = false;
    let autoScrollInterval = null;

    const scrollGrid = (dir) => {
        const bSlider = bSliderRef.current;
        if (!bSlider) return;

        const firstCard = bSlider.querySelector(".snap-start");
        if (!firstCard) return;

        const cardWidth = firstCard.clientWidth + 32;

        if (dir === "left") {
            bSlider.scrollLeft -= cardWidth;
        } else {
            bSlider.scrollLeft += cardWidth;
        }
    };

    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const snapshot = await getDocs(collection(db, "testimonials"));

                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const tableDoc = docs.find(doc => doc.type === "table");

                if (tableDoc && Array.isArray(tableDoc.data)) {
                    setTestimonials(tableDoc.data);
                } else {
                    setTestimonials([]);
                }
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const bSlider = bSliderRef.current;
        if (!bSlider) return;

        autoScrollInterval = setInterval(() => {
            if (!isPaused) {
                if (
                    bSlider.scrollLeft + bSlider.clientWidth >=
                    bSlider.scrollWidth - 10
                ) {
                    bSlider.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollGrid("right");
                }
            }
        }, 4000);

        const handleMouseEnter = () => (isPaused = true);
        const handleMouseLeave = () => (isPaused = false);

        bSlider.addEventListener("mouseenter", handleMouseEnter);
        bSlider.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            clearInterval(autoScrollInterval);
            bSlider.removeEventListener("mouseenter", handleMouseEnter);
            bSlider.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    const openVideoModal = (videoSrc) => {
        const modal = modalRef.current;
        const video = videoRef.current;

        if (!modal || !video) return;

        video.src = videoSrc;
        modal.classList.remove("hidden");

        setTimeout(() => {
            modal.classList.remove("opacity-0");
        }, 10);

        video.play();
    };

    const closeVideoModal = () => {
        const modal = modalRef.current;
        const video = videoRef.current;

        if (!modal || !video) return;

        modal.classList.add("opacity-0");

        setTimeout(() => {
            modal.classList.add("hidden");
            video.pause();
            video.src = "";
        }, 300);
    };

    useEffect(() => {
        document.title = "Best Book Publication Company in India | Veritaz International";

        // 1. Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = "Publish textbooks, research papers, patents, copyrights and academic journals with Veritaz International. Trusted publication experts across India.";

        // 2. Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = "Textbook Publishing India, Patent Filing Services, ISBN Registration, Copyright Services, Book Publishing Company, Veritaz International Press, Academic Publishing";
        // 3. Robots Tag
        let metaRobots = document.querySelector('meta[name="robots"]');
        if (!metaRobots) {
            metaRobots = document.createElement('meta');
            metaRobots.name = "robots";
            document.head.appendChild(metaRobots);
        }
        metaRobots.content = "index, follow";

        // 4. Canonical Link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = "canonical";
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.href = "https://www.veritazinternational.com/";
    }, []);


    return (
        <>

            <header
                style={{
                    backgroundImage:
                        "url('https://img.freepik.com/premium-photo/plain-background-copy-space_198067-677668.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="hero-gradient pt-5 sm:pt-5 lg:pt-15 xl:pt-14 pb-24 md:pb-32 px-6 lg:px-20 relative overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row items-center justify-between">

                    <div className="w-full lg:w-1/2 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900">
                            Best publishing <br className="hidden md:block" />
                            practices in <br className="hidden md:block" />
                            one book
                        </h1>

                        <p className="text-gray-700 text-lg max-w-md">
                            Start your learning journey by browsing millions of books from our library.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center items-center lg:items-end perspective-1000">
                        <div className="relative flex items-center justify-center">

                            <div className="w-32 h-44 sm:w-22 sm:h-50 md:w-48 md:h-64 lg:w-40 lg:h-52 xl:w-48 xl:h-64 rounded shadow-xl transform -rotate-12 -translate-x-8 md:-translate-x-12 translate-y-4 transition duration-500 hover:rotate-0 hover:z-30">
                                <img
                                    src="assets/image/books/index-1.png"
                                    alt="Book 1"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            <div className="w-32 h-44 sm:w-22 sm:h-50 md:w-48 md:h-64 lg:w-40 lg:h-52 xl:w-48 xl:h-64 rounded shadow-2xl z-20 scale-110 md:scale-125 transition duration-500 hover:scale-135">
                                <img
                                    src="assets/image/books/index-2.png"
                                    alt="Book 2"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                            <div className="w-32 h-44 sm:w-22 sm:h-50 md:w-48 md:h-64 lg:w-40 lg:h-52 xl:w-48 xl:h-64 rounded shadow-xl transform rotate-12 translate-x-8 md:translate-x-12 translate-y-4 transition duration-500 hover:rotate-0 hover:z-30">
                                <img
                                    src="assets/image/books/index-3.png"
                                    alt="Book 3"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </header>

            <section className="relative py-2 lg:py-5 px-6 lg:px-24 overflow-hidden bg-gray-50">

                {/* Background elements */}
                <div className="absolute top-10 left-5 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-10 right-5 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-2 bg-gradient-to-r from-process-start via-process-mid to-process-end opacity-5 rounded-full"></div>

                <div className="relative">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-process-start to-process-mid text-gray-800 font-bold tracking-widest uppercase text-sm">
                            <i className="fas fa-route mr-2"></i>
                            Veritaz International Press
                        </span>

                        <h2 className="text-xl md:text-2xl lg:text-4xl font-black text-gray-900 mt-6 tracking-tight">
                            Our Comprehensive Service Process
                        </h2>

                        <p className="text-gray-600 mt-3 text-sm lg:text-lg leading-relaxed text-justify">
                            Our structured process guides you through each critical phase of academic achievement, ensuring comprehensive support at every step.
                        </p>
                    </div>

                    {/* Grid */}
                    <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {/* Card 01 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-blue-200 transition-colors leading-none">
                                    01
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-book text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Textbook Publications
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                International publishing with ISBN. Full distribution support on Amazon and Flipkart for maximum author reach.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    National
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    International
                                </span>
                            </div>
                        </div>

                        {/* Card 02 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-orange-200 transition-colors leading-none">
                                    02
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-gavel text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Patent Grant Support
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Expert assistance for National and International patent filing across 12 countries to protect your innovations.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    IPR Protection
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    12 Countries
                                </span>
                            </div>
                        </div>

                        {/* Card 03 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-purple-200 transition-colors leading-none">
                                    03
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-users text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Educational Events
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Professional organization of International Conferences, FDPs, Workshops, and Academic Seminars.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Conferences
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Workshops
                                </span>
                            </div>
                        </div>

                        {/* Card 04 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-pink-200 transition-colors leading-none">
                                    04
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-graduation-cap text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Ph.D. Assistance
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Comprehensive end-to-end guidance for doctoral candidates, from topic selection to thesis completion.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Mentorship
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Research
                                </span>
                            </div>
                        </div>

                        {/* Card 05 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-teal-200 transition-colors leading-none">
                                    05
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-network-wired text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                IEEE Conference Publications
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Dedicated support for publishing high-standard papers in prestigious IEEE conferences globally.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Technical
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Global Standard
                                </span>
                            </div>
                        </div>

                        {/* Card 06 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-yellow-200 transition-colors leading-none">
                                    06
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-microscope text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                SCI & Scopus Journal
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Achieve publication in top-tier indexed journals with our professional review and submission support.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-yellow-700 bg-yellow-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Scopus Indexed
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-yellow-700 bg-yellow-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    High Impact
                                </span>
                            </div>
                        </div>

                        {/* Card 07 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-indigo-200 transition-colors leading-none">
                                    07
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-pen-nib text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Research Paper Support
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Expert drafting, formatting, and technical editing services to polish your research for submission.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Technical Writing
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Proofreading
                                </span>
                            </div>
                        </div>

                        {/* Card 08 */}
                        <div className="group h-full bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
                                <div className="flex-shrink-0 text-3xl sm:text-4xl font-black text-gray-100 group-hover:text-emerald-200 transition-colors leading-none">
                                    08
                                </div>
                                <span className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                    <i className="fas fa-laptop-code text-xs sm:text-sm"></i>
                                </span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                                Upskilling Programs
                            </h3>

                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 flex-grow">
                                Modern training modules designed to enhance professional skills and academic competencies.
                            </p>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Skill Development
                                </span>
                                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                                    Certificate
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="overflow-hidden py-8">
                <div className="relative z-10 px-4 lg:px-8">
                    <div>
                        <div className="flex flex-col lg:flex-row items-center">

                            {/* LEFT CONTENT */}
                            <div className="lg:w-1/2 mb-12 lg:mb-0">

                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                    <span className="text-black text-sm font-semibold uppercase tracking-wider">
                                        Trusted by 500+ Authors
                                    </span>
                                </div>

                                <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-6 leading-tight">
                                    Transform Your{" "}
                                    <span className="gradient-text">Knowledge</span>{" "}
                                    Into Impact
                                </h2>

                                <p className="text-sm md:text-xl lg:text-xl text-gray-600 mb-8 leading-relaxed">
                                    Veritaz International Press bridges the gap between innovative ideas and global recognition through comprehensive publishing, patent, and research solutions.
                                </p>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a
                                        href="#publish-form"
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover-lift flex items-center justify-center"
                                    >
                                        <i className="fas fa-pen-nib mr-3"></i>
                                        Start Publishing Today
                                    </a>

                                    <a
                                        href="contact.php"
                                        className="px-4 py-2 bg-white text-gray-800 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 hover-lift flex items-center justify-center"
                                    >
                                        <i className="fas fa-phone mr-3 text-blue-600"></i>
                                        Contact Us
                                    </a>
                                </div>

                                {/* Stats */}
                                <div className="mt-2 lg:mt-12 md:mt-8 grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-lg md:text-xl lg:text-3xl font-bold text-blue-600 mb-2">
                                            500+
                                        </div>
                                        <div className="text-gray-600 text-xs">Books Published</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-lg md:text-xl lg:text-3xl font-bold text-orange-500 mb-2">
                                            200+
                                        </div>
                                        <div className="text-gray-600 text-xs">Patents Filed</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-lg md:text-xl lg:text-3xl font-bold text-purple-600 mb-2">
                                            98%
                                        </div>
                                        <div className="text-gray-600 text-xs">Client Satisfaction</div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT FORM */}
                            <div className="lg:w-1/2 lg:pl-12">
                                <div className="relative">
                                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 book-shadow transform transition-transform duration-500">

                                        {/* Badge */}
                                        <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                                            <i className="fas fa-award text-2xl"></i>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                            Publish Your Book
                                        </h3>

                                        {/* FORM */}
                                        <form id="web3form" className="space-y-4" noValidate>

                                            <input
                                                type="hidden"
                                                name="access_key"
                                                value="351a2b0f-5bed-4078-a9ce-dc3cdb628eb5"
                                            />

                                            <input
                                                type="hidden"
                                                name="subject"
                                                value="New Book Publishing Inquiry"
                                            />

                                            <input
                                                type="checkbox"
                                                name="botcheck"
                                                style={{ display: "none" }}
                                            />

                                            {/* Name */}
                                            <div className="relative">
                                                <i className="fas fa-user absolute left-4 top-4 text-gray-400"></i>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your Name"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                                                />
                                            </div>

                                            {/* Email */}
                                            <div className="relative">
                                                <i className="fas fa-envelope absolute left-4 top-4 text-gray-400"></i>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    placeholder="Email Address"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="relative">
                                                <i className="fas fa-phone absolute left-4 top-4 text-gray-400"></i>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Phone Number"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                                                />
                                            </div>

                                            {/* Message */}
                                            <div className="relative">
                                                <i className="fas fa-file-alt absolute left-4 top-4 text-gray-400"></i>
                                                <input
                                                    type="text"
                                                    id="message"
                                                    name="message"
                                                    placeholder="Message"
                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                            >
                                                <i className="fas fa-paper-plane mr-2"></i>
                                                Send Inquiry
                                            </button>

                                            <p id="result" className="text-center text-sm mt-2"></p>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-gray-100 py-20 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-16 relative">
                        <h4 className="text-gray-700 text-7xl font-bold opacity-10 absolute left-1/2 -translate-x-1/2 -top-16 select-none uppercase">
                            Client
                        </h4>

                        <p className="text-gray-800 text-4xl font-black relative z-10 tracking-tight">
                            OUR TESTIMONIALS
                        </p>

                        <div className="w-20 h-1 bg-teal-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Slider */}
                    <div
                        ref={bSliderRef}
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12"
                        style={{ scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {testimonials.map((test, index) => {
                            // Normalize potential Boolean vs Binary Int values (e.g. true or 1) safely
                            const hasVideo = test.is_video_testimonial === true || test.is_video_testimonial === 1;

                            return (
                                <div
                                    key={index}
                                    className="min-w-full md:min-w-full lg:min-w-[calc(50%-16px)] xl:min-w-[calc(33.333%-22px)] snap-start"
                                >
                                    <div className="bg-[#E7F2EF] rounded-3xl p-1 relative flex flex-col md:flex-row gap-3 items-center min-h-[220px] transition-transform hover:scale-[1.02] duration-300">

                                        {/* Avatar Container with Conditional Hover Play Button Overlay */}
                                        <div
                                            onClick={() => hasVideo && openVideoModal(test.video_url)}
                                            className={`w-24 h-24 bg-white/20 rounded-full flex-shrink-0 border-2 border-white/30 overflow-hidden relative ${hasVideo ? "group cursor-pointer" : ""
                                                }`}
                                        >
                                            <img
                                                src={test.avatar_url}
                                                className="w-full h-full object-cover"
                                                alt={test.name || "Client Avatar"}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/100x100?text=User";
                                                }}
                                            />

                                            {/* Conditional Hover Overlay Play Button */}
                                            {hasVideo && (
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <svg className="w-8 h-8 text-white pl-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Text Details Box */}
                                        <div className="text-black text-center md:text-left flex-1 px-2 md:px-0">
                                            <h5 className="font-bold text-lg tracking-tight flex items-center justify-center md:justify-start gap-2">
                                                {test.name}

                                                {/* Conditional Inline "Watch Video" Button Pill */}
                                                {hasVideo && (
                                                    <button
                                                        onClick={() => openVideoModal(test.video_url)}
                                                        className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-600 transition-colors shadow-sm font-normal"
                                                    >
                                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>{" "}
                                                        Watch Video
                                                    </button>
                                                )}
                                            </h5>

                                            <p className="text-[11px] opacity-80 mb-2 font-semibold">
                                                {test.designation}
                                            </p>

                                            <div className="flex justify-center md:justify-start gap-1 mb-3 text-yellow-500 text-xs">
                                                {Array.from({ length: test.rating || 5 }).map((_, i) => (
                                                    <span key={i}>★</span>
                                                ))}
                                            </div>

                                            <p className="text-[11px] leading-relaxed opacity-90 line-clamp-4 text-justify">
                                                {test.content}
                                            </p>
                                        </div>

                                        {/* Speech Bubble Arrow Indicator styling */}
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-[#E7F2EF]"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center mt-12 gap-6">
                        <div className="flex gap-3">
                            <button
                                onClick={() => scrollGrid("left")}
                                className="p-3 rounded-full border border-white/10 text-black hover:bg-green-200 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => scrollGrid("right")}
                                className="p-3 rounded-full border border-white/10 text-black hover:bg-green-200 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
                <div
                    ref={modalRef}
                    id="videoModal"
                    className="fixed inset-0 bg-black/70 hidden opacity-0 transition-opacity flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target.id === "videoModal") closeVideoModal();
                    }}
                >
                    <video
                        ref={videoRef}
                        className="w-[90%] max-w-3xl rounded-xl"
                        controls
                    />
                </div>
            </section>

            <section className="py-5 px-4 lg:px-8">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-800 mb-10 text-center">
                    Why Authors Choose Us
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6 text-gray-700">

                    {/* Left Column */}
                    <div className="space-y-6">

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Book will be published with <strong className="text-gray-900">ISBN</strong>.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Lowest Publication Fee.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>A Govt registered Company and Registered under MSME.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Complementary Books to each Author.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Partnership with global distributors like Amazon, Flipkart etc.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Bestselling titles in Research and Engineering in Colleges.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>As per UGC and other accreditation bodies, it adds points to API and self-appraisal.</p>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Publication certificate hardcopy will be provided to each author.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Free Online Promotion and Distribution through Flipkart, Amazon, Publisher website etc.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Publishing books in all regional languages.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>High-quality 80gsm paper with black & white/color printing and glossy lamination.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Personalized approach and exceptional 24/7 customer service.</p>
                        </div>

                        <div className="flex items-start gap-4">
                            <CheckCircle className="w-6 h-6 text-sky-500 fill-sky-500 text-white flex-shrink-0 mt-0.5" />
                            <p>Best seller in the market.</p>
                        </div>

                    </div>

                </div>
            </section>

        </>
    )
}