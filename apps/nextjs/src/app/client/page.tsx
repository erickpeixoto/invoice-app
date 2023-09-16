"use client";

import React from "react";

import type { InvoiceProps } from "~/components/InvoiceDataTable";
import InvoiceTable from "~/components/InvoiceDataTable";
import { api } from "~/utils/api";

const InvoicePage = () => {
  const { data } = api.invoice.all.useQuery();

  return (
    <div>
      <h1>Invoices</h1>
      <InvoiceTable data={data as InvoiceProps[]} />
    </div>
  );
};
export default InvoicePage;
