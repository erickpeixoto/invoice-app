/* eslint-disable @typescript-eslint/await-thenable */
import { api } from "./api";

export async function generateInvoiceNumber(): Promise<string> {
  const prefix = new Date().getFullYear();
  const lastInvoice = await api.invoice.latest.useSuspenseQuery()[0];

  if (!lastInvoice) {
    return `${prefix}-0001`;
  }

  const lastInvoiceNumberParts = lastInvoice?.invoiceNumber.split("-");
  if (lastInvoiceNumberParts && lastInvoiceNumberParts.length >= 2) {
    const lastNumber = parseInt(lastInvoiceNumberParts[1]!, 10);
    const newNumber = (lastNumber + 1).toString().padStart(4, "0");
    return `${prefix}-${newNumber}`;
  } else {
    console.error(
      "Unexpected invoiceNumber format:",
      lastInvoice?.invoiceNumber,
    );
    return `${prefix}-0001`;
  }
}
