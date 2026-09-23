import { render, screen, fireEvent } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import RoyalWeddingWebsite from "@/components/RoyalWeddingWebsite";
import { demoInvitation } from "@/data/demoInvitation";
vi.mock("@/components/AudioPlayer",()=>({default:()=>null}));
it("opens the sealed invitation and accepts a local demo RSVP",()=>{
 render(<RoyalWeddingWebsite value={demoInvitation} entrance/>);
 fireEvent.click(screen.getByRole("button",{name:"Open wedding invitation"}));
 expect(screen.getByRole("heading",{name:demoInvitation.names})).toBeInTheDocument();
 expect(screen.getByRole("link",{name:/Get directions/})).toHaveAttribute("href",expect.stringContaining("maps/search"));
 fireEvent.change(screen.getByLabelText("Your name"),{target:{value:"Maya"}});
 fireEvent.click(screen.getByRole("button",{name:/Send demo RSVP/}));
 expect(screen.getByRole("status")).toHaveTextContent("Thank you, Maya!");
});
