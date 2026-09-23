import { renderToStaticMarkup } from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompleteInvitationWebsite from "@/components/CompleteInvitationWebsite";
import { websiteDirections } from "@/data/websiteDirections";
import { templates } from "@/data/templates";
import { invitationForTemplate } from "@/data/demoInvitation";
vi.mock("@/components/AudioPlayer",()=>({default:()=>null}));
describe('complete template websites',()=>{
 it('covers every non-royal template with a distinct full website direction',()=>{
  const collection=templates.filter(t=>t.id!=='royal-garden');
  expect(Object.keys(websiteDirections).sort()).toEqual(collection.map(t=>t.id).sort());
  expect(new Set(Object.values(websiteDirections).map(d=>d.layout)).size).toBe(collection.length);
  for(const template of collection){
   const value=invitationForTemplate(template);
   const html=renderToStaticMarkup(<CompleteInvitationWebsite template={template} value={value}/>);
   expect(html).toContain(`data-website="${websiteDirections[template.id].layout}"`);
   expect(html).toContain('Invitation sections');
   expect(html).toContain('Send demo RSVP');
   expect(html).toContain('maps/search');
   expect(html).not.toContain('Invalid Date');
  }
 });
 it('opens a themed entrance, accepts demo replies and edits the right section',()=>{
  const template=templates.find(t=>t.id==='golden-hour')!;
  const edit=vi.fn();
  render(<CompleteInvitationWebsite template={template} value={invitationForTemplate(template)} entrance onEdit={edit}/>);
  fireEvent.click(screen.getByRole('button',{name:'Unlock your pass'}));
  fireEvent.click(screen.getByRole('button',{name:'Edit story section'}));
  expect(edit).toHaveBeenCalledWith('Story');
  fireEvent.change(screen.getByLabelText('Your name'),{target:{value:'Maya'}});
  fireEvent.change(screen.getByLabelText('Can you make it?'),{target:{value:'no'}});
  fireEvent.click(screen.getByRole('button',{name:'Send demo RSVP'}));
  expect(screen.getByRole('status')).toHaveTextContent('Thank you, Maya! Your demo response is unable to attend');
 });
 it('respects optional sections and selected colours',()=>{
  const template=templates.find(t=>t.id==='baby-garden')!;
  const value={...invitationForTemplate(template),story:'',gallery:[],countdownEnabled:false,rsvpEnabled:false,palette:'lavender' as const};
  const html=renderToStaticMarkup(<CompleteInvitationWebsite template={template} value={value}/>);
  expect(html).toContain('--site-bg:#e8def5');
  expect(html).not.toContain('Send demo RSVP');
  expect(html).not.toContain('sample gallery');
  expect(html).not.toContain('Something to look forward to.');
 });
});
