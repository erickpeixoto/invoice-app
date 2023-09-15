/* eslint-disable @typescript-eslint/require-await */
import { useEffect, useState } from "react";

import { api } from "~/utils/api";

export function useGeneratedInvoiceNumber() {
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);
  const lastInvoiceQuery = api.invoice.latest.useQuery(); // Call the hook here
  const lastInvoice = lastInvoiceQuery.data;

  useEffect(() => {
    async function fetchAndGenerate() {
      const prefix = `INV-`;

      console.log("lastInvoice", { lastInvoice });

      let newInvoiceNumber;
      if (!lastInvoice) {
        newInvoiceNumber = `${prefix}01`;
      } else {
        const lastInvoiceNumberParts = lastInvoice?.invoiceNumber.split("-");
        if (lastInvoiceNumberParts && lastInvoiceNumberParts.length >= 2) {
          const lastNumber = parseInt(lastInvoiceNumberParts[1]!, 10);
          const newNumber = (lastNumber + 1).toString().padStart(4, "0");
          newInvoiceNumber = `${prefix}${newNumber}`;
        } else {
          console.error(
            "Unexpected invoiceNumber format:",
            lastInvoice?.invoiceNumber,
          );
          newInvoiceNumber = `${prefix}01`; // defaulting to first number if format is unexpected
        }
      }
      setInvoiceNumber(newInvoiceNumber);
    }

    void fetchAndGenerate();
  }, [lastInvoice]); // Add lastInvoice as a dependency

  return invoiceNumber;
}
