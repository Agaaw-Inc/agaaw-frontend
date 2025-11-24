import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-bombay/20 bg-codgray">
      <div className="mx-auto max-w-7xl px-6 py-10 text-center">

        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <Image
              src="/agaaw_logo_noBG.png"   
              alt="Agaaw Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <p className="text-xl font-semibold text-white">Agaaw</p>
          </div>

          <p className="text-sm text-bombay">
            Fly to your Future
          </p>
        </div>

        {/* Bottom text */}
        <div className="mt-6 text-sm text-bombay/80">
          © {new Date().getFullYear()} Agaaw. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
