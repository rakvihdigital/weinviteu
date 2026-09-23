import type { ReactNode } from "react";

/** Template-specific hero illustrations, shared by the collection and guest websites. */
export default function DistinctInvitationArtwork({ id }: { id: string }) {
  const gold = "var(--art-gold)";
  const petal = "var(--art-petal)";
  const leaf = "var(--art-leaf)";
  const paper = "var(--art-paper)";
  let art: ReactNode;
  switch (id) {
    case "ivory-sonnet":
      art = (
        <>
          <ellipse
            cx="200"
            cy="386"
            rx="130"
            ry="14"
            fill="currentColor"
            opacity=".06"
          />
          <g stroke={gold} strokeWidth="15">
            <circle cx="150" cy="260" r="76" />
            <circle cx="247" cy="260" r="76" />
          </g>
          <path
            d="m226 162 21-31 22 31-22 28Z"
            fill={paper}
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="m85 140 5 17 17 5-17 5-5 17-5-17-17-5 17-5Z" fill={gold} />
          <path d="M160 95q40 32 80 0" stroke="currentColor" opacity=".3" />
        </>
      );
      break;
    case "engagement-sonnet":
      art = (
        <>
          <g transform="rotate(-8 200 250)">
            <path
              d="m55 204 145-99 145 99v180H55Z"
              fill={petal}
              stroke="currentColor"
            />
            <rect
              x="90"
              y="133"
              width="220"
              height="216"
              rx="5"
              fill={paper}
              stroke="currentColor"
            />
            <path
              d="M124 178h150m-150 22h112m-112 22h135"
              stroke="currentColor"
              opacity=".3"
            />
            <path
              d="m55 204 145 110 145-110v180H55Z"
              fill={petal}
              stroke="currentColor"
            />
            <path d="m55 384 119-94m171 94-119-94" stroke="currentColor" />
            <circle cx="200" cy="314" r="30" fill={gold} />
            <path d="M200 325c-35-20-16-40 0-21 16-19 35 1 0 21" fill={paper} />
          </g>
        </>
      );
      break;
    case "birthday-bloom":
      art = (
        <>
          <circle cx="205" cy="235" r="110" fill={gold} opacity=".25" />
          {[
            [105, 175, petal],
            [210, 120, gold],
            [294, 202, leaf],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <ellipse
                cx={Number(x)}
                cy={Number(y)}
                rx="55"
                ry="72"
                fill={String(c)}
                stroke="currentColor"
              />
              <path
                d={`M${x} ${Number(y) + 74}q-30 70 ${200 - Number(x)} ${395 - Number(y) - 74}`}
                stroke="currentColor"
              />
              <path
                d={`m${Number(x) - 7} ${Number(y) + 77} 7-9 7 9Z`}
                fill={String(c)}
              />
              <ellipse
                cx={Number(x) - 17}
                cy={Number(y) - 27}
                rx="10"
                ry="23"
                fill="white"
                opacity=".3"
              />
            </g>
          ))}
          <path
            d="m55 325 15 12m245-232 12 15M320 340l19-6"
            stroke={gold}
            strokeWidth="5"
          />
        </>
      );
      break;
    case "baby-garden":
      art = (
        <>
          <path
            d="M200 354V199m0 91-54-49m54 9 51-47"
            stroke={leaf}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M200 284q-100 8-102-67 82-9 102 67m0-40q99 0 99-64-82 0-99 64"
            fill={leaf}
          />
          {[0, 60, 120, 180, 240, 300].map((r) => (
            <ellipse
              key={r}
              cx="200"
              cy="124"
              rx="26"
              ry="51"
              transform={`rotate(${r} 200 170)`}
              fill={petal}
              stroke="currentColor"
              strokeWidth=".8"
            />
          ))}
          <circle cx="200" cy="170" r="28" fill={gold} />
          <path
            d="M120 326h160l-24 94H144Z"
            fill={paper}
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M110 325h180v23H110Z" fill={gold} />
          <path d="M188 379q12 18 24 0" stroke="currentColor" strokeWidth="2" />
        </>
      );
      break;
    case "baby-starlight":
      art = (
        <>
          <path
            d="M200 40v65M85 164q115-115 230 0M105 152v108m95-150v110m95-67v150"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m105 237 13 27 30 4-22 22 6 30-27-15-27 15 6-30-22-22 30-4Z"
            fill={gold}
          />
          <path d="M227 208a49 49 0 10 0 88 44 44 0 010-88" fill={petal} />
          <path
            d="m295 280 12 24 27 4-20 19 5 27-24-13-24 13 5-27-20-19 27-4Z"
            fill={gold}
          />
          <ellipse
            cx="200"
            cy="395"
            rx="126"
            ry="13"
            fill="currentColor"
            opacity=".06"
          />
        </>
      );
      break;
    case "home-garden":
      art = (
        <>
          <path
            d="M145 395V195m0 70q-95 0-90-90 89 6 90 90m0-38q90-8 91-87-84 0-91 87"
            fill={leaf}
            stroke="currentColor"
          />
          <path
            d="M81 310h127l-18 110H99Z"
            fill={petal}
            stroke="currentColor"
          />
          <g transform="rotate(25 275 285)" stroke={gold} strokeWidth="16">
            <circle cx="275" cy="244" r="40" />
            <path d="M275 284v116m0-18h32m-32-30h22" />
          </g>
        </>
      );
      break;
    case "home-gazette":
      art = (
        <>
          <rect
            x="80"
            y="82"
            width="240"
            height="334"
            rx="110"
            fill={petal}
            opacity=".4"
          />
          <path
            d="M122 382V180a78 78 0 01156 0v202Z"
            fill={paper}
            stroke="currentColor"
            strokeWidth="3"
          />
          <path d="M150 354V185a50 50 0 01100 0v169Z" fill={leaf} />
          <circle cx="231" cy="278" r="7" fill={gold} />
          <path d="M96 383h208v20H96Z" fill={gold} />
          <path
            d="m312 203 15-9m-7 46h20m-28 32 14 11"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      );
      break;
    case "festival-palace":
      art = (
        <>
          <path
            d="M65 60q135 100 270 0M120 89v75m160-75v75"
            stroke="currentColor"
            strokeWidth="2"
          />
          {[120, 280].map((x, i) => (
            <g key={x}>
              <path
                d={`m${x} 140 47 50v100l-47 40-47-40V190Z`}
                fill={i ? petal : gold}
                stroke="currentColor"
              />
              <path
                d={`M${x} 150v171m-47-131h94m-94 100h94m-47 40v52m-13-40v29m26-29v29`}
                stroke="currentColor"
                opacity=".6"
              />
            </g>
          ))}
          <path d="M139 393h122q-10 40-61 40t-61-40" fill={gold} />
          <path d="M200 393q-42-36 0-73 40 37 0 73" fill={petal} />
        </>
      );
      break;
    case "pooja-botanical":
      art = (
        <>
          <path
            d="M118 281h164q-8 95-82 95t-82-95Z"
            fill={gold}
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M200 285q-102-43-73-101 64 6 73 101m0 0q105-48 80-108-75 15-80 108m0-4q-53-76 0-135 54 65 0 135"
            fill={leaf}
            stroke="currentColor"
          />
          <ellipse
            cx="200"
            cy="215"
            rx="43"
            ry="65"
            fill={petal}
            stroke="currentColor"
          />
          <path
            d="M177 159q-15 60 0 106m24-116q-15 65 0 120m22-109q-8 47 0 94"
            stroke="currentColor"
            opacity=".25"
          />
          <path d="M154 375h92v17h-92" fill={gold} />
          <circle cx="200" cy="324" r="13" fill={paper} />
        </>
      );
      break;
    case "corporate-pass":
      art = (
        <>
          <path d="m120 43 80 132 80-132" stroke={petal} strokeWidth="24" />
          <g transform="rotate(-8 200 285)">
            <rect
              x="85"
              y="165"
              width="230"
              height="245"
              rx="22"
              fill={paper}
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect x="161" y="183" width="78" height="12" rx="6" fill={leaf} />
            <circle cx="200" cy="252" r="32" fill={gold} />
            <path
              d="M133 314h134m-134 17h80"
              stroke="currentColor"
              strokeWidth="7"
            />
            {Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                d={`M${132 + i * 10} 365v25`}
                stroke="currentColor"
                strokeWidth={(i % 3) + 1}
              />
            ))}
          </g>
        </>
      );
      break;
    case "corporate-editorial":
      art = (
        <>
          <g transform="rotate(-12 200 250)">
            <path d="M94 119h229v287H94Z" fill={petal} />
            <path
              d="M65 90h229v287H65Z"
              fill={paper}
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M94 129h169m-169 20h91"
              stroke="currentColor"
              strokeWidth="9"
            />
            <path d="M96 190h168v105H96Z" fill={leaf} />
            <path
              d="m118 270 47-47 29 29 48-45m-30 0h30v30"
              stroke={paper}
              strokeWidth="9"
            />
            <path
              d="M95 323h168m-168 17h113"
              stroke="currentColor"
              strokeWidth="4"
            />
          </g>
        </>
      );
      break;
    default:
      return null;
  }
  return (
    <svg
      viewBox="0 0 400 480"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-artwork={id}
    >
      {art}
    </svg>
  );
}

export const distinctArtworkIds = new Set([
  "ivory-sonnet",
  "engagement-sonnet",
  "birthday-bloom",
  "baby-garden",
  "baby-starlight",
  "home-garden",
  "home-gazette",
  "festival-palace",
  "pooja-botanical",
  "corporate-pass",
  "corporate-editorial",
]);
