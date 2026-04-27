// src/components/LandingPage.tsx
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Clock, CreditCard, ShoppingBag, Star, Users, CheckCircle2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Data for the Infinite Slider
const testimonials = [
  { name: "David O.", role: "Engineering Dept, 300L", initial: "D", color: "bg-blue-100 text-blue-600", text: "Honestly a lifesaver between classes. I used to waste 30 minutes just standing at the vendor waiting to order. Now I order while the lecturer is wrapping up." },
  { name: "Sarah M.", role: "Business Admin, 400L", initial: "S", color: "bg-purple-100 text-purple-600", text: "The Paystack integration is flawless. I hate carrying cash around campus, and this just makes everything so much cleaner. Highly recommend!" },
  { name: "Tobi A.", role: "Computer Science, 200L", initial: "T", color: "bg-green-100 text-green-600", text: "Bro, the UI is so clean! I can literally see when my burger is being packaged. Best innovation in UNIPORT this year hands down." },
  { name: "Jessica K.", role: "Law, 500L", initial: "J", color: "bg-rose-100 text-rose-600", text: "I study in the library all day. Being able to pre-order my lunch and just pick it up saves me so much stress and keeps my focus locked." },
  { name: "Michael E.", role: "Medicine, 300L", initial: "M", color: "bg-amber-100 text-amber-600", text: "Prices are exactly what they are at the physical stands. No hidden fees, just pure convenience. The vendors are super fast too." },
  { name: "Precious U.", role: "Accounting, 100L", initial: "P", color: "bg-teal-100 text-teal-600", text: "As a fresher, finding good food was hard. CampusKlub showed me all the best spots instantly. The interface is just so easy to use." },
];

