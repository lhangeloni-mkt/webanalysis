// exportGoogleSheets.ts
// Generates a rich, formatted .xlsx file for Google Sheets import
// Uses xlsx-js-style for full cell style support (colors, bold, borders)

import XLSXStyle from 'xlsx-js-style';
import type { Entry, Settings, MistakeItem } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const TAG_PREFIX_REGEX = /^(POST|PRE|MOD|WHATSAPP)::/i;
const getCleanLabel = (label: string) => label.replace(TAG_PREFIX_REGEX, '');
const getMistakeType = (label: string, settings: Settings): string => {
  const match = label.match(TAG_PREFIX_REGEX);
  if (match) return match[1].toLowerCase();
  return settings.mistakes.find(m => m.label === getCleanLabel(label))?.type || 'post';
};
const getMistakeColor = (label: string, settings: Settings): string => {
  const clean = getCleanLabel(label);
  return settings.mistakes.find(m => m.label === clean)?.color || 'red';
};
const getEntryTypeLabel = (entry: Entry, settings: Settings): string => {
  const types = new Set<string>();
  for (const m of entry.mistakes) {
    const match = m.match(TAG_PREFIX_REGEX);
    if (match) { types.add(match[1].toLowerCase()); continue; }
    const found = settings.mistakes.find(sm => sm.label === getCleanLabel(m));
    if (found) types.add(found.type);
  }
  if (types.size === 1) {
    const t = types.values().next().value as string;
    return { post: 'Post Webinar', pre: 'Pre Webinar', mod: 'Moderation', whatsapp: 'Whatsapp' }[t] || t;
  }
  if (types.size > 1) return 'Mixed';
  return 'Post Webinar';
};

// ─── Style Palettes ─────────────────────────────────────────────────────────

const hdrStyle = (bgHex: string = '1e293b', fgHex: string = 'FFFFFF') => ({
  font: { bold: true, color: { rgb: fgHex }, sz: 11 },
  fill: { fgColor: { rgb: bgHex } },
  alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: 'CBD5E1' } },
    bottom: { style: 'thin', color: { rgb: 'CBD5E1' } },
    left: { style: 'thin', color: { rgb: 'CBD5E1' } },
    right: { style: 'thin', color: { rgb: 'CBD5E1' } },
  }
});

const titleStyle = () => ({
  font: { bold: true, sz: 14, color: { rgb: '1e293b' } },
  fill: { fgColor: { rgb: 'FFFFFF' } },
  alignment: { vertical: 'center', horizontal: 'left' },
});

const cellStyle = (bgHex: string, fgHex: string, bold = false, center = false) => ({
  font: { color: { rgb: fgHex }, sz: 10, bold },
  fill: { fgColor: { rgb: bgHex } },
  alignment: { vertical: 'center', horizontal: center ? 'center' : 'left', wrapText: true },
  border: {
    top: { style: 'hair', color: { rgb: 'E2E8F0' } },
    bottom: { style: 'hair', color: { rgb: 'E2E8F0' } },
    left: { style: 'hair', color: { rgb: 'E2E8F0' } },
    right: { style: 'hair', color: { rgb: 'E2E8F0' } },
  }
});

const getMistakeFill = (type: string, color: string): { bg: string; fg: string } => {
  if (type === 'mod')       return { bg: 'EFF6FF', fg: '1D4ED8' };
  if (type === 'whatsapp')  return { bg: 'F0FDF4', fg: '15803D' };
  if (color === 'red')      return { bg: 'FEF2F2', fg: 'B91C1C' };
  return                           { bg: 'FEFCE8', fg: '92400E' };
};

