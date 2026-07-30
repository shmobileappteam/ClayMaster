import { storage } from '../api/api';
import { KEYS } from '../constants';

export function getDownloadedDrills() {
  const raw = storage.getString(KEYS.DOWNLOADED_DRILLS);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isDrillDownloaded(drillId) {
  return getDownloadedDrills().some(d => d.id === drillId);
}

export function getDrillStorageSummary() {
  const drills = getDownloadedDrills();
  const totalMb = drills.reduce((sum, d) => sum + (Number(d.sizeMb) || 0), 0);
  return {
    count: drills.length,
    totalMb: Math.round(totalMb * 10) / 10,
  };
}

/** Save drill PDF metadata for offline Field access. */
export function saveDownloadedDrill(drill) {
  const list = getDownloadedDrills();
  if (list.some(d => d.id === drill.id)) {
    return list;
  }
  const entry = {
    id: drill.id,
    title: drill.title,
    desc: drill.desc || '',
    fileUrl: drill.fileUrl || null,
    fileType: drill.fileType || '',
    sizeMb: drill.sizeMb || 0,
    downloadedAt: new Date().toISOString(),
  };
  const next = [entry, ...list];
  storage.set(KEYS.DOWNLOADED_DRILLS, JSON.stringify(next));
  return next;
}

export function removeDownloadedDrill(drillId) {
  const next = getDownloadedDrills().filter(d => d.id !== drillId);
  storage.set(KEYS.DOWNLOADED_DRILLS, JSON.stringify(next));
  return next;
}
