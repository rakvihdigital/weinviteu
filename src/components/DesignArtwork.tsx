/** Original vector artwork for the twelve template layouts. */
export function BotanicalArt() {
  return (
    <svg
      className="design-art botanical-art"
      viewBox="0 0 300 460"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M15 450Q75 270 20 45M290 0Q225 200 288 440" />
        {Array.from({ length: 11 }, (_, i) => (
          <g
            key={i}
            transform={`translate(${i % 2 ? 260 : 35} ${25 + i * 39}) rotate(${i % 2 ? -25 : 25})`}
          >
            <path d="M0 0Q-45-30-15-49Q13-33 0 0M0 0Q42-20 30-42Q-4-34 0 0" />
            <path d="M0 0L-15-42M0 0L25-36" />
          </g>
        ))}
      </g>
    </svg>
  );
}
export function HouseArt() {
  return (
    <svg
      className="design-art house-art"
      viewBox="0 0 320 220"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M38 188H283M68 185V90L160 20L253 90V185M48 104L160 18L273 104M78 93L160 32L244 93M136 185V128Q160 100 184 128V185M93 115H120V148H93ZM201 115H228V148H201ZM211 52V20H238V74" />
        <path d="M82 194H239M29 49H107M19 58H74M242 29H290M253 37H304M16 185V148M16 165Q-8 145 16 128Q40 145 16 165M300 185V137M300 156Q275 130 300 111Q325 133 300 156" />
        <circle cx="172" cy="159" r="2" />
      </g>
    </svg>
  );
}
export function MandalaArt() {
  return (
    <svg
      className="design-art mandala-art"
      viewBox="0 0 300 300"
      aria-hidden="true"
    >
      <g
        transform="translate(150 150)"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 22.5})`}>
            <path d="M0 0Q-44-65 0-136Q44-65 0 0Z" />
            <path d="M0-28Q-26-75 0-107Q26-75 0-28Z" />
            <circle cy="-141" r="4" />
          </g>
        ))}
        <circle r="48" />
        <circle r="58" />
        <circle r="113" />
        <circle r="147" />
      </g>
    </svg>
  );
}
export function ConstellationArt() {
  return (
    <svg
      className="design-art constellation-art"
      viewBox="0 0 300 420"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth=".7" opacity=".6">
        <ellipse
          cx="150"
          cy="210"
          rx="133"
          ry="187"
          transform="rotate(17 150 210)"
        />
        <ellipse
          cx="150"
          cy="210"
          rx="115"
          ry="177"
          transform="rotate(-22 150 210)"
        />
        <path d="M35 90L70 60L105 94L178 45L260 100M29 329L88 351L117 305L195 354L272 309" />
      </g>
      {Array.from({ length: 28 }, (_, i) => (
        <circle
          key={i}
          cx={12 + ((i * 97) % 278)}
          cy={13 + ((i * 137) % 395)}
          r={i % 5 === 0 ? 2 : 1}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