const getEntryTypeFill = (typeLabel: string): { bg: string; fg: string } => {
  if (typeLabel === 'Post Webinar')  return { bg: 'EFF6FF', fg: '1D4ED8' };
  if (typeLabel === 'Pre Webinar')   return { bg: 'F0FDF4', fg: '15803D' };
  if (typeLabel === 'Moderation')    return { bg: 'FFF7ED', fg: 'C2410C' };
  if (typeLabel === 'Whatsapp')      return { bg: 'F7FEE7', fg: '3F6212' };
  return                                    { bg: 'F8FAFC', fg: '334155' };
};

const c = (v: string | number, s: object) => ({ v, s });

function buildSheet(aoa: ({ v: string | number; s?: object } | null)[][], colWidths: number[]) {
  const ws: Record<string, unknown> = {};
  let maxRow = 0;
  let maxCol = 0;
  aoa.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      if (!cell || cell.v === undefined) return;
      const addr = XLSXStyle.utils.encode_cell({ r: ri, c: ci });
      ws[addr] = cell;
      if (ri > maxRow) maxRow = ri;
      if (ci > maxCol) maxCol = ci;
    });
  });
  ws['!ref'] = XLSXStyle.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: maxRow, c: maxCol } });
  ws['!cols'] = colWidths.map(w => ({ wch: w }));
  return ws;
}

// ─── Sheet 1: Summary ───────────────────────────────────────────────────────

