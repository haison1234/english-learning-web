import { Mail, Twitter, Github } from 'lucide-react'

// ─────────────────────────────────────────
// SOCIAL ICONS – Desktop (vertical stack)
// ─────────────────────────────────────────
export function SocialIconsDesktop() {
  return (
    <div className="flex flex-col gap-3">
      {[Mail, Twitter, Github].map((Icon, i) => (
        <button
          key={i}
          className="liquid-glass w-14 h-14 rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
        >
          <Icon size={20} className="text-[#EFF4FF]" />
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// SOCIAL ICONS – Mobile (horizontal row)
// ─────────────────────────────────────────
export function SocialIconsMobile() {
  return (
    <div className="flex flex-row gap-3 justify-center lg:hidden mt-8">
      {[Mail, Twitter, Github].map((Icon, i) => (
        <button
          key={i}
          className="liquid-glass w-14 h-14 rounded-[1rem] flex items-center justify-center hover:bg-white/10 transition-colors duration-200"
        >
          <Icon size={20} className="text-[#EFF4FF]" />
        </button>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// SOCIAL ICONS – CTA section (vertical, inside liquid-glass pill)
// ─────────────────────────────────────────
export function SocialIconsCTA() {
  return (
    <div
      className="liquid-glass rounded-[0.5rem] sm:rounded-[0.75rem] md:rounded-[1rem] lg:rounded-[1.25rem] flex flex-col overflow-hidden"
    >
      {[Mail, Twitter, Github].map((Icon, i) => (
        <button
          key={i}
          className={`
            flex items-center justify-center
            w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]
            h-[14vw] sm:h-[14.375rem] md:h-[10.78125rem] lg:h-[5.59rem]
            hover:bg-white/10 transition-colors duration-200
            ${i < 2 ? 'border-b border-white/10' : ''}
          `}
        >
          <Icon size={20} className="text-[#EFF4FF]" />
        </button>
      ))}
    </div>
  )
}
