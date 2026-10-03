"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../admin.module.css";
import { Save, Send, Eye, Type, Palette, Layout, Music, Settings2, Image as ImageIcon, Upload } from "lucide-react";

const allTemplates = [
  { id: 1, title: "Anniversary Glow", filename: "anniversary-invitation (1).html" },
  { id: 2, title: "Baby Shower Bloom", filename: "baby-shower-invitation.html" },
  { id: 3, title: "Birthday Sparkle", filename: "birthday-invitation.html" },
  { id: 4, title: "Red & Gold Royale", filename: "birthday-red-gold.html" },
  { id: 5, title: "Griha Pravesh", filename: "griha-pravesh-invitation.html" },
  { id: 6, title: "Classic Elegance", filename: "invitation (2).html" },
  { id: 7, title: "Sacred Pooja", filename: "pooja-invitation.html" },
  { id: 8, title: "Summit Event", filename: "summit-invitation.html" },
  { id: 9, title: "Temple Cinematic", filename: "temple-invitation.html" },
];

export default function CustomizeTemplate() {
  const [template, setTemplate] = useState("temple-invitation.html");
  const [activeTab, setActiveTab] = useState("content");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [rawHtml, setRawHtml] = useState<string>("");
  const [modifiedHtml, setModifiedHtml] = useState<string>("");

  const [dynamicTexts, setDynamicTexts] = useState<{id: number, text: string, group: string}[]>([]);
  const [templateSupportsPhotos, setTemplateSupportsPhotos] = useState(false);
  const [templatePhotoSlots, setTemplatePhotoSlots] = useState<{id: 'customImage1' | 'customImage2', label: string}[]>([]);
  
  const [formData, setFormData] = useState({
    primaryColor: "#c49a4c",
    bgColor: "#f6f3ea",
    fontHeading: "Georgia, serif",
    fontBody: "Arial, sans-serif",
    customImage1: "",
    customImage2: "",
    musicUrl: ""
  });

  // Map template requirements
  useEffect(() => {
    if (template === "anniversary-invitation (1).html") {
      setTemplateSupportsPhotos(true);
      setTemplatePhotoSlots([
        { id: 'customImage1', label: 'Then Photo (Left Polaroid)' },
        { id: 'customImage2', label: 'Now Photo (Right Polaroid)' }
      ]);
    } else if (['invitation (2).html', 'temple-invitation.html'].includes(template)) {
      setTemplateSupportsPhotos(true);
      setTemplatePhotoSlots([{ id: 'customImage1', label: 'Couple Portrait' }]);
    } else if (['birthday-invitation.html', 'birthday-red-gold.html'].includes(template)) {
      setTemplateSupportsPhotos(true);
      setTemplatePhotoSlots([{ id: 'customImage1', label: 'Birthday Portrait' }]);
    } else if (template === 'summit-invitation.html') {
      setTemplateSupportsPhotos(true);
      setTemplatePhotoSlots([{ id: 'customImage1', label: 'Company Logo' }]);
    } else {
      setTemplateSupportsPhotos(false);
      setTemplatePhotoSlots([]);
    }
  }, [template]);

  useEffect(() => {
    fetch(`/templates/${encodeURIComponent(template)}`)
      .then(res => res.text())
      .then(html => {
        setRawHtml(html);
        setModifiedHtml(html);
      });
  }, [template]);

  // Execute the exact Javascript Variable string replacement
  useEffect(() => {
    if (!rawHtml) return;

    let newHtml = rawHtml;

    if (template === "anniversary-invitation (1).html") {
      if (formData.customImage1) {
        newHtml = newHtml.replace(/(then\s*:\s*")[^"]*(")/, `$1${formData.customImage1}$2`);
      }
      if (formData.customImage2) {
        newHtml = newHtml.replace(/(now\s*:\s*")[^"]*(")/, `$1${formData.customImage2}$2`);
      }
    } else if (['invitation (2).html', 'temple-invitation.html'].includes(template)) {
      if (formData.customImage1) {
        newHtml = newHtml.replace(/(couplePhoto\s*:\s*")[^"]*(")/, `$1${formData.customImage1}$2`);
      }
    } else if (['birthday-invitation.html', 'birthday-red-gold.html'].includes(template)) {
      if (formData.customImage1) {
        newHtml = newHtml.replace(/(photo\s*:\s*")[^"]*(")/, `$1${formData.customImage1}$2`);
      }
    } else if (template === 'summit-invitation.html') {
      if (formData.customImage1) {
        newHtml = newHtml.replace(/(logo\s*:\s*")[^"]*(")/, `$1${formData.customImage1}$2`);
      }
    }

    setModifiedHtml(newHtml);
  }, [formData.customImage1, formData.customImage2, rawHtml, template]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'customImage1' | 'customImage2') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({ ...prev, musicUrl: result }));
        try {
          const win = iframeRef.current?.contentWindow as any;
          if (win) {
            if (win.MUSIC) win.MUSIC.src = result;
            if (win.audio) {
              win.audio.src = result;
              if (!win.audio.paused) win.audio.play();
            }
          }
        } catch(err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (id: number, newText: string) => {
    setDynamicTexts(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        const el = doc.querySelector(`[data-text-id="${id}"]`);
        if (el) el.innerHTML = newText;
      }
    } catch(e) {}
  };

  const handleApplyColors = () => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        let styleEl = doc.getElementById('custom-color-override');
        if (!styleEl) {
          styleEl = doc.createElement('style');
          styleEl.id = 'custom-color-override';
          doc.head.appendChild(styleEl);
        }
        styleEl.textContent = `
          .ibg, .bgblur, .scene { filter: hue-rotate(${formData.bgColor !== '#f6f3ea' ? '45deg' : '0deg'}) !important; }
          .xname, .ph1, .etitle .b, h1, h2, h3 { color: ${formData.primaryColor} !important; }
          body { font-family: ${formData.fontBody} !important; }
          .xname, .ph1 { font-family: ${formData.fontHeading} !important; }
        `;
      }
    } catch(e) {}
  };

  const tabs = [
    { id: "content", label: "Text", icon: Type },
    { id: "design", label: "Colors", icon: Palette },
    { id: "media", label: "Media", icon: ImageIcon },
  ];

  const textGroups = ["Cover & Titles", "Event Details & Venues", "Sign-offs & Thanks"];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h2>Advanced Customizer</h2>
          <p>Order #123 • Full Dynamic Editing</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className={styles.btnSecondary}>
            <Save size={16} /> Save Draft
          </button>
          <button className={styles.btnPrimary}>
            <Send size={16} /> Generate & Send Link
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "30px", alignItems: "flex-start" }}>
        {/* Editor Area */}
        <div className={styles.card} style={{ flex: 1.2, padding: 0, overflow: "hidden" }}>
          {/* Top Template Selection */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eaeaea", background: "#fafafa" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Active Template</label>
            <select 
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
                setDynamicTexts([]);
                setFormData(prev => ({ ...prev, customImage1: "", customImage2: "", musicUrl: "" }));
              }}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", fontWeight: 600 }}
            >
              {allTemplates.map(t => (
                <option key={t.filename} value={t.filename}>{t.title}</option>
              ))}
            </select>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: "flex", borderBottom: "1px solid #eaeaea", background: "#fff" }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1, padding: "12px 0", background: "none", border: "none", cursor: "pointer",
                    borderBottom: activeTab === tab.id ? "2px solid #1a1a1a" : "2px solid transparent",
                    color: activeTab === tab.id ? "#1a1a1a" : "#888",
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", fontSize: "11px"
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "24px", minHeight: "550px", maxHeight: "550px", overflowY: "auto" }}>
            
            {/* CONTENT TAB */}
            {activeTab === "content" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Dynamic Content Editor</h3>
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>Edit text visually by sections. Changes appear instantly in the preview.</p>
                
                {dynamicTexts.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "#888", fontSize: "13px" }}>
                    Analyzing template structure...
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                    {textGroups.map((groupName, groupIdx) => {
                      const groupItems = dynamicTexts.filter(t => t.group === groupName);
                      if (groupItems.length === 0) return null;
                      
                      return (
                        <div key={groupName} style={{ border: "1px solid #eee", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ background: "#fafafa", padding: "12px 16px", borderBottom: "1px solid #eee", fontSize: "13px", fontWeight: 700, color: "#1a1a1a", borderLeft: "4px solid #c49a4c" }}>
                            {groupIdx + 1}. {groupName}
                          </div>
                          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "15px" }}>
                            {groupItems.map((item, idx) => (
                              <div key={item.id}>
                                <label style={{ display: "block", marginBottom: "6px", fontSize: "11px", fontWeight: 600, color: "#888", textTransform: "uppercase" }}>Text Element {idx + 1}</label>
                                <textarea 
                                  value={item.text} 
                                  onChange={(e) => handleTextChange(item.id, e.target.value)} 
                                  rows={item.text.length > 40 ? 2 : 1}
                                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", resize: "vertical" }} 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* DESIGN & FONTS TAB */}
            {activeTab === "design" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "20px" }}>Styling Options</h3>
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>Note: Styling requires clicking 'Apply' due to 3D canvas rendering.</p>
                <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
                  <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600 }}>Primary Accent Color</label>
                     <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} style={{ width: "30px", height: "30px", padding: 0, border: "none" }} />
                        <input type="text" name="primaryColor" value={formData.primaryColor} onChange={handleChange} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                     </div>
                  </div>
                  <div style={{ padding: "15px", border: "1px solid #eee", borderRadius: "8px" }}>
                     <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600 }}>Background Filter Shift</label>
                     <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input type="color" name="bgColor" value={formData.bgColor} onChange={handleChange} style={{ width: "30px", height: "30px", padding: 0, border: "none" }} />
                        <input type="text" name="bgColor" value={formData.bgColor} onChange={handleChange} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ddd" }} />
                     </div>
                  </div>
                  <button onClick={handleApplyColors} className={styles.btnSecondary} style={{ width: "100%", justifyContent: "center", background: "#1a1a1a", color: "#fff", border: "none" }}>
                    Force Apply Styles to Preview
                  </button>
                </div>
              </div>
            )}

            {/* MEDIA TAB - DIRECT JAVASCRIPT INJECTION */}
            {activeTab === "media" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h3 style={{ fontSize: "16px", marginBottom: "5px" }}>Template Photo Engine</h3>
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
                  Directly inject photos natively into the template's Javascript engine.
                </p>
                
                {!templateSupportsPhotos ? (
                  <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed #ddd", borderRadius: "8px", background: "#fafafa" }}>
                    <ImageIcon size={32} color="#ccc" style={{ margin: "0 auto 10px" }} />
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#444", marginBottom: "5px" }}>No customizable image slots</p>
                    <p style={{ fontSize: "12px", color: "#888" }}>This template design does not support user portraits.</p>
                  </div>
                ) : (
                  <>
                    {templatePhotoSlots.map((slot) => (
                      <div key={slot.id} style={{ marginBottom: "20px", padding: "20px", border: "1px solid #eee", borderRadius: "8px", display: "flex", gap: "15px", alignItems: "center" }}>
                        <div style={{ width: "60px", height: "60px", borderRadius: "6px", background: "#f0f0f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           {formData[slot.id] ? (
                             <img src={formData[slot.id]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                           ) : (
                             <ImageIcon size={20} color="#ccc" />
                           )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>{slot.label}</p>
                          <input type="file" accept="image/*" id={`imgUpload-${slot.id}`} style={{ display: "none" }} onChange={(e) => handleImageUpload(e, slot.id)} />
                          <label htmlFor={`imgUpload-${slot.id}`} className={styles.btnSecondary} style={{ fontSize: "11px", display: "inline-flex", cursor: "pointer", padding: "6px 12px", background: formData[slot.id] ? "#1a1a1a" : "#fff", color: formData[slot.id] ? "#fff" : "#333" }}>
                            <Upload size={12} style={{ marginRight: "6px" }} /> {formData[slot.id] ? "Portrait Injected!" : "Upload New Photo"}
                          </label>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                <div style={{ marginTop: "30px", marginBottom: "20px", padding: "20px", border: "2px dashed #ddd", borderRadius: "8px", textAlign: "center", background: "#fafafa" }}>
                  <Music size={24} color="#888" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 5px" }}>Background Audio</p>
                  <input type="file" accept="audio/*" id="audioUpload" style={{ display: "none" }} onChange={handleMusicUpload} />
                  <label htmlFor="audioUpload" className={styles.btnSecondary} style={{ fontSize: "11px", display: "inline-flex", cursor: "pointer" }}>
                    <Upload size={14} style={{ marginRight: "6px" }} /> Upload Custom MP3
                  </label>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Live Preview */}
        <div style={{ flex: 1, position: "sticky", top: "20px" }}>
          <div className={styles.cardHeader} style={{ marginBottom: "15px" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}><Eye size={16} /> Live Preview</h3>
          </div>
          <div style={{ 
            width: "375px", 
            height: "750px", 
            background: "#1a1a1a", 
            borderRadius: "36px", 
            padding: "10px",
            margin: "0 auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
          }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "26px", overflow: "hidden", background: "#fff", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "24px", background: "#1a1a1a", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px", zIndex: 10 }}></div>
              <iframe 
                key={template + (formData.customImage1 ? '1':'0') + (formData.customImage2 ? '1':'0')}
                ref={iframeRef}
                srcDoc={modifiedHtml}
                style={{ width: "100%", height: "100%", border: "none", background: "#000" }}
                onLoad={(e) => {
                  try {
                    const doc = (e.target as HTMLIFrameElement).contentDocument;
                    if (!doc) return;
                    
                    // 1. EXTRACT TEXT ONLY ONCE
                    if (dynamicTexts.length === 0) {
                      let idCounter = 1;
                      const texts: {id: number, text: string, group: string}[] = [];
                      const walkText = (node: Node) => {
                        if (node.nodeType === 3) { 
                          const text = node.nodeValue || "";
                          const trimmed = text.trim();
                          if (trimmed.length > 1 && !['Replay', 'Sound on', 'English', 'हिंदी'].includes(trimmed)) {
                            const span = doc.createElement('span');
                            span.setAttribute('data-text-id', idCounter.toString());
                            span.textContent = text;
                            if (node.parentNode) node.parentNode.replaceChild(span, node);
                            
                            let group = "Event Details & Venues";
                            if (idCounter <= 5) group = "Cover & Titles";
                            if (idCounter > 12 || trimmed.length > 60) group = "Sign-offs & Thanks";
                            texts.push({ id: idCounter, text: trimmed, group });
                            idCounter++;
                          }
                        } else if (node.nodeType === 1) { 
                          const el = node as HTMLElement;
                          if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'SVG', 'PATH', 'BUTTON'].includes(el.tagName)) return;
                          Array.from(el.childNodes).forEach(walkText);
                        }
                      };
                      walkText(doc.body);
                      setDynamicTexts(texts);
                    } else {
                       // Ensure text is re-applied if iframe reloads due to srcDoc change
                       dynamicTexts.forEach(t => {
                          const el = doc.querySelector(`[data-text-id="${t.id}"]`);
                          if (el) el.innerHTML = t.text;
                       });
                    }
                  } catch (err) {}
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
