const MAX_MESSAGE_LENGTH = 1000;

export function getDhakaToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function getDhakaTime(now = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(now);
}

export function validateReservation(input, today = getDhakaToday(), currentTime = getDhakaTime()) {
  const errors = {};
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {};

  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : '';
  const phone = typeof value.phone === 'string' ? value.phone.trim() : '';
  const date = typeof value.date === 'string' ? value.date : '';
  const time = typeof value.time === 'string' ? value.time : '';
  const guestCount = Number(value.guestCount);
  const message = typeof value.message === 'string' ? value.message.trim() : '';
  const website = typeof value.website === 'string' ? value.website.trim() : '';

  if (name.length < 2 || name.length > 80 || /[\u0000-\u001F\u007F]/.test(name)) {
    errors.name = 'Enter a name between 2 and 80 characters.';
  }

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phone.length > 25 || !/^\+?[0-9\s().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = 'Enter a valid phone number with 7 to 15 digits.';
  }

  if (!isValidDate(date) || date < today) {
    errors.date = 'Choose a valid date today or later.';
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    errors.time = 'Choose a valid time.';
  }

  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 6) {
    errors.guestCount = 'Guest count must be between 1 and 6.';
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = 'Notes must be 1,000 characters or fewer.';
  }

  if (website.length > 0) {
    errors.website = 'Invalid submission.';
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, email, phone, date, time, guestCount, message },
  };
}
