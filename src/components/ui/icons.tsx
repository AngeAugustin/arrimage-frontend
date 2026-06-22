/**
 * @file    icons.tsx
 * @module  components/ui
 * @desc    Icônes SVG inline (navigation Figma).
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function IconDashboard(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M3 3h6v8H3V3zm8 0h6v5h-6V3zM3 13h6v4H3v-4zm8 3h6v-6h-6v6z" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
    </svg>
  );
}

export function IconList(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M4 5h12v2H4V5zm0 4h12v2H4V9zm0 4h12v2H4v-2z" />
    </svg>
  );
}

export function IconUser(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 1112 0H4z" />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M5.625 2.5A2.125 2.125 0 003.5 4.625v10.75a2.125 2.125 0 002.125 2.125h5.625a2.125 2.125 0 002.125-2.125V12.5a.625.625 0 011.25 0v2.875a3.375 3.375 0 01-3.375 3.375H5.625a3.375 3.375 0 01-3.375-3.375V4.625a3.375 3.375 0 013.375-3.375h5.625a3.375 3.375 0 013.375 3.375V7.5a.625.625 0 01-1.25 0V4.625A2.125 2.125 0 0011.25 2.5H5.625zm6.69 4.77a.625.625 0 010 .88l-1.433 1.433H16.25a.625.625 0 010 1.25h-5.368l1.433 1.433a.625.625 0 11-.88.88l-2.5-2.5a.625.625 0 010-.88l2.5-2.5a.625.625 0 01.88 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={20} {...props}>
      <path d="M10 2a5 5 0 00-3.9 8.1V13H5a1 1 0 100 2h10a1 1 0 100-2h-1.1v-2.9A5 5 0 0010 2zm0 16a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M8.5 3a5.5 5.5 0 014.1 9.1l3.4 3.4a1 1 0 01-1.4 1.4l-3.4-3.4A5.5 5.5 0 118.5 3zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
    </svg>
  );
}

export function IconUserCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={14} height={14} {...props}>
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-5 9a5 5 0 0110 0H5z" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      <path
        fillRule="evenodd"
        d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
        clipRule="evenodd"
      />
      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg viewBox="0 0 14 14" fill="currentColor" width={14} height={14} {...props}>
      <path d="M7 2l5 5-5 5V9H2V7h5V2z" />
    </svg>
  );
}

export function IconLogin(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
    </svg>
  );
}

export function IconAlert(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 2L1 18h18L10 2zm0 5a1 1 0 011 1v5a1 1 0 11-2 0V8a1 1 0 011-1zm0 9a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 16z" />
    </svg>
  );
}

export function IconConsolidation(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 1.5l8 4.5-8 4.5-8-4.5L10 1.5zm7.2 7.3l-7.2 4-7.2-4V14l7.2 4 7.2-4V8.8z" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 19.125a7.125 7.125 0 0114.25 0 .75.75 0 01-.352.692 12.64 12.64 0 01-6.548 1.796 12.64 12.64 0 01-6.548-1.796.75.75 0 01-.352-.692zM18 19.125v-.375a4.875 4.875 0 00-3.6-4.713 9.075 9.075 0 012.4 4.713v.375a.75.75 0 01-1.5 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconAudit(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M6 2h8l2 2v14H4V2h2zm1 4v2h6V6H7zm0 4v2h6v-2H7zm0 4v2h4v-2H7z" />
    </svg>
  );
}

export function IconDiscordance(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 4v4.6l3.5 2.1-.9 1.5L9 11V6h2z" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg viewBox="0 0 8 12" fill="currentColor" width={8} height={12} {...props}>
      <path d="M1 0l7 6-7 6V0z" />
    </svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16} {...props}>
      <path d="M2 4h16v2H2V4zm3 5h10v2H5V9zm3 5h4v2H8v-2z" />
    </svg>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 4.5V2L6.5 5.5 10 9V6.5A3.5 3.5 0 1110 13h1.5A5 5 0 105 6.5H10V4.5z" />
      <path d="M10 15.5V18l3.5-3.5L10 11v2.5A3.5 3.5 0 1010 7H8.5A5 5 0 1015 13.5H10v2z" />
    </svg>
  );
}

/** Réinitialiser le mot de passe — clé pleine, sans vide central. */
export function IconReset(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M11.5 3.5a3.5 3.5 0 00-2.46 6.01L4.5 14v1.5h1.75l.9-.9.9.9h1.1l4.84-4.84A3.5 3.5 0 0011.5 3.5z" />
    </svg>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...props}>
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21c5.52 0 10-4.48 10-10S18.52 3 13 3zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8H12z" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M5 9V7a5 5 0 0110 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8a1 1 0 011-1h1zm2 0h6V7a3 3 0 00-6 0v2z" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 3.5a1 1 0 00-2 0v4.3l3.2 1.9.5.3.9-1.5-.9-.5V5.5z" />
    </svg>
  );
}

