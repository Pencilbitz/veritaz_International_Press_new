import React, { useState, useEffect } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import CompletedEvents from "../components/CompletedEvents";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../json_data/firebase";


export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const snapshot = await getDocs(collection(db, "events (2)"));

                let events = [];

                snapshot.forEach((doc) => {
                    const docData = doc.data();

                    if (Array.isArray(docData.data)) {
                        events = [...events, ...docData.data];
                    }
                });

                console.log("Events:", events);
                setEvents(events);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(e => e.status !== "Completed");
    const completedEvents = events.filter(e => e.status === "Completed");

    useEffect(() => {
        document.title = "Academic Events & Conferences | Veritaz International";

        // 1. Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = "Explore Veritaz International's academic conferences, FDPs, workshops, seminars, and research events for students, researchers, faculty, and professionals.";

        // 2. Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = "academic events, publishing workshops, research conferences, author seminars, webinar schedule, Veritaz International events, scholarly workshops India";

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
        canonicalLink.href = "https://www.veritazinternational.com/events";
    }, []);

    return (
        <div className="bg-gray-200 min-h-screen">
            {/* Contact Banner */}
            <section className="max-w-7xl mx-auto px-4 pt-8">
                <div className="bg-green-50 border-l-4 border-blue-500 rounded-lg shadow-md p-6 max-w-4xl mx-auto mt-2">
                    <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                        Organize Academic Events
                    </h3>
                    <p className="text-center text-lg text-gray-700 mb-4">
                        For Faculty Development Programs, Workshops, and Webinars, please contact:
                    </p>
                    <div className="flex justify-center gap-6">
                        <a
                            href="tel:+919361313822"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center w-max text-base font-normal"
                        >
                            <Phone size={18} className="mr-2" />
                            +91 9600581734
                        </a>
                        <a
                            href="https://wa.me/+919600581734"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center text-base font-normal"
                        >
                            <MessageCircle size={18} className="mr-1" />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Slider */}
            <section className="max-w-7xl mx-auto px-4 py-12 relative">
                <div className="text-center mb-12 pt-5">
                    <h1 className="text-5xl font-bold text-gray-800 normal-case tracking-normal">
                        Upcoming Events
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto mt-5"></div>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        className="services-carousel"
                        loop={true}
                        slidesPerView={4}
                        spaceBetween={16}
                        speed={3000}
                        grabCursor={true}
                        observer={true}
                        observeParents={true}
                        navigation={{
                            nextEl: ".services-button-next",
                            prevEl: ".services-button-prev",
                        }}
                        pagination={{
                            clickable: true,
                            el: ".services-pagination",
                        }}
                        autoplay={{
                            delay: 0, // Continuous flowing marquee line motion from your PHP source script
                            disableOnInteraction: true,
                            pauseOnMouseEnter: true,
                            reverseDirection: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                    >
                        {upcomingEvents.map((event) => (
                            <SwiperSlide key={event.id}>
                                <div className="p-0 bg-gray-200">
                                    <Link
                                        to={`/upcoming-events/${event.id}`}
                                        className="block bg-gray-200 overflow-hidden"
                                    >
                                        <img
                                            src={`${event.poster}`}
                                            alt={event.eventTitle || "Upcoming Event"}
                                            className="w-full h-auto block"
                                            onError={(e) => { e.target.src = "https://placehold.co/300x450/EEE/31343C?text=No+Poster" }}
                                        />
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows outside Swiper container layer elements */}
                    <button className="services-button-prev absolute left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 font-bold transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="services-button-next absolute right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-700 font-bold transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div className="services-pagination mt-4 text-center"></div>
            </section>

            {/* Completed Events */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
                            Previous Programs
                        </span>
                        <h2 className="mt-5 text-4xl md:text-5xl font-bold text-gray-900">
                            Completed Events
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Explore our successfully completed Faculty Development Programs, Workshops, Conferences and Webinars conducted across various institutions.
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 rounded-full mx-auto mt-6"></div>
                    </div>

                    <CompletedEvents events={completedEvents} />
                </div>
            </section>
        </div>
    );
}