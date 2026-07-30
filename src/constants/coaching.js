/** Map API appointment → UI booking card shape */
export const mapAppointment = (item, index = 0) => {
  if (!item || typeof item !== 'object') return null;

  const coach = item.coach || 'Coach';
  const when = item.datetime ? new Date(item.datetime) : null;
  const validDate = when && !Number.isNaN(when.getTime()) ? when : null;
  const now = Date.now();
  const isUpcoming = validDate ? validDate.getTime() >= now : false;

  return {
    id: `${item.datetime || 'appt'}-${item.email || index}-${index}`,
    coach,
    initials: coachInitials(coach),
    name: item.name || '',
    email: item.email || '',
    datetime: item.datetime || null,
    date: validDate
      ? new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(validDate)
      : '—',
    time: validDate
      ? new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }).format(validDate)
      : '—',
    joinUrl: item.join_url || null,
    status: isUpcoming ? 'Confirmed' : 'Completed',
    isUpcoming,
    timestamp: validDate ? validDate.getTime() : 0,
  };
};

export const coachInitials = name => {
  if (!name || typeof name !== 'string') return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const splitAppointments = appointments => {
  const mapped = (appointments || [])
    .map(mapAppointment)
    .filter(Boolean)
    .sort((a, b) => a.timestamp - b.timestamp);

  const upcoming = mapped
    .filter(a => a.isUpcoming)
    .sort((a, b) => a.timestamp - b.timestamp);
  const past = mapped
    .filter(a => !a.isUpcoming)
    .sort((a, b) => b.timestamp - a.timestamp);

  return { upcoming, past };
};

export const formatMoney = amount => {
  const n = Number(amount);
  if (Number.isNaN(n)) return '';
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
};

export const openExternalUrl = async (url, Linking, showMessage) => {
  if (!url) {
    showMessage?.({
      type: 'danger',
      message: 'No link available for this item.',
    });
    return;
  }
  try {
    const can = await Linking.canOpenURL(url);
    if (!can) {
      showMessage?.({ type: 'danger', message: 'Unable to open this link.' });
      return;
    }
    await Linking.openURL(url);
  } catch {
    showMessage?.({ type: 'danger', message: 'Unable to open this link.' });
  }
};
