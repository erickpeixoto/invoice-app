"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Check,
  ChevronsUpDown,
  PlusIcon,
  UploadCloud,
  UserPlus,
} from "lucide-react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import type { Control, FieldValues, UseFormRegister } from "react-hook-form";
import type { UploadFileResponse } from "uploadthing/client";

import { GenericCalendar } from "~/components/GenericCalendar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { useGeneratedInvoiceNumber } from "~/hooks/useGeneratedInvoiceNumber";
import { cn } from "~/lib/utils";
import type { RouterInputs } from "~/utils/api";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";

type InvoiceFormData = RouterInputs["invoice"]["create"];
interface InvoiceItemsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
}
const CreateInvoiceForm = () => {
  const methods = useForm<InvoiceFormData>();
  const { register, handleSubmit, control } = methods;

  const upcomingInvoice = useGeneratedInvoiceNumber();
  const { toast } = useToast();
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [logotype, setLogotype] = useState(
    {} as UploadFileResponse[] | undefined,
  );

  const { watch } = methods;
  const items = watch("lineItems");

  const { mutateAsync: createInvoice } = api.invoice.create.useMutation({
    onSuccess() {
      toast({
        title: "Invoice created!",
        description: "We've created your invoice for you.",
        duration: 5000,
      });
      router.push("/invoices");
    },
    onError(error) {
      console.error("Error creating invoice:", error);
    },
  });

  useEffect(() => {
    const newSubtotal = items?.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );
    const taxRate = 0;
    const newTax = newSubtotal * taxRate;
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [items, upcomingInvoice]); //here

  const onSubmit = async (data: InvoiceFormData) => {
    const invoiceDataMock = {
      invoiceNumber: upcomingInvoice!,
      totalAmount: total,
      logo: logotype?.[0]?.url ?? "",
      subtotal,
      tax,
    };

    await createInvoice({ ...data, ...invoiceDataMock });
  };

  const recalculateTotals = () => {
    const newSubtotal = items?.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );
    const taxRate = 0;
    const newTax = newSubtotal * taxRate;
    const newTotal = newSubtotal + newTax;

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  };

  const users = [
    { label: "John Doe", value: 1 },
    { label: "Alice", value: 2 },
    { label: "Bob", value: 3 },
    { label: "Charlie", value: 4 },
    { label: "Daisy", value: 5 },
    { label: "Eve", value: 6 },
  ] as const;

  // Sample client data
  const clients = [
    { label: "Client A", value: 1 },
    { label: "Client B", value: 2 },
    { label: "Client C", value: 3 },
    { label: "Client D", value: 4 },
    { label: "Client E", value: 5 },
    { label: "Client F", value: 6 },
  ] as const;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-screen grid-flow-col grid-rows-3 md:grid">
          {/* Logo Block */}
          <div className="row-span-3 flex w-[350px] flex-col gap-3 border-r-2 border-r-slate-200 p-10">
            <div className="mb-20 flex h-[200px] justify-center rounded-2xl bg-white p-4 shadow-xl">
              {logotype?.[0]?.url && (
                <Avatar className="mr-2 h-[150px] w-[150px]">
                  <AvatarImage
                    src={logotype?.[0]?.url}
                    alt="Logotipo"
                    className="rounded-2xl"
                  />
                  <AvatarFallback>
                    <Loading />
                  </AvatarFallback>
                </Avatar>
              )}

              {!logotype?.[0]?.url && (
                <UploadButton
                  content={{
                    button({ isUploading, ready }) {
                      return (
                        <div className="flex flex-col items-center justify-center">
                          {!isUploading && ready && (
                            <UploadCloud className="text-6xl text-violet-600" />
                          )}
                          <div className="text-sm">Logotipo</div>
                        </div>
                      );
                    },
                    allowedContent({ ready, isUploading }) {
                      if (!ready) return <Loading />;
                      if (isUploading) return <Loading />;

                      return (
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-sm">Logotipo</div>
                        </div>
                      );
                    },
                  }}
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    setLogotype(res);
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    console.error(`ERROR! ${error.message}`);
                  }}
                />
              )}
            </div>

            <div className="flex flex-col">
              <Label className="mb-2">Status</Label>

              <select
                {...register("status")}
                defaultValue="Draft"
                className="p-2"
              >
                <option value="">Select...</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <GenericCalendar
              name="issuedDate"
              placeholder="..."
              label="Issue date"
            />
            <GenericCalendar
              name="dueDate"
              placeholder="..."
              label="Due date"
            />

            <div className="flex flex-col">
              <Label className="mb-2">Currency</Label>
              <select
                {...register("currency")}
                defaultValue="USD"
                className="p-2"
              >
                <option value="">Select...</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GPB">GBP</option>
                <option value="BRL">BRL</option>
              </select>
            </div>
            <div className=" md:mt-[100px]">
              {/* Print Subtotal, Tax and Total */}
              <div className="flex">
                <div className="flex flex-col font-bold">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">Tax</span>
                  <span className="text-sm">Total</span>
                </div>
                <div className="ml-8 flex flex-col">
                  <span className="text-sm">${subtotal?.toFixed(2) ?? 0}</span>
                  <span className="text-sm">${tax?.toFixed(2) ?? 0}</span>
                  <span className="text-sm">${total?.toFixed(2) ?? 0}</span>
                </div>
              </div>
              <Button className="mt-8 w-full bg-violet-500">Save</Button>
            </div>
          </div>

          {/* Client Block */}
          <div className="flex flex-col gap-4 ">
            <Label className="text-2xl font-bold">{upcomingInvoice}</Label>
            <FormField
              control={methods.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? users.find((user) => user.value === field.value)
                                ?.label
                            : "Select User"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <div className="flex justify-between">
                          <CommandInput
                            className="w-[300px]"
                            placeholder="Search for the user..."
                          />
                          <Link className="p-3" href={"/user/add"}>
                            <UserPlus />
                          </Link>
                        </div>
                        <CommandEmpty>No User found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              value={user.label}
                              key={user.value}
                              onSelect={() => {
                                methods.setValue("userId", user.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  user.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <ClientAvatar />
                              {user.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="mt-5 flex flex-col">
                  <FormLabel>To:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[400px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? clients.find(
                                (client) => client.value === field.value,
                              )?.label
                            : "Select Client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <div className="flex justify-between">
                          <CommandInput
                            className="w-[300px]"
                            placeholder="Search for the client..."
                          />
                          <Link className="p-3" href={"/invoice/edit"}>
                            <UserPlus />
                          </Link>
                        </div>
                        <CommandEmpty>No Client found.</CommandEmpty>
                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              value={client.label}
                              key={client.value}
                              onSelect={() => {
                                methods.setValue("clientId", client.value);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  client.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <ClientAvatar />
                              {client.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          {/* Items Block */}
          <div className="col-span-2 row-span-2">
            <InvoiceItems
              control={control}
              register={register}
              recalculateTotals={recalculateTotals}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

const ClientAvatar = () => {
  return (
    <Avatar className="mr-2">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>
        <Loading />
      </AvatarFallback>
    </Avatar>
  );
};

const InvoiceItems = ({
  control,
  register,
  recalculateTotals,
}: InvoiceItemsProps<InvoiceFormData> & { recalculateTotals: () => void }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });
  return (
    <div className="flex flex-col gap-3">
      <Button
        className="bg-gray-300"
        onClick={() => append({ description: "", amount: 0 })}
        type="button"
      >
        <PlusIcon /> Add Invoice Item
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  {...register(`lineItems.${index}.description`)}
                  placeholder="Description"
                />
              </TableCell>
              <TableCell>
                <Input
                  {...register(`lineItems.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  onBlur={recalculateTotals}
                  placeholder="Amount"
                  type="number"
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => remove(index)}>Remove</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Loading = () => {
  return (
    <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-violet-600"></div>
  );
};

export default CreateInvoiceForm;
