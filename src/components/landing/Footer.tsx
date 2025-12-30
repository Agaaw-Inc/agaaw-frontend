import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Twitter, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-bombay/20 bg-codgray">
      <div className="mx-auto max-w-7xl px-6 py-12">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/Agaaw_logo_noBG.png"   
                alt="Agaaw Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <p className="text-2xl font-bold text-white tracking-tight">Agaaw</p>
            </div>
            <p className="text-sm text-bombay leading-relaxed">
              Empowering your journey to success. Fly to your future with our expert guidance.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="#" className="text-bombay hover:text-white transition-colors"><Facebook size={20} /></Link>
              <Link href="#" className="text-bombay hover:text-white transition-colors"><Linkedin size={20} /></Link>
              <Link href="#" className="text-bombay hover:text-white transition-colors"><Twitter size={20} /></Link>
            </div>
          </div>

          {/* 2. Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Company</h4>
            <nav className="flex flex-col gap-2 text-sm text-bombay">
              <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              <Link href="/services" className="hover:text-white transition-colors">Our Services</Link>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          {/* 3. Support Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Support</h4>
            <nav className="flex flex-col gap-2 text-sm text-bombay">
              <Link href="/faq" className="hover:text-white transition-colors">Help Center / FAQ</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </nav>
          </div>

          {/* 4. Newsletter Section */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm">Stay Updated</h4>
            <p className="text-sm text-bombay">Subscribe to get the latest news and offers.</p>
            <form className="relative flex mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-bombay/10 border border-bombay/20 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:border-white/40 transition-all"
              />
              <button 
                type="submit" 
                className="absolute right-1 top-1 bottom-1 bg-white text-codgray px-3 rounded-md hover:bg-bombay transition-colors"
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-bombay/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-bombay/60">
          <p>© {new Date().getFullYear()} Agaaw. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Made with ❤️ for your future</span>
          </div>
        </div>

      </div>
    </footer>
  );
}