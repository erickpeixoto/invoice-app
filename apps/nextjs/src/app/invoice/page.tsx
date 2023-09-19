"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useAtom } from "jotai";

import { invoicesCountAtom, notificationCountAtom } from "~/atoms";
import InvoiceDataTable from "~/components/InvDataTable";
import { ConfirmDialog } from "~/components/ui/confim";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import type { RouterInputs } from "~/utils/api";
import { mapInvoiceSourceToTarget } from "~/utils/mappers";

export const runtime = "edge";
type IvoiceTypes = RouterInputs["invoice"]["create"];

const CreateInvoiceForm = () => {
  const { userId } = useAuth();
  const { toast } = useToast();
  const context = api.useContext();
  const { data } = api.invoice.dashboard.useQuery({
    authId: userId ?? "",
  });

  const transformedData = mapInvoiceSourceToTarget(data?.invoices ?? []);
  const [confirmModal, setConfirmModal] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState<number | null>(null);
  const [, setNotificationCount] = useAtom(notificationCountAtom);
  const [, setInvoicesCount] = useAtom(invoicesCountAtom);

  const onDelete = (data: IvoiceTypes) => {
    setConfirmModal(true);
    setIdToBeDeleted(data?.id ?? 0);
  };

  // Delete mode
  const { mutateAsync: deleteInvoice } = api.invoice.delete.useMutation<number>(
    {
      async onSuccess() {
        toast({
          title: "Invoice deleted!",
          description: "We've deleted your Invoice for you.",
          duration: 5000,
        });
        await context.invoice.dashboard.invalidate();
      },
      onError(error) {
        console.error("Error deleting invoice:", error);
      },
    },
  );

  // State management
  setNotificationCount(data?.statusCounts.overdue ?? 0);
  setInvoicesCount(data?.invoices.length ?? 0);

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 flex flex-col items-start justify-between rounded-md bg-gray-100 p-6 shadow-md md:flex-row md:items-center">
        <h2 className="mb-4 text-2xl font-semibold md:mb-0">Dashboard</h2>

        <div className="grid w-full grid-cols-1 gap-4 md:w-3/4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md bg-white p-4 shadow-sm">
            <h3 className="text-gray-600">Total Invoices</h3>
            <p className="text-3xl font-bold">{data?.invoices.length ?? 0}</p>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm">
            <h3 className="text-gray-600">Overdue Invoices</h3>
            <p className="text-3xl font-bold text-red-500">
              {data?.statusCounts.overdue ?? 0}
            </p>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm">
            <h3 className="text-gray-600">Paid Invoices</h3>
            <p className="text-3xl font-bold text-green-500">
              {data?.statusCounts.paid ?? 0}
            </p>
          </div>
          <div className="rounded-md bg-white p-4 shadow-sm">
            <h3 className="text-gray-600">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {data?.statusCounts.pending ?? 0}
            </p>
          </div>
        </div>

        {/* Add Invoice Button */}
        <div className="mt-6 md:mt-0">
          <Link
            href={"/invoice/add"}
            className="w-full rounded-md bg-violet-400 p-5 text-white hover:bg-violet-700"
          >
            Invoice Add
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <div>
        <InvoiceDataTable data={transformedData} onDelete={onDelete} />
      </div>

      {/* Confirm Dialog */}
      {confirmModal && (
        <ConfirmDialog
          isOpen={confirmModal}
          triggerLabel=""
          title="Are you sure?"
          description="When you delete this invoice, it will be gone forever."
          onConfirm={() => {
            void deleteInvoice(idToBeDeleted ?? 0);
            setConfirmModal(false);
          }}
          onCancel={() => setConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default CreateInvoiceForm;
