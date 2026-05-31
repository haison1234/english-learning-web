const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4'

const DECO_TEXT =
  'A journey to mastery beyond time and place. An exploration of language, form, and silence in sound.'

export default function About() {
  return (
    <section id="about" className="relative w-full min-h-screen overflow-hidden">
      {/* ── Full-bleed video background ── */}
      <video
        src={ABOUT_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ── Content container ── */}
      <div className="relative z-10 max-w-[1831px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-24 flex flex-col justify-between min-h-screen">

        {/* ── TOP ROW ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-0">

          {/* Left: Heading */}
          <div className="relative">
            <h2
              className="font-grotesk text-[#EFF4FF] uppercase"
              style={{ fontSize: 'clamp(32px, 5vw, 60px)', lineHeight: 1.05 }}
            >
              Hello!
              <br />
              I'm English.Learn
            </h2>

            {/* Cursive overlay "Orbis"-style */}
            <span
              className="font-condiment text-[#6FFF00] absolute pointer-events-none"
              style={{
                fontSize: 'clamp(36px, 5vw, 68px)',
                bottom: '-0.3em',
                right: '-0.5em',
                rotate: '4deg',
                mixBlendMode: 'exclusion',
              }}
            >
              Learn
            </span>
          </div>

          {/* Right: Short description */}
          <p
            className="font-mono text-[#EFF4FF] uppercase"
            style={{ fontSize: 'clamp(14px, 1.2vw, 16px)', maxWidth: 266, lineHeight: 1.7 }}
          >
            A digital journey fixed beyond time and place. An exploration of language, form, and silence in speech.
          </p>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-row items-end justify-between mt-12 lg:mt-0">

          {/* Left deco column */}
          <div className="flex flex-col gap-4">
            <p
              className="font-mono uppercase opacity-10 text-[#010828] lg:text-[#EFF4FF]"
              style={{ fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: 266, lineHeight: 1.7 }}
            >
              {DECO_TEXT}
            </p>
            <p
              className="font-mono uppercase opacity-10 text-[#010828] lg:text-[#EFF4FF]"
              style={{ fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: 266, lineHeight: 1.7 }}
            >
              {DECO_TEXT}
            </p>
          </div>

          {/* Right deco column – hidden below lg */}
          <div className="hidden lg:flex flex-col gap-4 text-right">
            <p
              className="font-mono uppercase opacity-10 text-[#EFF4FF]"
              style={{ fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: 266, lineHeight: 1.7 }}
            >
              {DECO_TEXT}
            </p>
            <p
              className="font-mono uppercase opacity-10 text-[#EFF4FF]"
              style={{ fontSize: 'clamp(11px, 1vw, 14px)', maxWidth: 266, lineHeight: 1.7 }}
            >
              {DECO_TEXT}
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