function buildSummarySheet(
  allEntries: Entry[],
  filteredEntries: Entry[],
  settings: Settings,
  periodLabel: string,
  compareMode: boolean,
  filteredEntries2: Entry[],
  periodLabel2: string
) {
  void allEntries;
  const rows: ({ v: string | number; s?: object } | null)[][] = [];

  rows.push([c('Webinar Report — ' + periodLabel, titleStyle()), null, null, null]);
  rows.push([c('Generated: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), cellStyle('FFFFFF', '64748B', false)), null, null, null]);
  rows.push([null, null, null, null]);

  const p1Mistakes = filteredEntries.flatMap(e => e.mistakes);
  const p1Specs = new Set(filteredEntries.map(e => e.specialist));
  const p1Creators = new Set(filteredEntries.map(e => e.creator));
  const p1TopSpec = Object.entries(
    filteredEntries.reduce((acc, e) => { acc[e.specialist] = (acc[e.specialist] || 0) + e.mistakes.length; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0];
  const p1TopMist = Object.entries(
    p1Mistakes.reduce((acc, m) => { const l = getCleanLabel(m); acc[l] = (acc[l] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1])[0];

  const hdr = (txt: string, bg = '1E3A5F') => c(txt, hdrStyle(bg));

  rows.push([hdr('Metric'), hdr(compareMode ? periodLabel : 'Value'), compareMode ? hdr(periodLabel2) : null, compareMode ? hdr('Difference') : null]);

  const summaryData: [string, string | number, string | number][] = [
    ['Total Entries', filteredEntries.length, compareMode ? filteredEntries2.length : ''],
    ['Total Mistakes', p1Mistakes.length, compareMode ? filteredEntries2.flatMap(e => e.mistakes).length : ''],
    ['Unique Specialists', p1Specs.size, compareMode ? new Set(filteredEntries2.map(e => e.specialist)).size : ''],
    ['Unique Creators', p1Creators.size, compareMode ? new Set(filteredEntries2.map(e => e.creator)).size : ''],
    ['Top Specialist', p1TopSpec ? p1TopSpec[0] + ' (' + p1TopSpec[1] + ' errors)' : '-', ''],
    ['Most Common Error', p1TopMist ? p1TopMist[0] + ' (' + p1TopMist[1] + 'x)' : '-', ''],
  ];

  summaryData.forEach(([metric, v1, v2], ri) => {
    const rowBg = ri % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    const row: ({ v: string | number; s?: object } | null)[] = [
      c(metric, cellStyle(rowBg, '475569', true)),
      c(v1, cellStyle(rowBg, '1E293B', false, true)),
    ];
    if (compareMode) {
      const diff = typeof v1 === 'number' && typeof v2 === 'number' ? v2 - v1 : '';
      const diffFg = diff === '' ? '64748B' : (diff as number) > 0 ? 'B91C1C' : (diff as number) < 0 ? '15803D' : '64748B';
      row.push(c(v2, cellStyle(rowBg, '1E293B', false, true)));
      row.push(c(diff !== '' ? ((diff as number) > 0 ? '+' + diff : '' + diff) : '', cellStyle(rowBg, diffFg, true, true)));
    } else {
      row.push(null);
      row.push(null);
    }
    rows.push(row);
  });

  rows.push([null, null, null, null]);
  rows.push([c('Entries by Type', hdrStyle('334155')), hdr('Count'), hdr('% of Total'), null]);

  const typeCounts: Record<string, number> = {};
  filteredEntries.forEach(e => {
    const t = getEntryTypeLabel(e, settings);
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    const pct = filteredEntries.length > 0 ? ((count / filteredEntries.length) * 100).toFixed(1) + '%' : '0%';
    const { bg, fg } = getEntryTypeFill(type);
    rows.push([c(type, cellStyle(bg, fg, true)), c(count, cellStyle(bg, fg, false, true)), c(pct, cellStyle(bg, fg, false, true)), null]);
  });

  return buildSheet(rows, [30, 22, 22, 22]);
}

// ─── Sheet 2: Consolidated ───────────────────────────────────────────────────

function buildConsolidatedSheet(
  filteredEntries: Entry[],
  settings: Settings,
  compareMode: boolean,
  filteredEntries2: Entry[],
  periodLabel: string,
  periodLabel2: string
) {
  const rows: ({ v: string | number; s?: object } | null)[][] = [];
  const hdr = (txt: string, bg = '1E3A5F') => c(txt, hdrStyle(bg));

  if (compareMode) {
    rows.push([hdr('Mistake'), hdr('Type'), hdr('Severity'), hdr(periodLabel + ' Count', '1D4ED8'), hdr(periodLabel + ' Specialists', '1D4ED8'), hdr(periodLabel + ' Creators', '1D4ED8'), hdr(periodLabel2 + ' Count', '92400E'), hdr(periodLabel2 + ' Specialists', '92400E'), hdr(periodLabel2 + ' Creators', '92400E'), hdr('Diff')]);
  } else {
    rows.push([hdr('Mistake'), hdr('Type'), hdr('Severity'), hdr('Count'), hdr('Specialists'), hdr('Creators')]);
  }

  const allRaw = [...filteredEntries, ...(compareMode ? filteredEntries2 : [])].flatMap(e => e.mistakes);
  const uniqueClean = [...new Set(allRaw.map(getCleanLabel))].sort();

  uniqueClean.forEach((cleanMistake) => {
    const mDef = settings.mistakes.find((m: MistakeItem) => m.label === cleanMistake);
    const type = mDef?.type || getMistakeType(allRaw.find(m => getCleanLabel(m) === cleanMistake) || '', settings);
    const color = mDef?.color || 'red';
    const { bg, fg } = getMistakeFill(type, color);
    const typeLabel = ({ post: 'Post Webinar', pre: 'Pre Webinar', mod: 'Moderation', whatsapp: 'Whatsapp' } as Record<string, string>)[type] || type;
    const colorLabel = type === 'mod' || type === 'whatsapp' ? '-' : color === 'red' ? 'Red' : 'Yellow';

    const p1Entries = filteredEntries.filter(e => e.mistakes.some(m => getCleanLabel(m) === cleanMistake));
    const p1Specs = Object.entries(p1Entries.reduce((acc, e) => { acc[e.specialist] = (acc[e.specialist] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([s, cnt]) => s + '(' + cnt + ')').join('; ');
    const p1Cres = Object.entries(p1Entries.reduce((acc, e) => { acc[e.creator] = (acc[e.creator] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([s, cnt]) => s + '(' + cnt + ')').join('; ');

    if (compareMode) {
      const p2Entries = filteredEntries2.filter(e => e.mistakes.some(m => getCleanLabel(m) === cleanMistake));
      const p2Specs = Object.entries(p2Entries.reduce((acc, e) => { acc[e.specialist] = (acc[e.specialist] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([s, cnt]) => s + '(' + cnt + ')').join('; ');
      const p2Cres = Object.entries(p2Entries.reduce((acc, e) => { acc[e.creator] = (acc[e.creator] || 0) + 1; return acc; }, {} as Record<string, number>)).sort((a, b) => b[1] - a[1]).map(([s, cnt]) => s + '(' + cnt + ')').join('; ');
      const diff = p2Entries.length - p1Entries.length;
      const diffFg = diff > 0 ? 'B91C1C' : diff < 0 ? '15803D' : '64748B';
      rows.push([c(cleanMistake, cellStyle(bg, fg, true)), c(typeLabel, cellStyle(bg, fg, false)), c(colorLabel, cellStyle(bg, fg, false, true)), c(p1Entries.length, cellStyle(bg, fg, false, true)), c(p1Specs || '-', cellStyle(bg, fg, false)), c(p1Cres || '-', cellStyle(bg, fg, false)), c(p2Entries.length, cellStyle(bg, fg, false, true)), c(p2Specs || '-', cellStyle(bg, fg, false)), c(p2Cres || '-', cellStyle(bg, fg, false)), c(diff > 0 ? '+' + diff : '' + diff, cellStyle(bg, diffFg, true, true))]);
    } else {
      rows.push([c(cleanMistake, cellStyle(bg, fg, true)), c(typeLabel, cellStyle(bg, fg, false)), c(colorLabel, cellStyle(bg, fg, false, true)), c(p1Entries.length, cellStyle(bg, fg, false, true)), c(p1Specs || '-', cellStyle(bg, fg, false)), c(p1Cres || '-', cellStyle(bg, fg, false))]);
    }
  });

  const widths = compareMode ? [40, 15, 12, 10, 40, 35, 10, 40, 35, 10] : [40, 15, 12, 10, 45, 40];
  return buildSheet(rows, widths);
}

// ─── Sheet 3: Specialists ────────────────────────────────────────────────────

function buildSpecialistsSheet(filteredEntries: Entry[], settings: Settings, compareMode: boolean, filteredEntries2: Entry[], periodLabel: string, periodLabel2: string) {
  const rows: ({ v: string | number; s?: object } | null)[][] = [];
  const hdr = (txt: string, bg = '1E3A5F') => c(txt, hdrStyle(bg));

  if (compareMode) {
    rows.push([hdr('Rank'), hdr('Specialist'), hdr(periodLabel + ' Errors', '1D4ED8'), hdr(periodLabel2 + ' Errors', '92400E'), hdr('Diff')]);
  } else {
    rows.push([hdr('Rank'), hdr('Specialist'), hdr('Total Errors'), hdr('Most Common Mistake'), hdr('Types')]);
  }

  const specMap: Record<string, number> = {};
  filteredEntries.forEach(e => { specMap[e.specialist] = (specMap[e.specialist] || 0) + e.mistakes.length; });
  const specMap2: Record<string, number> = {};
  if (compareMode) filteredEntries2.forEach(e => { specMap2[e.specialist] = (specMap2[e.specialist] || 0) + e.mistakes.length; });

  const allSpecs = compareMode ? [...new Set([...Object.keys(specMap), ...Object.keys(specMap2)])] : Object.keys(specMap);
  const sorted = compareMode
    ? allSpecs.sort((a, b) => Math.abs((specMap2[b] || 0) - (specMap[b] || 0)) - Math.abs((specMap2[a] || 0) - (specMap[a] || 0)))
    : allSpecs.sort((a, b) => (specMap[b] || 0) - (specMap[a] || 0));

  sorted.forEach((spec, idx) => {
    const bg = idx % 2 === 0 ? 'F0F9FF' : 'FFFFFF';
    const p1 = specMap[spec] || 0;
    if (compareMode) {
      const p2 = specMap2[spec] || 0;
      const diff = p2 - p1;
      const diffFg = diff > 0 ? 'B91C1C' : diff < 0 ? '15803D' : '64748B';
      rows.push([c(idx + 1, cellStyle(bg, '1E293B', false, true)), c(spec, cellStyle(bg, '1E3A5F', true)), c(p1, cellStyle(bg, '1E293B', false, true)), c(p2, cellStyle(bg, '1E293B', false, true)), c(diff > 0 ? '+' + diff : '' + diff, cellStyle(bg, diffFg, true, true))]);
    } else {
      const mistakeMap: Record<string, number> = {};
      filteredEntries.filter(e => e.specialist === spec).forEach(e => e.mistakes.forEach(m => { const l = getCleanLabel(m); mistakeMap[l] = (mistakeMap[l] || 0) + 1; }));
      const topMistake = Object.entries(mistakeMap).sort((a, b) => b[1] - a[1])[0];
      const typesUsed = [...new Set(filteredEntries.filter(e => e.specialist === spec).map(e => getEntryTypeLabel(e, settings)))].join(', ');
      rows.push([c(idx + 1, cellStyle(bg, '1E293B', false, true)), c(spec, cellStyle(bg, '1E3A5F', true)), c(p1, cellStyle(bg, '1E293B', false, true)), c(topMistake ? topMistake[0] + ' (' + topMistake[1] + 'x)' : '-', cellStyle(bg, '1E293B', false)), c(typesUsed || '-', cellStyle(bg, '475569', false))]);
    }
  });

  return buildSheet(rows, compareMode ? [8, 28, 16, 16, 12] : [8, 28, 14, 45, 28]);
}

// ─── Sheet 4: Creators ──────────────────────────────────────────────────────

function buildCreatorsSheet(filteredEntries: Entry[], settings: Settings) {
  void settings;
  const rows: ({ v: string | number; s?: object } | null)[][] = [];
  const hdr = (txt: string) => c(txt, hdrStyle('1E3A5F'));
  rows.push([hdr('Rank'), hdr('Creator'), hdr('Total Errors'), hdr('Most Common Mistake'), hdr('Specialists Involved')]);

  const creatorMap: Record<string, number> = {};
  filteredEntries.forEach(e => { creatorMap[e.creator] = (creatorMap[e.creator] || 0) + e.mistakes.length; });

  Object.entries(creatorMap).sort((a, b) => b[1] - a[1]).forEach(([creator, total], idx) => {
    const bg = idx % 2 === 0 ? 'FFF7F0' : 'FFFFFF';
    const mistakeMap: Record<string, number> = {};
    filteredEntries.filter(e => e.creator === creator).forEach(e => e.mistakes.forEach(m => { const l = getCleanLabel(m); mistakeMap[l] = (mistakeMap[l] || 0) + 1; }));
    const topMistake = Object.entries(mistakeMap).sort((a, b) => b[1] - a[1])[0];
    const specialists = [...new Set(filteredEntries.filter(e => e.creator === creator).map(e => e.specialist))].join(', ');
    rows.push([c(idx + 1, cellStyle(bg, '1E293B', false, true)), c(creator, cellStyle(bg, '92400E', true)), c(total, cellStyle(bg, '1E293B', false, true)), c(topMistake ? topMistake[0] + ' (' + topMistake[1] + 'x)' : '-', cellStyle(bg, '1E293B', false)), c(specialists || '-', cellStyle(bg, '475569', false))]);
  });

  return buildSheet(rows, [8, 28, 14, 45, 40]);
}

// ─── Sheet 5: Raw Data ───────────────────────────────────────────────────────

function buildRawDataSheet(filteredEntries: Entry[], settings: Settings) {
  const rows: ({ v: string | number; s?: object } | null)[][] = [];
  const hdr = (txt: string) => c(txt, hdrStyle('1E3A5F'));
  rows.push([hdr('Date'), hdr('Planet'), hdr('Specialist'), hdr('Creator'), hdr('Mistake'), hdr('Mistake Type'), hdr('Severity'), hdr('Entry Type')]);

  const sorted = [...filteredEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  sorted.forEach((entry) => {
    const entryType = getEntryTypeLabel(entry, settings);
    const { bg: etBg, fg: etFg } = getEntryTypeFill(entryType);
    if (entry.mistakes.length === 0) {
      rows.push([c(entry.date, cellStyle(etBg, etFg, false)), c(entry.planet, cellStyle(etBg, etFg, false)), c(entry.specialist, cellStyle(etBg, etFg, true)), c(entry.creator, cellStyle(etBg, '475569', false)), c('(no mistakes)', cellStyle(etBg, '94A3B8', false)), c('', cellStyle(etBg, etFg, false, true)), c('', cellStyle(etBg, etFg, false, true)), c(entryType, cellStyle(etBg, etFg, false, true))]);
      return;
    }
    entry.mistakes.forEach((mistake) => {
      const mType = getMistakeType(mistake, settings);
      const mColor = getMistakeColor(mistake, settings);
      const { bg, fg } = getMistakeFill(mType, mColor);
      const mTypeLabel = ({ post: 'Post Webinar', pre: 'Pre Webinar', mod: 'Moderation', whatsapp: 'Whatsapp' } as Record<string, string>)[mType] || mType;
      const severityLabel = mType === 'mod' || mType === 'whatsapp' ? '-' : mColor === 'red' ? 'Red' : 'Yellow';
      rows.push([c(entry.date, cellStyle(bg, '475569', false)), c(entry.planet, cellStyle(bg, '475569', false)), c(entry.specialist, cellStyle(bg, fg, true)), c(entry.creator, cellStyle(bg, '475569', false)), c(getCleanLabel(mistake), cellStyle(bg, fg, false)), c(mTypeLabel, cellStyle(bg, fg, false, true)), c(severityLabel, cellStyle(bg, fg, false, true)), c(entryType, cellStyle(etBg, etFg, false, true))]);
    });
  });

  return buildSheet(rows, [14, 16, 24, 24, 42, 16, 12, 16]);
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export interface ExportGoogleSheetsOptions {
  filteredEntries: Entry[];
  filteredEntries2: Entry[];
  settings: Settings;
  compareMode: boolean;
  periodLabel: string;
  periodLabel2: string;
  allEntries: Entry[];
  filenameSuffix?: string;
}

export function exportToGoogleSheets(opts: ExportGoogleSheetsOptions) {
  const { filteredEntries, filteredEntries2, settings, compareMode, periodLabel, periodLabel2, allEntries, filenameSuffix = 'report' } = opts;
  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, buildSummarySheet(allEntries, filteredEntries, settings, periodLabel, compareMode, filteredEntries2, periodLabel2), 'Summary');
  XLSXStyle.utils.book_append_sheet(wb, buildConsolidatedSheet(filteredEntries, settings, compareMode, filteredEntries2, periodLabel, periodLabel2), 'Consolidated');
  XLSXStyle.utils.book_append_sheet(wb, buildSpecialistsSheet(filteredEntries, settings, compareMode, filteredEntries2, periodLabel, periodLabel2), 'Specialists');
  XLSXStyle.utils.book_append_sheet(wb, buildCreatorsSheet(filteredEntries, settings), 'Creators');
  XLSXStyle.utils.book_append_sheet(wb, buildRawDataSheet(filteredEntries, settings), 'Raw Data');
  XLSXStyle.writeFile(wb, 'webinar_report_' + filenameSuffix + '.xlsx');
}
