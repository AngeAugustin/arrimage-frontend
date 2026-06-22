/**
 * @file    PlaceholderPage.tsx
 * @module  components
 * @desc    Page placeholder pour les modules en cours de développement.
 * @author  CNSS–DSI
 * @since   2026-06
 */

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * Affiche un message temporaire pour les routes non encore implémentées.
 */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-500">{description}</p>
      <p className="mt-4 text-sm text-cnss-green">Module prévu en Phase 2 — en cours de développement</p>
    </div>
  );
}
