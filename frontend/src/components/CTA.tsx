import { SocialIconsCTA } from './SocialIcons'

const CTA_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4'

export default function CTA() {
  return (
    <section id="contact" className="relative w-full overflow-hidden">
      {/* ── Video: native aspect ratio (NOT object-cover) ── */}
      <video
        src={CTA_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto block"
      />

      {/* ── Absolute overlay: text block (right-aligned) ── */}
      <div className="absolute inset-0 flex items-center lg:pr-[20%] lg:pl-[15%] px-6 sm:px-10 md:px-16">
        <div className="relative ml-auto w-full lg:w-auto">

          {/* "Go beyond" cursive */}
          <span
            className="font-condiment text-[#6FFF00] absolute pointer-events-none"
            style={{
              fontSize: 'clamp(17px, 4vw, 68px)',
              top: '-0.8em',
              left: 0,
              mixBlendMode: 'exclusion',
            }}
          >
            Go beyond
          </span>

          {/* Main heading */}
          <h2
            className="font-grotesk text-[#EFF4FF] uppercase text-right lg:text-left"
            style={{ fontSize: 'clamp(16px, 4vw, 60px)', lineHeight: 1.0 }}
          >
            <span className="block mb-4 sm:mb-6 md:mb-8 lg:mb-12">JOIN US.</span>
            <span className="block">LEARN WHAT'S</span>
            <span className="block">POSSIBLE.</span>
            <span className="block">DEFINE YOUR NEXT.</span>
            <span className="block">FOLLOW THE PATH.</span>
          </h2>
        </div>
      </div>

      {/* ── Social icons – bottom-left, absolute ── */}
      <div
        className="absolute left-[8%] hidden sm:flex"
        style={{ bottom: 'clamp(12%, 15%, 20%)' }}
      >
        <SocialIconsCTA />
      </div>
    </section>
  )
}
