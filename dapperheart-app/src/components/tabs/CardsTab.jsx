import { S } from '../../styles/theme';
import { KW } from '../shared/KW';
import { DOMAIN_THEME, CARD_TYPE_STYLE } from '../../data';

function CardDisplay({ card, borderColor, opacity, children }) {
  const dt = DOMAIN_THEME[card.domain] || { icon: "◆", color: "#888" };
  const ct = CARD_TYPE_STYLE[card.type] || CARD_TYPE_STYLE.Ability;
  return (
    <div style={{ ...S.card, borderColor: borderColor || dt.color, borderLeftWidth: 3, opacity: opacity || 1, position: "relative" }}>
      {/* Header: domain icon + level | type badge | recall */}
      <div style={S.cardHead}>
        <span style={{ color: dt.color }}>{dt.icon} Lv{card.lv}</span>
        <span style={{ color: ct.color, background: ct.bg, padding: "1px 5px", borderRadius: 2, fontSize: 10, letterSpacing: ".06em" }}>{ct.badge}</span>
        <span className="kw-tip" tabIndex={0}
          title="Recall Cost — after using this card it goes to your Vault. During a rest, spend this many recall points to return it to your Loadout."
          style={{ cursor: "help", borderBottom: "1px dashed #666" }}>
          {card.rc === 0 ? "Free" : `⟳${card.rc}`}
        </span>
      </div>
      <div style={S.cardName}>{card.name}</div>
      <div style={{ ...S.cardDom, color: dt.color }}>{dt.icon} {card.domain}</div>
      <div style={S.cardDesc}><KW text={card.desc} /></div>
      {children}
    </div>
  );
}

export function CardsTab({ c, cls, myDomains, myCards, acquiredNames, highlight, addToLoadout, moveToVault, moveToLoadout, removeCard }) {
  return (
    <div>
      <div style={S.sec}><h3 style={S.secH}>LOADOUT ({c.loadout.length}/5)</h3>
        {c.loadout.length === 0 && <p style={{ fontSize: 11, color: "#bbb", fontStyle: "italic" }}>No cards yet.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{c.loadout.map(card =>
          <CardDisplay key={card.name} card={card} borderColor="#d4a017">
            <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
              <button style={{ ...S.cardBtn, borderColor: "#888" }} onClick={() => moveToVault(card)}>→ Vault</button>
              <button style={{ ...S.cardBtn, borderColor: "#e05545", color: "#e05545" }} onClick={() => removeCard(card)}>Remove</button>
            </div>
          </CardDisplay>
        )}</div></div>

      {c.vault.length > 0 && <div style={S.sec}><h3 style={S.secH}>VAULT</h3>
        <div className="dh-card-grid" style={S.cardGrid}>{c.vault.map(card =>
          <CardDisplay key={card.name} card={card} opacity={0.7}>
            <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
              <button style={{ ...S.cardBtn, borderColor: "#d4a017", color: "#d4a017" }} onClick={() => moveToLoadout(card)}>→ Loadout</button>
              <button style={{ ...S.cardBtn, borderColor: "#e05545", color: "#e05545" }} onClick={() => removeCard(card)}>Remove</button>
            </div>
          </CardDisplay>
        )}</div></div>}

      <div id="sec-available-cards" style={{ ...S.sec, ...(highlight === "available-cards" ? S.hl : {}) }}>
        <h3 style={S.secH}>AVAILABLE — {myDomains.join(" & ")}</h3>
        {!cls && <p style={{ fontSize: 11, color: "#bbb" }}>Select a class.</p>}
        <div className="dh-card-grid" style={S.cardGrid}>{myCards.filter(cd => !acquiredNames.has(cd.name)).map(card =>
          <CardDisplay key={card.name} card={card}>
            <button style={{ ...S.cardBtn, marginTop: 6, borderColor: "#d4a017", color: "#d4a017", fontWeight: 700 }} onClick={() => addToLoadout(card)}>+ Loadout</button>
          </CardDisplay>
        )}</div>
      </div>
    </div>
  );
}
