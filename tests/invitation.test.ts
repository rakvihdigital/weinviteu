import { describe, it, expect } from "vitest";
import { invitationSchema } from "@/types/invitation";
import { demoInvitation, invitationForTemplate } from "@/data/demoInvitation";
import { templates } from "@/data/templates";
import { encodeInvitation, decodeInvitation } from "@/lib/share";
describe("Invitation V2 compatibility and validation", () => {
  it("loads earlier invitation links with safe 3D/audio defaults", () => {
    const legacy = { ...demoInvitation } as Record<string, unknown>;
    delete legacy.entrance;
    delete legacy.musicVolume;
    delete legacy.customAudioUrl;
    expect(invitationSchema.parse(legacy)).toMatchObject({
      entrance: "palace",
      musicVolume: 0.55,
      customAudioUrl: "",
    });
  });
  it("preserves audio and entrance settings through shared links", () => {
    const value = {
      ...demoInvitation,
      names: "ಕಾವ್ಯ & Arjun",
      entrance: "celestial" as const,
      music: "ambient" as const,
      musicVolume: 0.3,
    };
    expect(decodeInvitation(encodeInvitation(value))).toEqual(value);
  });
  it("rejects unsafe or malformed audio URLs", () => {
    for (const url of [
      "javascript:alert(1)",
      "http://example.com/song.mp3",
      "https://",
      "https://user:secret@example.com/song.mp3",
    ])
      expect(
        invitationSchema.safeParse({ ...demoInvitation, customAudioUrl: url })
          .success,
      ).toBe(false);
    expect(
      invitationSchema.safeParse({
        ...demoInvitation,
        customAudioUrl: "https://example.com/song.mp3",
      }).success,
    ).toBe(true);
  });
  it("validates every template and gives dark designs a celestial entrance", () => {
    for (const t of templates) {
      const value = invitationForTemplate(t);
      expect(invitationSchema.safeParse(value).success).toBe(true);
      if (t.theme === "midnight") expect(value.entrance).toBe("celestial");
    }
  });
});
