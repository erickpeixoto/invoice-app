"use client";

import React from "react";

import InvoiceTable from "~/components/ClientDataTable";
import { api } from "~/utils/api";

const InvoicePage = () => {
  const { data } = api.invoice.all.useQuery();

  return (
    <div>
      <h1>Invoices</h1>
      <InvoiceTable data={data as never} />
    </div>
  );
};
export default InvoicePage;
