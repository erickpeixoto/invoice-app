const statuses = ["paid", "unpaid", "pending"];
const currencies = [
  "USD",
  "EUR",
  "CAD",
  "GBP",
  "JPY",
  "AUD",
  "NZD",
  "CHF",
  "CNY",
  "SEK",
];

const getRandomItem = (array: string | unknown[]) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomAmount = () =>
  parseFloat((Math.random() * 1000 + 50).toFixed(2));

export const generateMockData = (numItems: number) => {
  const data = [];

  for (let i = 1; i <= numItems; i++) {
    data.push({
      id: Math.random().toString(36).substr(2, 9),
      invoiceNumber: "INV" + (12345 + i).toString(),
      clientId: Math.floor(Math.random() * 50 + 1),
      userId: Math.floor(Math.random() * 50 + 1),
      totalAmount: getRandomAmount(),
      status: getRandomItem(statuses),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 * i)
        .toISOString()
        .slice(0, 10),
      issuedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 * i)
        .toISOString()
        .slice(0, 10),
      currency: getRandomItem(currencies),
    });
  }

  return { data };
};
