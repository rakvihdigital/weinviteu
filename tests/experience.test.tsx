import { createRef } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AudioPlayer, { type AudioHandle } from "@/components/AudioPlayer";
import CinematicEntrance from "@/components/CinematicEntrance";
import PalaceScene from "@/components/PalaceScene";
import { demoInvitation } from "@/data/demoInvitation";
describe("Guest audio controls", () => {
  it("only starts after interaction, pauses, and adjusts volume", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockImplementation(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
      });
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, "pause")
      .mockImplementation(function (this: HTMLMediaElement) {
        this.dispatchEvent(new Event("pause"));
      });
    const { container } = render(<AudioPlayer value={demoInvitation} />);
    expect(play).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Play music" }));
    });
    expect(play).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Pause music" }));
    expect(pause).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("button", { name: "Audio settings" }));
    fireEvent.change(screen.getByRole("slider", { name: "Music volume" }), {
      target: { value: "0.2" },
    });
    expect(container.querySelector("audio")?.volume).toBe(0.2);
    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(container.querySelector("audio")?.volume).toBe(0);
  });
  it("exposes guest-triggered playback and reports failed audio", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(
      new Error("blocked"),
    );
    const ref = createRef<AudioHandle>();
    render(<AudioPlayer value={demoInvitation} ref={ref} />);
    await act(async () => {
      ref.current?.play();
    });
    expect(screen.getByRole("status")).toHaveTextContent("Tap play");
  });
  it("hides the player for silent invitations and supports a custom source", () => {
    const { container, rerender } = render(
      <AudioPlayer value={{ ...demoInvitation, music: "none" }} />,
    );
    expect(container.querySelector("audio")).toBeNull();
    rerender(
      <AudioPlayer
        value={{
          ...demoInvitation,
          music: "custom",
          customAudioUrl: "https://example.com/our-song.mp3",
        }}
      />,
    );
    expect(container.querySelector("audio")).toHaveAttribute(
      "src",
      "https://example.com/our-song.mp3",
    );
  });
});
describe("Cinematic entrance", () => {
  it("offers a CSS gate fallback when WebGL cannot initialize", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { container, rerender } = render(<PalaceScene variant="palace" />);
    expect(container.querySelector(".fallback-door")).toBeTruthy();
    rerender(<PalaceScene variant="palace" opening />);
    expect(container.querySelector(".doors-opening")).toBeTruthy();
    await act(async () => {
      await import("three");
    });
    expect(container.querySelector(".palace-fallback")).not.toHaveClass(
      "webgl-ready",
    );
  });
  it("opens with music after a click and completes the gate transition", () => {
    vi.useFakeTimers();
    const onOpen = vi.fn(),
      onMusic = vi.fn();
    render(
      <CinematicEntrance
        value={demoInvitation}
        onOpen={onOpen}
        onMusic={onMusic}
      />,
    );
    expect(onMusic).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole("button", { name: /Open your invitation/ }),
    );
    expect(onMusic).toHaveBeenCalledOnce();
    expect(onOpen).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2000));
    expect(onOpen).toHaveBeenCalledOnce();
  });
  it("honours opening without sound", () => {
    vi.useFakeTimers();
    const onMusic = vi.fn();
    render(
      <CinematicEntrance
        value={demoInvitation}
        onOpen={() => {}}
        onMusic={onMusic}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Open with music" }));
    fireEvent.click(
      screen.getByRole("button", { name: /Open your invitation/ }),
    );
    expect(onMusic).not.toHaveBeenCalled();
  });
});
