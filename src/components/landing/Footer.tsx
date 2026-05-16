import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Send, ArrowRight, Globe } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F14] text-white">
      <div className="mx-auto max-w-7xl px-8 pt-20 pb-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Column 1 – Brand */}
          <div className="lg:col-span-1 flex flex-col gap-6 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Image
                src="/Agaaw_logo_noBG.png"
                alt="Agaaw Logo"
                width={48}
                height={48}
                className="object-contain filter brightness-110"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-white leading-none">Agaaw</span>
                <span className="text-[10px] uppercase tracking-widest text-elm font-bold mt-1">Fly to Your Future</span>
              </div>
            </div>
            <p className="text-sm text-bombay leading-relaxed">
              Agaaw is your one-stop platform to discover international scholarships, universities, and global education opportunities. We make your journey to studying abroad easier, faster, and more reliable.
            </p>
          </div>

          {/* Column 2 – Platform */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Platform</h4>
            <nav className="flex flex-col gap-4">
              {["Scholarships", "Countries", "Blogs"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-bombay text-sm hover:text-elm transition-all hover:translate-x-1 inline-block"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 – Company */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Company</h4>
            <nav className="flex flex-col gap-4">
              {["About Us", "Contact", "Terms", "Privacy Policy"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-bombay text-sm hover:text-elm transition-all hover:translate-x-1 inline-block"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4 – Support */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Support</h4>
            <nav className="flex flex-col gap-4 text-sm text-bombay">
              <Link href="/faq" className="hover:text-elm transition-colors">FAQs</Link>
              <a href="mailto:support@agaaw.com" className="hover:text-elm transition-colors">Email us : <span className="text-sm font-semibold">support@agaaw.com</span></a>
              <Link href="tel:" className="hover:text-elm transition-colors">Phone us : <span className="text-sm font-semibold">+8801735081122</span></Link>
              <p className="mt-2 text-[11px] font-medium text-white/40 leading-relaxed italic">
                “Building the future of global education access”
              </p>
            </nav>
          </div>

          {/* Column 5 – Stay Updated */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Stay Updated</h4>
            <p className="text-sm text-bombay">Get latest scholarships & updates delivered to your inbox.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-elm/50 focus:border-elm/50 transition-all placeholder:text-white/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-elm text-white px-4 rounded-lg hover:bg-elm/90 transition-all flex items-center justify-center group-hover:scale-105"
                aria-label="Subscribe"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="flex gap-4 pt-2 justify-center md:justify-start">
              {[
                { icon: Facebook, href: "https://www.facebook.com/agaaw.inc" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/agaaw" },
                { icon: Send, href: "https://t.me/agaawofficial" }
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-bombay hover:text-elm hover:bg-elm/10 hover:border-elm/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-bombay font-medium">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} Agaaw. All rights reserved.</p>
            <div className="hidden md:block w-px h-3 bg-white/10" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <span>Built for students worldwide</span>
            <span className="text-sm">🌍</span>
          </div>
        </div>
      </div>
    </footer>
  );
}