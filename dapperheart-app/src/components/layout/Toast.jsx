import { S } from '../../styles/theme';

export function Toast({ message }) {
  if (!message) return null;
  return (
    <div aria-live="polite" aria-atomic="true">
      <div style={S.toast} role="status">{message}</div>
    </div>
  );
}
