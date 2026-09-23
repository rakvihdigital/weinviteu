import type { Template } from "@/types/invitation";
import DistinctInvitationArtwork, {
  distinctArtworkIds,
} from "./DistinctInvitationArtwork";

/* Original vector artwork stays sharp at every preview size and follows the palette. */
export default function InvitationArtwork({
  template,
}: {
  template: Template;
}) {
  if (distinctArtworkIds.has(template.id))
    return <DistinctInvitationArtwork id={template.id} />;
  const kind = template.category;
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  const flower = (x: number, y: number, scale = 1, rotation = 0) => (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
      {petals.map((r) => (
        <ellipse
          key={r}
          cy="-16"
          rx="8"
          ry="19"
          transform={`rotate(${r})`}
          fill="var(--art-petal)"
          stroke="currentColor"
          strokeWidth=".7"
        />
      ))}
      <circle
        r="8"
        fill="var(--art-gold)"
        stroke="currentColor"
        strokeWidth=".7"
      />
      <circle r="3" fill="currentColor" opacity=".6" />
    </g>
  );
  const branch = (x: number, y: number, flip = 1) => (
    <g
      transform={`translate(${x} ${y}) scale(${flip} 1)`}
      fill="var(--art-leaf)"
      stroke="currentColor"
      strokeWidth=".8"
    >
      <path d="M0 100Q-25 15 10-100" fill="none" />
      {[-70, -35, 0, 35, 70].map((v, i) => (
        <g key={v} transform={`translate(${-10 + i} ${v})`}>
          <path d="M0 0Q-50-40-42-57Q-5-50 0 0" />
          <path d="M0 0Q40-25 43-48Q2-40 0 0" />
        </g>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 400 480" fill="none" aria-hidden="true" focusable="false">
      {kind === "baby" ? (
        <>
          <path
            d="M50 330V220a150 150 0 01300 0v110"
            stroke="var(--art-leaf)"
            strokeWidth="25"
            opacity=".65"
          />
          <path
            d="M82 330V220a118 118 0 01236 0v110"
            stroke="var(--art-gold)"
            strokeWidth="22"
            opacity=".65"
          />
          <path
            d="M111 330V220a89 89 0 01178 0v110"
            stroke="var(--art-petal)"
            strokeWidth="20"
          />
          <ellipse
            cx="200"
            cy="392"
            rx="155"
            ry="13"
            fill="currentColor"
            opacity=".07"
          />
          {branch(55, 325, 0.5)}
          {branch(346, 315, -0.5)}
          <path
            d="M132 326c-23-65-8-101 9-89 18 13 23 55 23 55m39 24c12-72 40-95 49-75 8 20-15 49-28 72"
            fill="var(--art-paper)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <ellipse
            cx="190"
            cy="346"
            rx="66"
            ry="53"
            fill="var(--art-paper)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M157 341q8-9 15 0m32 0q8-9 15 0m-37 15 9 5 9-5m-9 5v7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse cx="153" cy="358" rx="10" ry="5" fill="var(--art-petal)" />
          <ellipse cx="224" cy="358" rx="10" ry="5" fill="var(--art-petal)" />
          {flower(287, 373, 0.7)}
          {flower(96, 387, 0.5)}
          <path
            d="m195 35 4 12 12 4-12 4-4 12-4-12-12-4 12-4Zm111 73 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"
            fill="var(--art-gold)"
          />
        </>
      ) : kind === "housewarming" ? (
        <>
          <circle
            cx="200"
            cy="216"
            r="153"
            fill="var(--art-gold)"
            opacity=".18"
          />
          <path
            d="M80 370V206L200 99l121 107v164Z"
            fill="var(--art-paper)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m58 215 142-128 145 128M78 207l122-107 121 107"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M173 370V262a28 28 0 0156 0v108Z"
            fill="var(--art-leaf)"
            stroke="currentColor"
            strokeWidth="2"
          />
          {[112, 260].map((x) => (
            <g key={x}>
              <path
                d={`M${x} 238v-28a17 17 0 0134 0v28Z`}
                fill="var(--art-gold)"
                stroke="currentColor"
              />
              <path d={`M${x + 17} 194v44m-17-21h34`} stroke="currentColor" />
            </g>
          ))}
          <circle cx="215" cy="311" r="3" fill="var(--art-gold)" />
          <path
            d="M165 373h76l34 51H130Z"
            fill="var(--art-petal)"
            opacity=".6"
          />
          {branch(54, 321, 0.6)}
          {branch(352, 310, -0.6)}
          {flower(62, 365, 0.7)}
          {flower(340, 369, 0.6)}
        </>
      ) : template.design === "disco" ? (
        <>
          <path d="M200 0v94" stroke="currentColor" />
          <circle
            cx="200"
            cy="240"
            r="144"
            fill="var(--art-paper)"
            fillOpacity=".15"
            stroke="currentColor"
          />
          {[35, 70, 105, 135].map((r) => (
            <ellipse
              key={r}
              cx="200"
              cy="240"
              rx={r}
              ry="144"
              stroke="currentColor"
              opacity=".6"
            />
          ))}
          {[-110, -70, -25, 25, 70, 110].map((y) => (
            <path
              key={y}
              d={`M${200 - Math.sqrt(144 * 144 - y * y)} ${240 + y}Q200 ${255 + y} ${200 + Math.sqrt(144 * 144 - y * y)} ${240 + y}`}
              stroke="currentColor"
              opacity=".6"
            />
          ))}
          <path
            d="m125 165 8 30 30 8-30 8-8 30-8-30-30-8 30-8Zm171 83 6 22 22 6-22 6-6 22-6-22-22-6 22-6Z"
            fill="var(--art-paper)"
          />
          {[
            [37, 80],
            [332, 122],
            [66, 397],
            [330, 417],
          ].map(([x, y]) => (
            <path
              key={x}
              d={`m${x} ${y - 15} 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z`}
              fill="var(--art-gold)"
            />
          ))}
        </>
      ) : kind === "birthday" ? (
        <>
          <circle
            cx="202"
            cy="226"
            r="159"
            fill="var(--art-gold)"
            opacity=".15"
          />
          {[70, 140, 220, 310].map((x, i) => (
            <g
              key={x}
              transform={`translate(${x} ${65 + (i % 2) * 30}) rotate(${i % 2 ? 15 : -12})`}
            >
              <path
                d="M0 0q30 30 0 65Q-30 30 0 0"
                fill={i % 2 ? "var(--art-petal)" : "var(--art-gold)"}
              />
              <path d="M0 65q-15 30 2 54" stroke="currentColor" />
            </g>
          ))}
          <path
            d="M95 369v-93q105-25 210 0v93"
            fill="var(--art-petal)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <ellipse
            cx="200"
            cy="276"
            rx="105"
            ry="25"
            fill="var(--art-paper)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M95 282q13 40 27 4 16 39 31 5 16 40 32 4 17 40 33 0 17 36 33-4 16 37 31-5 14 30 23-4"
            fill="var(--art-paper)"
            stroke="currentColor"
          />
          {[145, 200, 255].map((x) => (
            <g key={x}>
              <path
                d={`M${x - 4} 268v-62h8v62`}
                fill="var(--art-leaf)"
                stroke="currentColor"
              />
              <path
                d={`M${x} 198q-14-14 0-32 14 18 0 32Z`}
                fill="var(--art-gold)"
              />
              <path
                d={`m${x - 4} 217 8-5m-8 21 8-5m-8 22 8-5`}
                stroke="currentColor"
              />
            </g>
          ))}
          <ellipse
            cx="200"
            cy="374"
            rx="127"
            ry="17"
            fill="var(--art-gold)"
            stroke="currentColor"
          />
          <path
            d="M200 390v27m-40 0h80"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="m38 229 8 12-8 12-8-12Zm324 76 7 10-7 10-7-10Z"
            fill="var(--art-gold)"
          />
        </>
      ) : kind === "corporate" ? (
        <>
          {Array.from({ length: 9 }, (_, i) => (
            <g key={i} transform={`translate(200 240) rotate(${i * 10})`}>
              <rect
                x="-112"
                y="-147"
                width="224"
                height="294"
                rx="58"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity={0.25 + i * 0.07}
              />
            </g>
          ))}
          <circle cx="200" cy="240" r="60" fill="var(--art-gold)" />
          <path
            d="m174 266 52-52m-50 0h50v50"
            stroke="var(--preview-bg)"
            strokeWidth="6"
          />
          <path d="M40 410h320M40 70h320" stroke="currentColor" opacity=".3" />
          <circle cx="40" cy="70" r="4" fill="currentColor" />
          <circle cx="360" cy="410" r="4" fill="currentColor" />
        </>
      ) : kind === "pooja" ? (
        <>
          <g transform="translate(200 219)" stroke="currentColor">
            {[150, 135, 122].map((r) => (
              <circle key={r} r={r} strokeWidth=".7" opacity=".6" />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <g key={i} transform={`rotate(${i * 22.5})`}>
                <path
                  d="M0-140Q-34-100 0-62Q34-100 0-140Z"
                  fill="var(--art-gold)"
                  fillOpacity=".35"
                />
                <circle cy="-153" r="3" fill="currentColor" />
              </g>
            ))}
          </g>
          <path
            d="M103 298q97-26 194 0-22 83-97 83t-97-83Z"
            fill="var(--art-petal)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <ellipse
            cx="200"
            cy="298"
            rx="97"
            ry="18"
            fill="var(--art-gold)"
            stroke="currentColor"
          />
          <path
            d="M200 294q-53-49 0-117 53 68 0 117Z"
            fill="var(--art-gold)"
            stroke="currentColor"
          />
          <path d="M200 290q-22-25 0-57 22 32 0 57Z" fill="var(--art-paper)" />
          <path
            d="M172 383h56m-70 9h84"
            stroke="currentColor"
            strokeWidth="2"
          />
          {flower(62, 401, 0.65)}
          {flower(328, 398, 0.8)}
        </>
      ) : template.design === "palace" ? (
        <>
          <path
            d="M57 398V153h42v245m202 0V153h42v245M90 398V238q0-55 110-105 110 50 110 105v160"
            fill="var(--art-paper)"
            fillOpacity=".45"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M125 398V243q0-47 75-82 75 35 75 82v155"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M135 398V248q0-39 65-74 65 35 65 74v150"
            stroke="currentColor"
            strokeWidth=".7"
          />
          {[78, 322].map((x) => (
            <g key={x}>
              <path
                d={`M${x - 28} 153q0-28 28-52 28 24 28 52Zm28-53V80m-5 0h10m-29 315V166m27 229V166`}
                stroke="currentColor"
                fill="var(--art-gold)"
                fillOpacity=".5"
              />
              <path
                d={`M${x - 12} 190v29m24-29v29m-24 20v29m24-29v29`}
                stroke="currentColor"
                strokeWidth="3"
              />
            </g>
          ))}
          <path
            d="M37 400h326m-340 12h354M166 242q34-44 68 0"
            stroke="currentColor"
          />
          <circle cx="200" cy="264" r="25" stroke="currentColor" />
          <path
            d="m200 247 4 13 13 4-13 4-4 13-4-13-13-4 13-4Z"
            fill="var(--art-gold)"
          />
          {branch(34, 361, 0.33)}
          {branch(367, 360, -0.33)}
        </>
      ) : template.design === "celestial" ? (
        <>
          {[123, 148, 172].map((r, i) => (
            <ellipse
              key={r}
              cx="200"
              cy="234"
              rx={r}
              ry={r * 0.67}
              transform={`rotate(${i * 55 - 40} 200 234)`}
              stroke="currentColor"
              strokeWidth=".7"
              opacity=".6"
            />
          ))}
          <path
            d="M244 140a104 104 0 10-4 187 89 89 0 014-187Z"
            fill="var(--art-gold)"
          />
          {[
            [50, 90],
            [310, 86],
            [327, 349],
            [105, 377],
            [208, 54],
            [277, 223],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path
                d="m0-12 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z"
                fill="currentColor"
              />
              <circle
                r="19"
                stroke="currentColor"
                strokeWidth=".5"
                opacity=".4"
              />
            </g>
          ))}
        </>
      ) : template.design === "vinyl" ? (
        <>
          <rect
            x="28"
            y="82"
            width="284"
            height="324"
            rx="3"
            fill="var(--art-paper)"
            opacity=".4"
            transform="rotate(-8 170 240)"
          />
          <circle cx="220" cy="244" r="151" fill="#252520" />
          {[62, 75, 90, 105, 120, 136, 145].map((r) => (
            <circle
              key={r}
              cx="220"
              cy="244"
              r={r}
              stroke="#b6ac98"
              opacity=".3"
            />
          ))}
          <circle cx="220" cy="244" r="52" fill="var(--art-petal)" />
          <circle cx="220" cy="244" r="7" fill="#252520" />
          <path
            d="M206 215q-12-15-20-2-4 11 20 25 24-14 20-25-8-13-20 2Z"
            fill="var(--art-gold)"
          />
        </>
      ) : (
        <>
          <ellipse
            cx="200"
            cy="248"
            rx="116"
            ry="170"
            stroke="currentColor"
            strokeWidth=".7"
            opacity=".4"
          />
          {branch(103, 268)}
          {branch(302, 264, -1)}
          {flower(97, 120, 1.2, 15)}
          {flower(300, 175, 0.9, 20)}
          {flower(86, 335, 0.75)}
          {flower(279, 376, 1.15, -15)}
          {flower(134, 398, 0.55)}
          <path
            d="M151 255c0-36 49-36 49 0 0-36 49-36 49 0 0 30-49 64-49 64s-49-34-49-64Z"
            fill="var(--art-petal)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path d="m179 216 21-16 21 16m-21-16v-27" stroke="currentColor" />
          <circle cx="200" cy="165" r="4" fill="var(--art-gold)" />
        </>
      )}
    </svg>
  );
}
