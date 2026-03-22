import { S } from '../../styles/theme';

const TABS = [["sheet", "📋", "SHEET"], ["journal", "📝", "JOURNAL"], ["guide", "📖", "GUIDE"], ["cards", "🃏", "CARDS"], ["heritage", "🧬", "HERITAGE"]];

export function BottomNav({ tab, setTab }) {
  return (
    <nav className="dh-bottomnav" style={S.bottomNav} role="tablist" aria-label="Main navigation">
      {TABS.map(([id, icon, lb]) =>
        <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); window.scrollTo(0, 0); }}
          style={{ ...S.navBtn, ...(tab === id ? S.navBtnOn : {}) }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em" }}>{lb}</span>
        </button>)}
    </nav>
  );
}
