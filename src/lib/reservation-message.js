export function buildReservationMessage({
  restaurantName,
  name,
  phone,
  email,
  date,
  time,
  guestCount,
  notes,
} = {}) {
  const clean = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
  const restaurant = clean(restaurantName, 100) || 'the restaurant';
  const customerName = clean(name, 80);
  const contactNumber = clean(phone, 25);
  const contactEmail = clean(email, 254);
  const reservationDate = clean(date, 10);
  const reservationTime = clean(time, 5);
  const guests = clean(guestCount, 2);
  const additionalNotes = clean(notes, 1000);

  return [
    'Hello ' + restaurant + ', I would like to request a table reservation.',
    '',
    'Name: ' + customerName,
    'Phone: ' + contactNumber,
    contactEmail ? 'Email: ' + contactEmail : '',
    'Date: ' + reservationDate,
    'Preferred time: ' + reservationTime,
    'Guests: ' + guests,
    additionalNotes ? 'Notes: ' + additionalNotes : '',
    '',
    'Please confirm availability. This is a request, not a confirmed booking.',
  ].filter(Boolean).join('\n');
}
