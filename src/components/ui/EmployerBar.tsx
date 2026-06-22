/**
 * @file    EmployerBar.tsx
 * @module  components/ui
 * @desc    Barre rappel employeur (Figma workflow card).
 */

interface EmployerBarProps {
  raisonSociale: string;
  numCnss: string;
}

export function EmployerBar({ raisonSociale, numCnss }: EmployerBarProps) {
  return (
    <div className="flex flex-wrap border-b border-cnss-border bg-cnss-role-bg">
      <div className="flex-1 px-6 py-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-blue opacity-70">
          Raison sociale
        </p>
        <p className="mt-1 text-sm font-bold text-cnss-blue">{raisonSociale}</p>
      </div>
      <div className="border-l border-cnss-border px-6 py-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-cnss-blue opacity-70">
          N° CNSS
        </p>
        <p className="mt-1 font-mono text-sm font-bold text-cnss-blue">{numCnss}</p>
      </div>
    </div>
  );
}
