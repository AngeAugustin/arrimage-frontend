/**
 * @file    downloadConnectionInfoDocx.ts
 * @module  utils
 * @desc    Génère et télécharge le document Word d'informations de connexion (modèle CNSS).
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  ShadingType,
  WidthType,
} from 'docx';
import templateHtml from '@/assets/templates/Modele_info_connexion_utilisateur.html?raw';

export interface ConnectionInfoDocxData {
  nom: string;
  prenom: string;
  login: string;
  password: string;
}

const GRAY_BG = 'E8E8E8';
const FONT = 'Arial';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function extractLogoBase64(): string {
  const match = templateHtml.match(/data:image\/png;base64,([^"]+)/);
  return match?.[1] ?? '';
}

function text(
  content: string,
  options: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    size?: number;
    color?: string;
  } = {},
): TextRun {
  return new TextRun({
    text: content,
    font: FONT,
    bold: options.bold,
    italics: options.italic,
    underline: options.underline ? {} : undefined,
    size: options.size ?? 20,
    color: options.color,
  });
}

function paragraph(
  runs: TextRun | TextRun[],
  options: {
    alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
    spacingAfter?: number;
    spacingBefore?: number;
  } = {},
): Paragraph {
  return new Paragraph({
    children: Array.isArray(runs) ? runs : [runs],
    alignment: options.alignment,
    spacing: {
      before: options.spacingBefore,
      after: options.spacingAfter ?? 120,
    },
  });
}

function borderlessCell(
  children: Array<Paragraph | Table>,
  options: {
    widthTwips?: number;
    widthPct?: number;
    margins?: { top?: number; bottom?: number; left?: number; right?: number };
  } = {},
): TableCell {
  return new TableCell({
    children,
    width: options.widthTwips
      ? { size: options.widthTwips, type: WidthType.DXA }
      : options.widthPct
        ? { size: options.widthPct, type: WidthType.PERCENTAGE }
        : undefined,
    verticalAlign: VerticalAlign.TOP,
    margins: options.margins,
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
  });
}

function headerLabel(label: string): string {
  return label.replace(/\s+:/, '\u00A0:');
}

function headerUserFieldRow(label: string, value: string, isLast = false): TableRow {
  return new TableRow({
    children: [
      borderlessCell(
        [
          new Paragraph({
            children: [text(headerLabel(label), { bold: true, underline: true, size: 21 })],
            spacing: { after: isLast ? 0 : 150 },
            keepLines: true,
          }),
        ],
        { widthTwips: 1680, margins: { right: 120 } },
      ),
      borderlessCell(
        [paragraph(text(value, { bold: true, size: 21 }), { spacingAfter: isLast ? 0 : 150 })],
      ),
    ],
  });
}

function buildHeaderLeft(logoData: Uint8Array | null): Table {
  const orgLines = [
    'CAISSE NATIONALE',
    'DE SECURITE SOCIALE',
    '----------------------',
    'DIRECTION GENERALE',
    '----------------------',
    'DIRECTION DES SYSTEMES',
    "D'INFORMATION",
  ];

  const orgParagraphs = orgLines.map((line, index) =>
    paragraph(text(line, { bold: true, size: 19 }), {
      alignment: AlignmentType.CENTER,
      spacingAfter: index === orgLines.length - 1 ? 0 : 30,
    }),
  );

  const logoParagraph = new Paragraph({
    children: logoData
      ? [
          new ImageRun({
            data: logoData,
            transformation: { width: 60, height: 60 },
            type: 'png',
          }),
        ]
      : [],
    spacing: { before: 60 },
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [1050, 3200],
    rows: [
      new TableRow({
        children: [
          borderlessCell([logoParagraph], { widthTwips: 1050, margins: { right: 180 } }),
          borderlessCell(orgParagraphs),
        ],
      }),
    ],
  });
}

function buildHeaderRight(data: ConnectionInfoDocxData): TableCell {
  const fieldsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      headerUserFieldRow('NOM :', data.nom),
      headerUserFieldRow('PRENOMS :', data.prenom),
      headerUserFieldRow('STRUCTURE :', 'DG CNSS', true),
    ],
  });

  return new TableCell({
    children: [fieldsTable],
    width: { size: 58, type: WidthType.PERCENTAGE },
    shading: { fill: GRAY_BG, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 210, bottom: 210, left: 270, right: 270 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 10, color: '888888' },
      bottom: { style: BorderStyle.SINGLE, size: 10, color: '888888' },
      left: { style: BorderStyle.SINGLE, size: 10, color: '888888' },
      right: { style: BorderStyle.SINGLE, size: 10, color: '888888' },
    },
  });
}

function buildHeaderTable(data: ConnectionInfoDocxData, logoData: Uint8Array | null): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          borderlessCell([buildHeaderLeft(logoData)], {
            widthPct: 42,
            margins: { right: 150, bottom: 120 },
          }),
          buildHeaderRight(data),
        ],
      }),
    ],
  });
}

function bulletLine(content: string, indent = 0): Paragraph {
  return new Paragraph({
    children: [text(`- ${content}`, { size: 20 })],
    indent: { left: indent },
    spacing: { after: 100 },
  });
}

function checkLine(content: string): Paragraph {
  return new Paragraph({
    children: [text(`✓ ${content}`, { size: 20 })],
    indent: { left: 360 },
    spacing: { after: 80 },
  });
}

function borderedCell(children: Paragraph[], options: { shading?: string; widthPct?: number } = {}) {
  return new TableCell({
    children,
    width: options.widthPct ? { size: options.widthPct, type: WidthType.PERCENTAGE } : undefined,
    shading: options.shading ? { fill: options.shading, type: ShadingType.CLEAR } : undefined,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
    },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
  });
}

function buildDocument(data: ConnectionInfoDocxData): Document {
  const logoBase64 = extractLogoBase64();
  const logoData = logoBase64 ? base64ToUint8Array(logoBase64) : null;

  const headerTable = buildHeaderTable(data, logoData);

  const dataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          borderedCell([
            paragraph(text('APPLICATION', { bold: true, size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
          borderedCell([
            paragraph(text('LOGIN', { bold: true, size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
          borderedCell([
            paragraph(text('MOT DE PASSE INITIAL', { bold: true, size: 20 }), {
              alignment: AlignmentType.CENTER,
              spacingAfter: 40,
            }),
            paragraph(text('(A changer dès la 1ère connexion)', { bold: true, size: 20 }), {
              alignment: AlignmentType.CENTER,
            }),
          ]),
          borderedCell([
            paragraph(text('OBSERVATIONS', { bold: true, size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
        ],
      }),
      new TableRow({
        children: [
          borderedCell([
            paragraph(text('Arrimage IFU', { size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
          borderedCell([
            paragraph(text(data.login, { size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
          borderedCell([
            paragraph(text(data.password, { size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
          borderedCell([
            paragraph(text('\u00A0', { size: 20 }), { alignment: AlignmentType.CENTER }),
          ]),
        ],
      }),
    ],
  });

  const importantBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              paragraph(text('IMPORTANT', { bold: true, italic: true, size: 21 }), {
                alignment: AlignmentType.CENTER,
                spacingAfter: 160,
              }),
              bulletLine("Votre mot de passe est confidentiel et ne doit pas être communiqué à une tierce personne ;", 120),
              bulletLine('Changez périodiquement votre mot de passe ;', 120),
              bulletLine("Verrouillez votre ordinateur lorsque vous n'êtes pas à votre poste de travail.", 120),
            ],
            shading: { fill: GRAY_BG, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 12, color: '555555' },
              bottom: { style: BorderStyle.SINGLE, size: 12, color: '555555' },
              left: { style: BorderStyle.SINGLE, size: 12, color: '555555' },
              right: { style: BorderStyle.SINGLE, size: 12, color: '555555' },
            },
            margins: { top: 240, bottom: 240, left: 320, right: 320 },
          }),
        ],
      }),
    ],
  });

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
          },
        },
        children: [
          headerTable,
          paragraph(text('VOS INFORMATIONS DE CONNEXION', { bold: true, size: 28 }), {
            alignment: AlignmentType.CENTER,
            spacingBefore: 320,
            spacingAfter: 280,
          }),
          dataTable,
          paragraph(text('NB :', { bold: true, size: 21 }), { spacingBefore: 320, spacingAfter: 120 }),
          bulletLine("Le mot de passe ne peut pas contenir le nom de compte de l'utilisateur ou des parties du nom complet de l'utilisateur ;"),
          bulletLine('Longueur minimum du mot de passe : douze (12) caractères ;'),
          bulletLine('Contenir des caractères provenant de trois des quatre catégories suivantes :'),
          checkLine('Caractères majuscules non accentués (A à Z)'),
          checkLine('Caractères minuscules non accentués (a à z)'),
          checkLine('Chiffres (0 à 9)'),
          checkLine('Caractères non alphabétiques (par exemple : !, $, #, %)'),
          new Paragraph({ spacing: { after: 280 } }),
          importantBox,
          new Paragraph({ spacing: { before: 2200 } }),
          paragraph(text("La Direction des Systèmes d'Information", { size: 21 }), {
            alignment: AlignmentType.RIGHT,
          }),
        ],
      },
    ],
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadConnectionInfoDocx(data: ConnectionInfoDocxData): Promise<void> {
  const doc = buildDocument(data);
  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, `Informations_connexion_${data.login}.docx`);
}
