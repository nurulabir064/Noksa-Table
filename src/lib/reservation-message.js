export function buildReservationMessage({
  restaurantName = 'NOKSHA TABLE',
  name,
  email,
  phone,
  date,
  time,
  guestCount,
  notes,
} = {}) {
  const clean = (value, limit) => typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, limit)
    : '';

  const lines = [
    'Hello ' + clean(restaurantName, 100) + ', I would like to request a table reservation.',
    '',
    'Name: ' + clean(name, 80),
    'Email: ' + clean(email, 254),
    'Phone: ' + clean(phone, 25),
    'Preferred date: ' + clean(date, 10),
    'Preferred time: ' + clean(time, 5),
    'Guests: ' + clean(guestCount, 2),
    clean(notes, 1000) ? 'Additional notes: ' + clean(notes, 1000) : '',
    '',
    'Please confirm table availability and any applicable reservation conditions. This is a request, not a confirmed booking.',
  ];

  return lines.filter(Boolean).join('\n');
}
