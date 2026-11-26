// IDHN / إذن — Tailwind theme extension
export const idhnTheme = {
  colors: {
    obsidian: "#0B0B10", charcoal: "#1A1B22", purple: "#6A3DF7", stonePurple: "#A89BC8", softStone: "#E7E5ED",
    allowed: "#16835D", review: "#B96B00", blocked: "#C83C45", signal: "#D69572"
  },
  fontFamily: { ar: ["Cairo","system-ui","sans-serif"], arLong: ["Markazi Text","serif"], sans: ["Inter","system-ui","sans-serif"] },
  borderRadius: { sm:"10px", md:"14px", lg:"20px", xl:"28px" },
  boxShadow: { surface:"0 8px 28px rgba(23,18,44,.08)", floating:"0 18px 60px rgba(39,23,79,.16)" },
  transitionTimingFunction: { idhn:"cubic-bezier(.2,.8,.2,1)" }
} as const;
