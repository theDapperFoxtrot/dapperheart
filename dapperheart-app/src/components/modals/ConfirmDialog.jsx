import { S } from '../../styles/theme';

export function ConfirmDialog({ modal, setModal }) {
  if (!modal) return null;
  return (
    <div style={S.overlay}><div style={{ ...S.modal, maxWidth: 360, textAlign: "center" }} role="alertdialog" aria-modal="true" aria-label="Confirm action">
      <p style={{ fontSize: 12, lineHeight: 1.5, margin: "0 0 16px" }}>{modal.msg}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button style={S.actBtn} onClick={() => setModal(null)}>Cancel</button>
        <button style={{ ...S.actBtn, background: "#d4a017", color: "#0d0d0f", border: "none" }} onClick={() => { modal.onYes(); setModal(null); }}>Confirm</button>
      </div>
    </div></div>
  );
}
