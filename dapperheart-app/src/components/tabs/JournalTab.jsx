import { useState, useRef } from 'react';
import { S } from '../../styles/theme';
import { readImageFile } from '../../utils';
import { Markdown } from '../shared/Markdown';

export function JournalTab({ c, u, flash, askConfirm }) {
  const [editingNote, setEditingNote] = useState(null);
  const [journalPreview, setJournalPreview] = useState(false);
  const portraitRef = useRef(null);
  const refImgRef = useRef(null);
  const noteImgRef = useRef(null);

  const addNote = () => { const id = Date.now().toString(36); setEditingNote({ id, title: "", body: "" }); };
  const saveNote = () => {
    if (!editingNote) return; const { id, title, body } = editingNote;
    const journal = [...(c.journal || [])]; const idx = journal.findIndex(n => n.id === id);
    const note = { id, title: title || "Untitled", body, ts: Date.now() };
    if (idx >= 0) journal[idx] = note; else journal.unshift(note);
    u("journal", journal); setEditingNote(null); flash("Note saved");
  };
  const deleteNote = (id) => askConfirm("Delete this note?", () => u("journal", (c.journal || []).filter(n => n.id !== id)));
  const editNote = (note) => setEditingNote({ ...note });

  const uploadPortrait = async (e) => { const f = e.target.files?.[0]; if (!f) return;
    const data = await readImageFile(f, 400); u("portrait", data); flash("Portrait set!"); };
  const uploadRefImage = async (e) => { const f = e.target.files?.[0]; if (!f) return;
    const data = await readImageFile(f, 800); u("refImages", [...(c.refImages || []), { id: Date.now().toString(36), data, label: "" }]); flash("Image added!"); };
  const removeRefImage = (id) => u("refImages", (c.refImages || []).filter(x => x.id !== id));
  const labelRefImage = (id, label) => u("refImages", (c.refImages || []).map(x => x.id === id ? { ...x, label } : x));
  const uploadNoteImage = async (e) => { const f = e.target.files?.[0]; if (!f || !editingNote) return;
    const data = await readImageFile(f, 800); const imgId = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    u("noteImages", { ...(c.noteImages || {}), [imgId]: data });
    setEditingNote(prev => ({ ...prev, body: (prev.body || "") + `\n![image](img:${imgId})\n` }));
    flash("Image added!"); if (noteImgRef.current) noteImgRef.current.value = ""; };

  return (
    <div>
      {/* CHARACTER PORTRAIT */}
      <div style={{ ...S.sec, marginBottom: 10 }}>
        <h3 style={S.secH}>CHARACTER PORTRAIT</h3>
        {c.portrait ? <div style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
          <a href={c.portrait} target="_blank" rel="noopener" title="View full size">
            <img src={c.portrait} alt="Character portrait" style={{ width: 180, height: 180, borderRadius: 6, border: "2px solid #3a3a3e", objectFit: "cover", cursor: "pointer" }} />
          </a>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 120 }}>
            {c.name && <div style={{ fontFamily: "'Cinzel'", fontWeight: 900, fontSize: 18, color: "#e0ddd5" }}>{c.name}</div>}
            {c.className && <div style={{ fontSize: 13, color: "#bbb" }}>{c.className}{c.subclass ? ` — ${c.subclass}` : ""}{c.multiclass ? ` / ${c.multiclass}` : ""}</div>}
            {c.ancestry1 && <div style={{ fontSize: 13, color: "#bbb" }}>{c.ancestry1}{c.ancestry2 && c.ancestry2 !== c.ancestry1 ? ` / ${c.ancestry2}` : ""}{c.community ? ` • ${c.community}` : ""}</div>}
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <button style={{ ...S.topBtn, fontSize: 12 }} onClick={() => portraitRef.current?.click()}>Change</button>
              <button style={{ ...S.topBtn, fontSize: 12, color: "#e05545", borderColor: "#e05545" }} onClick={() => u("portrait", "")}>Remove</button>
            </div>
          </div>
        </div>
        : <div style={{ textAlign: "center", padding: 16 }}>
          <button onClick={() => portraitRef.current?.click()} style={{ border: "2px dashed #3a3a3e", background: "#1a1a1e", padding: "24px 32px", borderRadius: 6, cursor: "pointer", color: "#888", fontSize: 14 }}>
            📷 Upload Portrait
          </button>
          <p style={{ fontSize: 12, color: "#666", marginTop: 6 }}>Add a character portrait, reference art, or photo</p>
        </div>}
        <input ref={portraitRef} type="file" accept="image/*" onChange={uploadPortrait} style={{ display: "none" }} />
      </div>

      {/* NOTE EDITOR */}
      {editingNote ? <div style={S.sec}>
        <h3 style={S.secH}>{editingNote.id && (c.journal || []).find(n => n.id === editingNote.id) ? "EDIT NOTE" : "NEW NOTE"}</h3>
        <input style={{ ...S.fi, fontWeight: 600, fontSize: 16, marginBottom: 8 }} value={editingNote.title} onChange={e => setEditingNote({ ...editingNote, title: e.target.value })} placeholder="Note title..." />
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <button style={{ ...S.topBtn, fontSize: 12, ...(!journalPreview ? { background: "#3a3a3e" } : {}) }} onClick={() => setJournalPreview(false)}>✏️ Edit</button>
          <button style={{ ...S.topBtn, fontSize: 12, ...(journalPreview ? { background: "#3a3a3e" } : {}) }} onClick={() => setJournalPreview(true)}>👁 Preview</button>
          <button style={{ ...S.topBtn, fontSize: 12, marginLeft: "auto" }} onClick={() => noteImgRef.current?.click()}>📷 Image</button>
          <input ref={noteImgRef} type="file" accept="image/*" onChange={uploadNoteImage} style={{ display: "none" }} />
        </div>
        {journalPreview ? <div style={{ ...S.sec, minHeight: 120, background: "#0d0d0f" }}><Markdown text={editingNote.body} images={c.noteImages} /></div>
        : <textarea style={{ ...S.notes, minHeight: 160, fontSize: 14, fontFamily: "monospace", lineHeight: 1.6 }} value={editingNote.body}
          onChange={e => setEditingNote({ ...editingNote, body: e.target.value })}
          onPaste={async (e) => {
            const items = e.clipboardData?.items; if (!items) return;
            for (const item of items) {
              if (item.type.startsWith("image/")) {
                e.preventDefault();
                const file = item.getAsFile(); if (!file) return;
                const data = await readImageFile(file, 800);
                const imgId = Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
                u("noteImages", { ...(c.noteImages || {}), [imgId]: data });
                const ta = e.target; const start = ta.selectionStart; const end = ta.selectionEnd;
                const before = editingNote.body.slice(0, start); const after = editingNote.body.slice(end);
                setEditingNote({ ...editingNote, body: before + `\n![image](img:${imgId})\n` + after });
                flash("Image pasted!");
                break;
              }
            }
          }}
          placeholder={"Write your note here...\n\n# Heading\n**bold** and *italic*\n- list items\n[link text](url)\n`inline code`\n---\n\nPaste images directly from clipboard!"} />}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button style={S.actBtn} onClick={() => setEditingNote(null)}>Cancel</button>
          <button style={{ ...S.actBtn, background: "#d4a017", color: "#0d0d0f", border: "none" }} onClick={saveNote}>Save Note</button>
        </div>
      </div>

      : <>
        {/* NOTE LIST */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ ...S.secH, margin: 0, border: "none", paddingBottom: 0 }}>JOURNAL ({(c.journal || []).length})</h3>
          <button style={{ ...S.actBtn, background: "#d4a017", color: "#0d0d0f", border: "none" }} onClick={addNote}>+ New Note</button>
        </div>

        {(c.journal || []).length === 0 && <div style={{ ...S.sec, textAlign: "center", padding: 24 }}>
          <p style={{ color: "#888", fontSize: 14, margin: "0 0 4px" }}>No journal entries yet.</p>
          <p style={{ color: "#666", fontSize: 13 }}>Track backstory, session notes, NPC names, or anything else.</p>
          <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>Supports **markdown** formatting — headers, bold, italic, lists, and links.</p>
        </div>}

        {(c.journal || []).map(note => <div key={note.id} style={{ ...S.sec, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: "'Cinzel'", fontWeight: 700, fontSize: 14, color: "#e0ddd5" }}>{note.title}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{new Date(note.ts).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button style={{ ...S.topBtn, fontSize: 11, padding: "4px 10px" }} onClick={() => editNote(note)}>Edit</button>
              <button style={{ ...S.topBtn, fontSize: 11, padding: "4px 10px", color: "#e05545", borderColor: "#e05545" }} onClick={() => deleteNote(note.id)}>✕</button>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #2a2a2e", paddingTop: 6 }}><Markdown text={note.body} images={c.noteImages} /></div>
        </div>)}
      </>}

      {/* REFERENCE IMAGES */}
      <div style={{ ...S.sec, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ ...S.secH, margin: 0, border: "none", paddingBottom: 0 }}>REFERENCE IMAGES</h3>
          <button style={{ ...S.actBtn, fontSize: 12 }} onClick={() => refImgRef.current?.click()}>+ Add Image</button>
          <input ref={refImgRef} type="file" accept="image/*" onChange={uploadRefImage} style={{ display: "none" }} />
        </div>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>Maps, NPCs, items — anything you want to reference during play.</p>
        {(c.refImages || []).length === 0 && <p style={{ color: "#666", fontSize: 13, textAlign: "center", padding: 12 }}>No images yet.</p>}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8 }}>
          {(c.refImages || []).map(img => <div key={img.id} style={{ border: "1px solid #3a3a3e", background: "#1a1a1e", borderRadius: 4, overflow: "hidden" }}>
            <a href={img.data} target="_blank" rel="noopener" title="Click to view full size" style={{ display: "block", position: "relative" }}>
              <img src={img.data} alt={img.label || "Reference"} style={{ width: "100%", height: 140, objectFit: "cover", cursor: "pointer", display: "block" }} />
              <span style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(0,0,0,.7)", color: "#e0ddd5", fontSize: 10, padding: "2px 6px", borderRadius: 2 }}>🔍 Full size</span>
            </a>
            <div style={{ padding: 6 }}>
              <input style={{ ...S.fi, fontSize: 12, padding: 2 }} value={img.label} onChange={e => labelRefImage(img.id, e.target.value)} placeholder="Label..." />
              <button style={{ fontSize: 11, color: "#e05545", background: "none", border: "none", padding: "4px 0", width: "100%", textAlign: "right" }} onClick={() => removeRefImage(img.id)}>Remove</button>
            </div>
          </div>)}
        </div>
      </div>
    </div>
  );
}
