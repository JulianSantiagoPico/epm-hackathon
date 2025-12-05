import { memo } from "react";

const ValveButton = memo(function ValveButton({
  valveId,
  valveName,
  location,
  isSelected,
  onSelect,
}) {
  return (
    <button
      onClick={() => onSelect(valveId)}
      className={`
        p-4 rounded-lg border-2 transition-all text-left
        ${
          isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border hover:border-primary/50"
        }
      `}
    >
      <p className="text-sm font-bold text-textMain">{valveId}</p>
      <p className="text-xs text-textSecondary mt-1">{valveName}</p>
      <p className="text-xs text-textSecondary mt-1">📍 {location}</p>
    </button>
  );
});

export default ValveButton;
