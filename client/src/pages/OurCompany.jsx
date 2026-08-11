import React from "react";
import { useEffect } from "react";

import {
    ArrowRight,
    Award,
    Star,
    Check,
    PenTool,
    Megaphone,
    Globe,
    Wallet,
} from "lucide-react";

export default function OurCompany() {
    useEffect(() => {
            document.title = "About Veritaz International | Academic Publishing Experts";
    
            // 1. Meta Description
            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.name = "description";
                document.head.appendChild(metaDescription);
            }
            metaDescription.content = "Learn about Veritaz International,a trusted academic publishing company offering textbook publication, ISBN,patent,copyright and research support services.";
    
            // 2. Meta Keywords
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.name = "keywords";
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = "about Veritaz International, academic publishing company, textbook publisher India, research support services, ISBN registration company, patent and copyright services India";            
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
            canonicalLink.href = "https://www.veritazinternational.com/our-company";
        }, []);
    return (
        <>

            <div style={{ maxWidth: "1520px" }} className="container mx-auto bg-gray-50">

                {/* ================= HERO SECTION ================= */}
                <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-900 to-purple-900 text-white">

                    {/* Background Effects */}
                    <div className="absolute inset-0 select-none pointer-events-none">
                        {/* Scaled down blur effects to fit tighter within the section */}
                        <div className="absolute top-5 left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.12),transparent_40%)]"></div>
                        <div className="absolute inset-0 bg-black/25"></div>
                    </div>

                    {/* Reduced vertical padding (py-16 lg:py-24 instead of py-24 lg:py-36) */}
                    <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
                        <div className="max-w-4xl mx-auto text-center">

                            {/* Badge - Tighter margin */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <span className="text-xs tracking-widest uppercase font-semibold text-gray-200">
                                    Trusted Academic Publisher
                                </span>
                            </div>

                            {/* Heading - Shifted down slightly from text-7xl to a clean, readable text-5xl/6xl max */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                                About{" "}
                                <span className="bg-gradient-to-r from-cyan-300 via-white to-pink-300 bg-clip-text text-transparent">
                                    Veritaz
                                </span>
                                <br />
                                International Press
                            </h1>

                            {/* Description - Adjusted spacing and optimized width */}
                            <p className="mt-5 text-base md:text-lg text-gray-200/90 leading-relaxed max-w-2xl mx-auto">
                                Empowering researchers, educators, and authors with world-class
                                publishing solutions, innovative academic services, and global
                                distribution that transforms ideas into lasting impact.
                            </p>

                            {/* Buttons space */}
                        </div>
                    </div>

                    {/* Bottom Wave */}
                    <svg
                        className="absolute bottom-0 left-0 w-full text-white block"
                        viewBox="0 0 1440 120"
                        fill="currentColor"
                        preserveAspectRatio="none"
                        style={{ height: '40px' }} // Controls the maximum height of the wave mask to keep it clean
                    >
                        <path d="M0,64L80,69.3C160,75,320,85,480,90.7C640,96,800,96,960,80C1120,64,1280,32,1360,16L1440,0L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
                    </svg>
                </header>

                {/* ================= WHO ARE WE ================= */}

                <main className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">

                    {/* Background Decorations */}

                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>

                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-6">

                        <div className="grid lg:grid-cols-2 gap-20 items-center">

                            {/* LEFT CONTENT */}

                            <div>

                                <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold tracking-wide mb-6">
                                    ABOUT OUR COMPANY
                                </span>

                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
                                    Empowering
                                    <span className="block text-indigo-600">
                                        Authors & Researchers
                                    </span>
                                    Worldwide
                                </h2>

                                <p className="text-lg text-slate-600 leading-8 text-justify mb-6">
                                    <strong>Welcome to Veritaz International Press</strong>,
                                    your trusted partner for publication services and patent
                                    grant solutions. We empower educators, innovators,
                                    researchers, and institutions through world-class academic
                                    publishing, intellectual property support, and professional
                                    development.
                                </p>

                                <p className="text-lg text-slate-600 leading-8 text-justify mb-10">
                                    Whether you're publishing textbooks, protecting innovative
                                    designs, or expanding your academic career, our experienced
                                    team provides personalized guidance from concept to global
                                    distribution, ensuring quality, credibility, and long-term
                                    impact.
                                </p>


                            </div>

                            {/* RIGHT IMAGE */}

                            <div className="relative flex justify-center">

                                {/* Glow */}

                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-[40px] blur-3xl opacity-20 scale-90"></div>

                                {/* Image */}

                                <img
                                    src="https://i.pinimg.com/736x/ae/bf/f0/aebff0ed085370362da5a37c09fb39ae.jpg"
                                    alt="Our Team"
                                    className="relative rounded-[32px] shadow-2xl w-full max-w-lg object-cover hover:scale-105 transition duration-500"
                                />



                            </div>

                        </div>

                    </div>

                </main>

                {/* ================= ABOUT VERITAZ ================= */}

                <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

                    {/* Background Decorations */}

                    <div className="absolute -top-32 -left-20 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>

                    <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-purple-200 rounded-full blur-3xl opacity-20"></div>

                    <div className="max-w-7xl mx-auto px-6">

                        <div className="grid lg:grid-cols-2 gap-20 items-center">

                            {/* IMAGE SECTION */}

                            <div className="relative flex justify-center">

                                {/* Glow */}

                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20 rounded-[40px] scale-90"></div>

                                <img
                                    src="https://img.freepik.com/fotos-premium/fondo-regreso-escuela-libros-sobre-pizarra-pila-libros-escolares-sobre-mesa-ai-generado_502505-1160.jpg"
                                    alt="About Veritaz"
                                    className="relative rounded-[32px] shadow-2xl object-cover w-full max-w-xl hover:scale-105 transition duration-500"
                                />


                            </div>

                            {/* CONTENT */}

                            <div>

                                <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-5 py-2 text-sm font-semibold tracking-wider uppercase mb-6">
                                    About Veritaz
                                </span>

                                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">

                                    Publishing
                                    <span className="block text-indigo-600">
                                        Knowledge Without Limits
                                    </span>

                                </h2>

                                <p className="text-lg text-slate-600 leading-8 text-justify mb-8">
                                    Veritaz International Press specializes in publishing
                                    high-quality textbooks, scholarly journals, conference
                                    proceedings, patents, and research publications that inspire
                                    innovation and academic excellence.
                                </p>

                                <p className="text-lg text-slate-600 leading-8 text-justify mb-10">
                                    Whether you're an experienced researcher, educator, or a
                                    first-time author, our dedicated publishing experts guide
                                    you through editing, design, ISBN registration, printing,
                                    and worldwide distribution—making your publishing journey
                                    smooth, professional, and impactful.
                                </p>




                            </div>

                        </div>

                    </div>

                </section>
                <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">

                    {/* Background Decorations */}

                    <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-indigo-200/30 blur-3xl"></div>

                    <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-purple-300/30 blur-3xl"></div>

                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#6366f1_1px,transparent_1px),linear-gradient(90deg,#6366f1_1px,transparent_1px)] bg-[size:60px_60px]"></div>

                    <div className="relative max-w-7xl mx-auto px-6">

                        {/* ================= HEADER ================= */}

                        <div className="text-center mb-20">

                            <span className="inline-flex items-center rounded-full bg-indigo-100 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm">

                                ✦ Why Choose Us

                            </span>

                            <h2 className="mt-6 text-4xl md:text-6xl font-black leading-tight text-slate-900">

                                Why Authors Trust

                                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">

                                    Veritaz International Press

                                </span>

                            </h2>

                            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600">

                                We don't just publish books—we empower authors with the
                                tools, expertise, global reach, and dedicated support
                                needed to turn knowledge into worldwide impact.

                            </p>

                            {/* Decorative Divider */}

                            <div className="mt-10 flex justify-center items-center gap-3">

                                <span className="w-16 h-[2px] bg-indigo-300 rounded-full"></span>

                                <span className="w-4 h-4 rounded-full bg-indigo-500 shadow-lg shadow-indigo-300 animate-pulse"></span>

                                <span className="w-16 h-[2px] bg-purple-300 rounded-full"></span>

                            </div>

                        </div>

                        {/* ================= MAIN GRID ================= */}

                        <div className="grid lg:grid-cols-3 gap-14 items-start">

                            {/* LEFT PREMIUM CIRCLE */}

                            <div className="relative flex justify-center">

                                {/* Glow */}

                                <div className="absolute w-72 h-72 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-20"></div>

                                {/* Outer Ring */}

                                <div className="relative w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-2xl">

                                    {/* Inner Ring */}

                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">

                                        {/* Content */}

                                        <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center text-center p-8">

                                            <Award className="w-16 h-16 text-indigo-600 mb-5" />

                                            <h3 className="text-2xl font-black text-slate-900">

                                                Your Success

                                            </h3>

                                            <p className="text-lg text-slate-600 mt-2">

                                                Is Our Priority

                                            </p>

                                            <div className="mt-6 w-16 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                                        </div>

                                    </div>

                                </div>

                                {/* Floating Star */}

                                <div className="absolute top-5 right-6 w-16 h-16 rounded-2xl bg-yellow-400 shadow-xl flex items-center justify-center rotate-12">

                                    <Star className="w-8 h-8 text-white fill-white" />

                                </div>

                                {/* Floating Check */}

                                <div className="absolute bottom-8 left-2 w-14 h-14 rounded-xl bg-green-500 shadow-xl flex items-center justify-center -rotate-12">

                                    <Check className="w-7 h-7 text-white" />

                                </div>

                                {/* Floating Publication Card */}

                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-6 py-4 border border-slate-100">

                                    <h4 className="text-3xl font-black text-indigo-600">

                                        500+

                                    </h4>

                                    <p className="text-sm text-slate-500 whitespace-nowrap">

                                        Successful Publications

                                    </p>

                                </div>

                            </div>

                            {/* RIGHT COLUMN STARTS HERE */}

                            <div className="lg:col-span-2">

                                <div className="grid md:grid-cols-2 gap-7">

                                    {/* Part 2 starts here */}
                                    {/* ================= Feature Card 1 ================= */}

                                    <div className="group relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur-xl p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                                        <div className="relative flex items-start gap-5">

                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg group-hover:rotate-6 transition duration-500">

                                                <PenTool className="h-8 w-8 text-white" />

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                    Multiformat Publishing
                                                </h3>

                                                <p className="text-slate-600 leading-7">
                                                    From print to digital, we ensure your work is accessible
                                                    across every platform with our comprehensive publishing
                                                    solutions.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ================= Feature Card 2 ================= */}

                                    <div className="group relative overflow-hidden rounded-3xl border border-purple-100 bg-white/80 backdrop-blur-xl p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                                        <div className="relative flex items-start gap-5">

                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:rotate-6 transition duration-500">

                                                <Megaphone className="h-8 w-8 text-white" />

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                    Strategic Book Marketing
                                                </h3>

                                                <p className="text-slate-600 leading-7">
                                                    Reach the right audience with our proven marketing
                                                    strategies tailored specifically for your genre and
                                                    target readers.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ================= Feature Card 3 ================= */}

                                    <div className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-white/80 backdrop-blur-xl p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                                        <div className="relative flex items-start gap-5">

                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg group-hover:rotate-6 transition duration-500">

                                                <Globe className="h-8 w-8 text-white" />

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                    Global Distribution
                                                </h3>

                                                <p className="text-slate-600 leading-7">
                                                    Our worldwide distribution network ensures your books
                                                    reach readers through leading online marketplaces and
                                                    physical bookstores.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* ================= Feature Card 4 ================= */}

                                    <div className="group relative overflow-hidden rounded-3xl border border-green-100 bg-white/80 backdrop-blur-xl p-7 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                                        <div className="relative flex items-start gap-5">

                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:rotate-6 transition duration-500">

                                                <Wallet className="h-8 w-8 text-white" />

                                            </div>

                                            <div>

                                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                                    Affordable Solutions
                                                </h3>

                                                <p className="text-slate-600 leading-7">
                                                    Professional publishing packages designed to be
                                                    cost-effective without compromising quality,
                                                    creativity, or global visibility.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* ================= Premium Award Banner ================= */}

                                <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mt-12 p-[1px] shadow-2xl">

                                    <div className="rounded-[30px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">

                                        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

                                        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">

                                            <div className="flex items-start gap-5">

                                                <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-lg flex items-center justify-center border border-white/20">

                                                    <Award className="w-10 h-10 text-white" />

                                                </div>

                                                <div>

                                                    <span className="uppercase tracking-[0.3em] text-sm text-indigo-100 font-semibold">
                                                        Trusted Excellence
                                                    </span>

                                                    <h3 className="text-3xl font-black text-white mt-2">
                                                        Award-Winning Support
                                                    </h3>

                                                    <p className="text-indigo-100 mt-4 leading-7 max-w-2xl">
                                                        Our dedicated author support team has been
                                                        recognized for excellence in the publishing
                                                        industry, providing personalized assistance
                                                        from manuscript preparation to worldwide
                                                        distribution.
                                                    </p>

                                                </div>

                                            </div>

                                            <button className="shrink-0 rounded-2xl bg-white px-8 py-4 font-semibold text-indigo-700 shadow-xl transition hover:scale-105 hover:bg-slate-100">

                                                Learn More →

                                            </button>

                                        </div>

                                    </div>

                                </div>
                                {/* ================= Statistics ================= */}

                                <div className="mt-20">

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

                                        {[
                                            {
                                                number: "500+",
                                                title: "Books Published",
                                                icon: "📚",
                                            },
                                            {
                                                number: "50+",
                                                title: "Countries Reached",
                                                icon: "🌍",
                                            },
                                            {
                                                number: "98%",
                                                title: "Author Satisfaction",
                                                icon: "⭐",
                                            },
                                            {
                                                number: "24/7",
                                                title: "Author Support",
                                                icon: "🤝",
                                            },
                                        ].map((item) => (

                                            <div
                                                key={item.title}
                                                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg border border-slate-100 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                                            >

                                                {/* Hover Glow */}

                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

                                                <div className="relative text-center">

                                                    <div className="text-5xl mb-5 transition-transform duration-500 group-hover:scale-125">

                                                        {item.icon}

                                                    </div>

                                                    <h3 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">

                                                        {item.number}

                                                    </h3>

                                                    <p className="mt-3 text-slate-600 font-medium">

                                                        {item.title}

                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                                {/* ================= Bottom CTA ================= */}



                            </div>
                        </div>
                    </div>

                </section>
                {/* ================= TECHNICAL BENEFITS ================= */}

                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-6xl">

                        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-8">
                            TECHNICAL BENEFITS
                        </h2>

                        <ol className="list-decimal pl-8 space-y-5 text-lg text-gray-700 leading-relaxed">

                            <li>
                                Writing a textbook is one of the standard approaches of helping
                                Students and the Academic Community.
                            </li>

                            <li>
                                Increases leverage in the direction of increments based on
                                publication.
                            </li>

                            <li>
                                Author(s) can use the details for NAAC, UGC, NIRF, NBA, etc.
                            </li>

                            <li>
                                It adds weightage to your professional profile.
                            </li>

                            <li>
                                ISBN gives your publication unique global recognition.
                            </li>

                        </ol>

                        {/* Bottom Description */}

                        <div className="mt-12 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-xl">

                            <p className="text-lg md:text-xl leading-relaxed text-white text-justify">
                                At <strong>Veritaz International Press</strong>, we're more than
                                just a service provider—we are your partner in growth and
                                innovation. Whether you're publishing your first book,
                                securing a patent for your invention, or looking to advance
                                your academic career, we're here to support you every step of
                                the way.
                            </p>

                        </div>

                    </div>
                </section>

            </div>

        </>
    );
}
