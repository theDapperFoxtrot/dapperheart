import { S } from '../../styles/theme';
import { KW } from '../shared/KW';

export function CardsTab({ c, cls, myDomains, myCards, acquiredNames, highlight, addToLoadout, moveToVault, moveToLoadout, removeCard }) {
  return (
    <div>
      <div style={S.sec}><h3 style={S.secH}>LOADOUT ({c.loadout.length}/5)</h3>
        {c.loadout.length === 0 && <p style={{ fontSize: 11, color: "#bbb", fontStyle: "italic" }}>No cards yet.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{c.loadout.map(card => <div key={card.name} style={{ ...S.card, borderColor: "#d4a017" }}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc} /></div>
          <div style={{ display: "flex", gap: 3, marginTop: 6 }}><button style={{ ...S.cardBtn, borderColor: "#888" }} onClick={() => moveToVault(card)}>→ Vault</button><button style={{ ...S.cardBtn, borderColor: "#e05545", color: "#e05545" }} onClick={() => removeCard(card)}>Remove</button></div>
        </div>)}</div></div>
      {c.vault.length > 0 && <div style={S.sec}><h3 style={S.secH}>VAULT</h3>
        <div className="dh-card-grid" style={S.cardGrid}>{c.vault.map(card => <div key={card.name} style={{ ...S.card, opacity: .7 }}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc} /></div>
          <div style={{ display: "flex", gap: 3, marginTop: 6 }}><button style={{ ...S.cardBtn, borderColor: "#d4a017", color: "#d4a017" }} onClick={() => moveToLoadout(card)}>→ Loadout</button><button style={{ ...S.cardBtn, borderColor: "#e05545", color: "#e05545" }} onClick={() => removeCard(card)}>Remove</button></div>
        </div>)}</div></div>}
      <div id="sec-available-cards" style={{ ...S.sec, ...(highlight === "available-cards" ? S.hl : {}) }}><h3 style={S.secH}>AVAILABLE — {myDomains.join(" & ")}</h3>
        {!cls && <p style={{ fontSize: 11, color: "#bbb" }}>Select a class.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{myCards.filter(cd => !acquiredNames.has(cd.name)).map(card => <div key={card.name} style={S.card}>
          <div style={S.cardHead}><span>Lv{card.lv}</span><span>{card.type}</span><span>⚡{card.rc}</span></div>
          <div style={S.cardName}>{card.name}</div><div style={S.cardDom}>{card.domain}</div>
          <div style={S.cardDesc}><KW text={card.desc} /></div>
          <button style={{ ...S.cardBtn, marginTop: 6, borderColor: "#d4a017", color: "#d4a017", fontWeight: 700 }} onClick={() => addToLoadout(card)}>+ Loadout</button>
        </div>)}</div></div>
    </div>
  );
}
