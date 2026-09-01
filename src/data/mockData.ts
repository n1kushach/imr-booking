export const TIMES = Array.from({ length: 24 }, (_, i) => {
  const h = String(i).padStart(2, "0");

  return [`${h}:00`, `${h}:30`];
}).flat();

export const EMPLOYEES = [
  "Sarah Chen",
  "Marcus Webb",
  "Priya Nair",
  "Tom Okafor",
  "Lena Bauer",
  "James Ruiz",
  "Diana Park",
  "Alex Kowalski",
  "Yusuf Al-Amin",
  "Chloe Reyes",
];

export const CURRENT_USER = "Sarah Chen";
