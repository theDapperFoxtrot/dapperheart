import { useState, useEffect } from 'react';

export function useModals() {
  const [lvlUp, setLvlUp] = useState(null);
  const [diceModal, setDiceModal] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [abilityModal, setAbilityModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const [dmgModal, setDmgModal] = useState(null);
  const [dmgResult, setDmgResult] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modPopup, setModPopup] = useState(null);

  // Escape key closes modals (priority order)
  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape") {
        if (modPopup) setModPopup(null);
        else if (menuOpen) setMenuOpen(false);
        else if (dmgModal) { setDmgModal(null); setDmgResult(null); }
        else if (abilityModal) setAbilityModal(null);
        else if (confirmModal) setConfirmModal(null);
        else if (diceModal) { setDiceModal(null); setDiceResult(null); }
        else if (lvlUp) setLvlUp(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [abilityModal, confirmModal, diceModal, dmgModal, lvlUp, menuOpen, modPopup]);

  // Close popups on outside click
  useEffect(() => {
    if (!menuOpen && !modPopup) return;
    const h = e => {
      if (menuOpen && !e.target.closest('.dh-overflow-wrap')) setMenuOpen(false);
      if (modPopup && !e.target.closest('.dh-mod-popup') && !e.target.closest('.dh-mod-badge')) setModPopup(null);
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [menuOpen, modPopup]);

  const askConfirm = (msg, onYes) => setConfirmModal({ msg, onYes });

  return {
    lvlUp, setLvlUp,
    diceModal, setDiceModal, diceResult, setDiceResult, diceRolling, setDiceRolling,
    abilityModal, setAbilityModal,
    confirmModal, setConfirmModal,
    dmgModal, setDmgModal, dmgResult, setDmgResult,
    menuOpen, setMenuOpen,
    modPopup, setModPopup,
    askConfirm,
  };
}