export default function LandingPage() {
  return (
    // overflow-hidden prevents the slider from breaking the mobile width
    <div className="min-h-screen bg-white font-sans selection:bg-[#FFD100]/30 overflow-hidden w-full">
      
      {/* INLINE STYLES FOR INFINITE MARQUEE */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide {
          animation: slide 40s linear infinite;
        }
        .animate-slide:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* --- NAVIGATION BAR --- */}
      <nav className="absolute top-0 left-0 w-full z-50 px-4 md:px-6 py-6 flex justify-between items-center max-w-7xl mx-auto right-0">
        <div className="flex items-center gap-2 text-white">
          <div className="bg-[#FFD100] p-1.5 md:p-2 rounded-xl text-slate-900 shadow-lg shadow-[#FFD100]/20">
            <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter">CampusKlub.</span>
        </div>
        <Link href="/get-started">
          <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white rounded-full font-bold text-sm md:text-base px-4 md:px-6">
            Log In
          </Button>
        </Link>
      </nav>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-28 pb-32 md:pt-32 md:pb-48 px-4 bg-slate-950 text-white w-full">
        <div className="absolute top-10 left-0 md:left-10 w-64 md:w-72 h-64 md:h-72 bg-[#FFD100]/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-0 md:right-10 w-72 md:w-96 h-72 md:h-96 bg-orange-500/15 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-700" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 mt-6 md:mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-medium text-xs md:text-sm mb-6 md:mb-8 backdrop-blur-sm cursor-default">
            <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD100] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-[#FFD100]"></span>
            </span>
            Now live at UNIPORT
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-6 leading-[1.1] md:leading-[1.1]">
            Craving something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD100] to-orange-500">
              Skip the line.
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 md:mb-10 max-w-2xl mx-auto px-2 font-medium">
            The easiest way to order food from your favorite campus vendors. Order online, track your meal, and pick it up exactly when it's hot and ready.
          </p>
          
          <div className="flex justify-center items-center px-4 sm:px-0">
            <Link href="/get-started" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-14 md:h-16 px-6 md:px-8 text-base md:text-lg rounded-full bg-[#FFD100] text-slate-950 hover:bg-white font-bold transition-all hover:scale-105 shadow-[0_0_30px_-10px_rgba(255,209,0,0.4)]">
                Start Ordering Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. STATS SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 -mt-20 md:-mt-24 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center sm:divide-x divide-slate-100 border border-slate-100">
          <div className="flex flex-col items-center justify-center">
            <Users className="w-6 h-6 md:w-8 md:h-8 text-orange-500 mb-2 md:mb-3" />
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">10k+</h3>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Happy Students</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500 mb-2 md:mb-3" />
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">50k+</h3>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Orders Delivered</p>
          </div>
          <div className="flex flex-col items-center justify-center pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-[#FFD100] mb-2 md:mb-3 fill-[#FFD100]" />
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-1">4.9/5</h3>
            <p className="text-xs md:text-sm text-slate-500 font-bold uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </section>

      {/* --- 3. HOW IT WORKS SECTION --- */}
      <section className="py-20 md:py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-base md:text-lg text-slate-500 mt-3 md:mt-4">Get your food in three simple steps.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {[
              { icon: ShoppingBag, title: "1. Choose Your Meal", desc: "Browse live menus from the best vendors right here on campus. See what's hot and in stock." },
              { icon: CreditCard, title: "2. Pay Securely", desc: "No more transferring cash. Pay instantly with your card using our secure Paystack integration." },
              { icon: Clock, title: "3. Pick It Up", desc: "Skip the waiting crowd. Get notified the second your food is packaged and ready to go." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 p-6 md:p-10 rounded-[2rem] text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group border border-slate-100">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-sm text-slate-900 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 group-hover:scale-110 group-hover:bg-[#FFD100] transition-all duration-300">
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. ANIMATED TESTIMONIALS SLIDER --- */}
      <section className="py-20 md:py-24 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="text-center mb-12 md:mb-16 px-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Word on Campus</h2>
          <p className="text-base md:text-lg text-slate-500 mt-3 md:mt-4">Don't just take our word for it.</p>
        </div>

        {/* The Sliding Marquee Container */}
        <div className="relative w-full flex py-4">
          <div className="flex animate-slide w-max gap-6 px-6 cursor-pointer">
            
            {/* We render the array TWICE so the loop is perfectly seamless */}
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="w-[300px] md:w-[400px] flex-shrink-0 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 relative group hover:shadow-md transition-shadow">
                <Quote className="absolute top-6 right-6 w-8 h-8 md:w-10 md:h-10 text-slate-100 group-hover:text-orange-50 transition-colors" />
                <div className="flex gap-1 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-[#FFD100] fill-[#FFD100]" />)}
                </div>
                <p className="text-sm md:text-base text-slate-700 mb-6 md:mb-8 relative z-10 leading-relaxed font-medium">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 md:gap-4 mt-auto">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${t.color} rounded-full flex items-center justify-center font-bold text-lg md:text-xl shrink-0`}>
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm md:text-base">{t.name}</h4>
                    <p className="text-xs md:text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>

      {/* --- 5. FOOTER --- */}
      <footer className="bg-slate-950 text-slate-400 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 border-b border-white/10 pb-10 md:pb-12 mb-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white mb-4 md:mb-6">
              <div className="bg-[#FFD100] p-1.5 rounded-lg text-slate-900">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-black text-xl md:text-2xl tracking-tighter">CampusKlub.</span>
            </div>
            <p className="text-sm md:text-base text-slate-400 max-w-sm mb-6 leading-relaxed">
              We're on a mission to win hearts, minds, and smartphones. Connecting UNIPORT vendors to students seamlessly.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base tracking-wide uppercase">Support</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Vendor Guidelines</Link></li>
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Get In Touch</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-base">
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#FFD100] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-xs md:text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} CampusKlub UNIPORT. All rights reserved.</p>
          <div className="flex items-center justify-center md:justify-end gap-1 text-slate-500">
            Designed by <span className="text-white font-bold px-1 tracking-wider">tHe 4TH GrOUp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}