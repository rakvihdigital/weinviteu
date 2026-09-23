import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import GalleryUpload from '@/components/GalleryUpload';
import GalleryImage from '@/components/GalleryImage';
import { savePhoto, readPhoto } from '@/lib/localPhotos';
import { encodeInvitation, decodeInvitation } from '@/lib/share';
import { demoInvitation } from '@/data/demoInvitation';
vi.mock('@/lib/localPhotos', async importOriginal => ({...await importOriginal<typeof import('@/lib/localPhotos')>(),preparePhoto:vi.fn().mockResolvedValue('data:image/jpeg;base64,dGVzdA==')}));
afterEach(()=>{cleanup();localStorage.clear();});
it('uploads a photo locally, displays it, and supports removal',async()=>{
 const changed=vi.fn();
 const {rerender}=render(<GalleryUpload gallery={[]} onChange={changed}/>);
 fireEvent.change(screen.getByLabelText('Upload gallery photos'),{target:{files:[new File(['photo'],'memory.jpg',{type:'image/jpeg'})]}});
 await waitFor(()=>expect(changed).toHaveBeenCalled());
 const refs=changed.mock.calls[0][0];
 expect(refs[0]).toMatch(/^local:/);
 expect(readPhoto(refs[0])).toBe('data:image/jpeg;base64,dGVzdA==');
 rerender(<GalleryUpload gallery={refs} onChange={changed}/>);
 expect(screen.getByRole('img',{name:'Uploaded celebration photo'})).toHaveAttribute('src','data:image/jpeg;base64,dGVzdA==');
 fireEvent.click(screen.getByRole('button',{name:'Remove photo 1'}));
 expect(changed).toHaveBeenLastCalledWith([]);
});
it('shares only local photo references and reloads the image in this browser',()=>{
 const id=savePhoto('data:image/jpeg;base64,dGVzdA==');
 const hash=encodeInvitation({...demoInvitation,gallery:['garden',id]});
 expect(hash.length).toBeLessThan(24000);
 const restored=decodeInvitation(hash);
 expect(restored.gallery).toEqual(['garden',id]);
 render(<GalleryImage id={restored.gallery[1]}/>);
 expect(screen.getByRole('img')).toHaveAttribute('src','data:image/jpeg;base64,dGVzdA==');
});
it('shows an honest placeholder when a photo is unavailable on another device',()=>{
 render(<GalleryImage id="local:12345678-1234-1234-1234-123456789012"/>);
 expect(screen.getByRole('img')).toHaveTextContent('Photo available only in the browser');
});
it('enforces gallery limits and rejects unsafe photo references',()=>{
 expect(()=>encodeInvitation({...demoInvitation,gallery:Array(13).fill('garden')})).toThrow();
 expect(()=>encodeInvitation({...demoInvitation,gallery:['https://example.com/private.jpg']})).toThrow();
});