export function IconPencil(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M13.6 2.3a1.5 1.5 0 012.1 2.1l-9.4 9.4-3.1 1 1-3.1 9.4-9.4zM3 16.5h14v2H3v-2z" />
    </svg>
  );
}

export function IconStack(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 1.5l8 4.5-8 4.5-8-4.5L10 1.5zm7.2 7.3l-7.2 4-7.2-4V14l7.2 4 7.2-4V8.8z" />
    </svg>
  );
}

export function IconInfo(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v1a1 1 0 102 0V6zm0 4a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconToday(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M6 2a1 1 0 011 1v1h6V3a1 1 0 112 0v1h1a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 112 0v1zm10 7H4v8h12V9z" />
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.7a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconExclamationCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm1 8a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 2a1 1 0 011 1v7.6l2.3-2.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L9 10.6V3a1 1 0 011-1zm-6 13a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 112 0v-1a1 1 0 011-1z" />
    </svg>
  );
}

export function IconUserPlus(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-6 9a5 5 0 0110 0H4zm11-4v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2v-2a1 1 0 112 0z" />
    </svg>
  );
}

export function IconKey(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M11 2a5 5 0 00-3.2 8.8L3 15.6V18h2.4l1.2-1.2 1.2 1.2H9l4.8-4.8A5 5 0 0011 2z" />
    </svg>
  );
}

export function IconBan(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18} {...props}>
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm5.3 11.3a6 6 0 01-8.5-8.5l8.5 8.5z" />
    </svg>
  );
}

export function IconTrendUp(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M4 14l4-4 3 3 5-7 1.4 1-6.4 9-3.3-3.3L4 16V14z" />
    </svg>
  );
}

export function IconShieldExclamation(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 00-.75.75v3.75a.75.75 0 001.5 0V9a.75.75 0 00-.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconShieldCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={20} height={20} {...props}>
      <path
        fillRule="evenodd"
        d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516 11.209 11.209 0 01-7.877-3.08zM12 15.75a.75.75 0 01-.53-.22l-3-3a.75.75 0 011.06-1.06l2.47 2.47 4.47-4.47a.75.75 0 111.06 1.06l-5 5a.75.75 0 01-.53.22z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75Z" />
    </svg>
  );
}

export function IconSync(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={20} height={20} {...props}>
      <path d="M10 2a8 8 0 00-6.6 12.5l1.4-1.4A6 6 0 1110 16V4l4 4-4 4V8a2 2 0 100 4 2 2 0 002-2h2a4 4 0 10-4 8 8 8 0 010-16z" />
    </svg>
  );
}

export function IconXCircle(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={18} height={18} {...props}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7.3 7.3a1 1 0 011.4 0L10 8.6l1.3-1.3a1 1 0 111.4 1.4L11.4 10l1.3 1.3a1 1 0 01-1.4 1.4L10 11.4l-1.3 1.3a1 1 0 01-1.4-1.4L8.6 10 7.3 8.7a1 1 0 010-1.4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconUserCheck(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-6 9a5 5 0 0110 0H4z" />
      <path
        fillRule="evenodd"
        d="M16.78 7.22a1 1 0 010 1.42l-3.5 3.5a1 1 0 01-1.42 0l-1.5-1.5a1 1 0 111.42-1.42l.79.79 2.29-2.29a1 1 0 011.42 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconUserSlash(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-6 9a5 5 0 0110 0H4z" />
      <path d="M4.2 4.2a1 1 0 011.4 0l10 10a1 1 0 01-1.4 1.4l-10-10a1 1 0 010-1.4z" />
    </svg>
  );
}

export function IconFileExport(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16} {...props}>
      <path d="M6 2a2 2 0 00-2 2v10h2V4h8V2H6zm4 4a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V8a2 2 0 00-2-2h-6zm0 2h6v10h-6V8z" />
    </svg>
  );
}

export function IconAt(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={16} height={16} {...props}>
      <path d="M10 3a5 5 0 00-3.2 8.9V14a1 1 0 102 0v-2.1A3 3 0 1110 7a3 3 0 013 2.8V11a2 2 0 11-4 0V9h1a4 4 0 104 4v1a4 4 0 11-8 0V9H7a6 6 0 1112 0 6 6 0 00-6-6z" />
    </svg>
  );
}
