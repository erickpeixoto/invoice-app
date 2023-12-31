/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-types */
"use client";

// External Packages
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Settings, UploadCloud } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
// Type Imports
import type { UploadFileResponse } from "uploadthing/client";
import type { typeToFlattenedError } from "zod";

// Internal Components and Utilities
import UserDataTable from "~/components/ClientDataTable";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ConfirmDialog } from "~/components/ui/confim";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import type { RouterInputs } from "~/utils/api";
import { mapSourceToTarget } from "~/utils/mappers";
import { UploadButton } from "~/utils/uploadthing";

export const runtime = "edge";

type UserFormData = RouterInputs["users"]["create"];

interface MutationSuccessData {
  insertId: string;
}

const CreateInvoiceForm = ({ params }: { params: { scenario: string[] } }) => {
  let { scenario } = params;

  if (scenario && scenario.length === 1) {
    const decodedScenario = decodeURIComponent(scenario[0] ?? "");
    scenario = decodedScenario.split("/");
  }

  const methods = useForm<UserFormData>();
  const { register, handleSubmit, setValue } = methods;

  const { toast } = useToast();
  const { userId } = useAuth();
  const context = api.useContext();
  const router = useRouter();

  const [profile, setProfile] = useState(
    {} as (UploadFileResponse[] & { url?: string | null }) | undefined,
  );
  const [idToBeDeleted, setIdToBeDeleted] = useState<number | undefined>();

  const [isOpen, setIsOpen] = useState(scenario[0] === "edit");
  const [confirmModal, setConfirmModal] = useState(false);

  const users = api.users.all.useQuery().data;
  const transformedData = mapSourceToTarget(users);

  // Edition mode
  const userSelectedQuery = api.users.selected.useQuery({
    id: scenario[1] ? parseInt(scenario[1]) : -1,
  });
  const userSelected = userSelectedQuery.data?.[0];

  useEffect(() => {
    if (userSelected && scenario[0] === "edit") {
      setSelectedValues(userSelected as unknown as UserFormData, setValue);
      setProfile(undefined);
    }
  }, [userSelected, scenario, setValue]);

  // Create mode
  const { mutateAsync: createUser, error } = api.users.create.useMutation({
    async onSuccess({ insertId }: MutationSuccessData) {
      toast({
        title: "User created!",
        description: "We've created your User for you.",
        duration: 5000,
      });
      await context.users.all.invalidate();
      if (insertId) {
        router.push(`/user/edit/${insertId}`);
      }
    },
    onError() {
      console.error("Error creating user:", error);
    },
  });
  // Edit mode
  const { mutateAsync: editUser } = api.users.update.useMutation({
    async onSuccess() {
      toast({
        title: "User updated!",
        description: "We've updated your User for you.",
        duration: 5000,
      });
      await context.users.all.invalidate();
    },
    onError(error) {
      console.error("Error updating user:", error);
    },
  });

  // Delete mode
  const { mutateAsync: deleteUser } = api.users.delete.useMutation<number>({
    async onSuccess() {
      toast({
        title: "User deleted!",
        description: "We've deleted your User for you.",
        duration: 5000,
      });
      await context.users.all.invalidate();
      router.push(`/user/list/`);
    },
    onError(error) {
      console.error("Error deleting user:", error);
    },
  });

  const onDelete = (data: UserFormData) => {
    setConfirmModal(true);
    setIdToBeDeleted(data?.id ?? 0);
  };

  const onSubmit = async (data: UserFormData) => {
    const usersMock = {
      profile: profile?.[0]?.url ?? "",
      authId: userId!,
    };
    if (scenario[0] === "edit") {
      await editUser({
        ...data,
        ...usersMock,
        id: userSelected?.id ?? 0,
      });
      return;
    }
    await createUser({ ...data, ...usersMock });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-screen flex-col md:flex-row">
          {/* Logo Block */}
          <div className="flex w-full flex-col gap-3 border-r-2 border-r-slate-200 p-10 md:w-[350px]">
            <div className="mb-20 flex h-[200px] justify-center rounded-2xl bg-white p-4 shadow-xl">
              {userSelected && !profile?.[0]?.url && (
                <Avatar className="mr-2 h-[150px] w-[150px]">
                  <AvatarImage
                    src={userSelected?.profile ?? ""}
                    alt="Profile"
                    className="inline-block rounded-full"
                  />
                  {!userSelected?.profile && (
                    <AvatarImage
                      src={"https://via.placeholder.com/150"}
                      alt="Profile"
                      className="inline-block rounded-full"
                    />
                  )}
                </Avatar>
              )}

              {profile?.[0]?.url && (
                <Avatar className="mr-2 h-[150px] w-[150px]">
                  <AvatarImage
                    src={profile?.[0]?.url ?? ""}
                    alt="Profile"
                    className="inline-block rounded-full"
                  />
                </Avatar>
              )}

              <UploadButton
                content={{
                  button({ isUploading, ready }) {
                    return (
                      <div className="flex flex-col items-center justify-center">
                        {!isUploading && ready && !userSelected && (
                          <UploadCloud className="text-6xl text-violet-600" />
                        )}
                        {!isUploading && ready && userSelected && (
                          <Settings className="mt-5 h-7 w-7 text-gray-400 hover:text-violet-600" />
                        )}
                        <div className="text-sm">Profile</div>
                      </div>
                    );
                  },
                  allowedContent({ ready, isUploading }) {
                    if (!ready) return <Loading />;
                    if (isUploading) return <Loading />;
                    if (!userSelected && !profile?.[0]?.url) {
                      return (
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-sm">
                            Click to upload your logo
                          </div>
                        </div>
                      );
                    }
                    return "";
                  },
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setProfile(res);
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  console.error(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </div>

          {/* User Block */}
          <UserBlock
            scenario={scenario}
            isOpen={isOpen}
            register={register}
            setIsOpen={setIsOpen}
            transformedData={transformedData}
            zodError={
              error?.data
                ?.zodError as unknown as typeToFlattenedError<UserFormData>
            }
            handleDelete={onDelete}
          />

          {/* Confirm Dialog */}
          {confirmModal && (
            <ConfirmDialog
              isOpen={confirmModal}
              triggerLabel=""
              title="Are you sure?"
              description="When you delete this user, it will be gone forever."
              onConfirm={() => {
                void deleteUser(idToBeDeleted ?? 0);
                setConfirmModal(false);
              }}
              onCancel={() => setConfirmModal(false)}
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
};

const Loading = () => {
  return (
    <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-solid border-violet-600"></div>
  );
};

const setSelectedValues = (data: UserFormData, setValue: Function) => {
  Object.keys(data).forEach((key) => {
    setValue(key, data[key as keyof UserFormData]);
  });
};

const UserBlock = ({
  scenario,
  isOpen,
  setIsOpen,
  register,
  transformedData,
  zodError,
  handleDelete,
}: {
  scenario: string[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  register: Function;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformedData: any;
  zodError: typeToFlattenedError<UserFormData>;
  handleDelete: (data: UserFormData) => void;
}) => (
  <div className="flex w-full flex-col gap-3 p-5">
    <div className="flex w-full flex-col gap-3 p-5">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2 md:w-2/3"
      >
        <div className="flex gap-3">
          <Label className="mb-5 text-2xl font-bold">
            {scenario[1] ? "edit User" : "new User"}
          </Label>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="flex gap-2 bg-violet-400 text-white hover:bg-violet-500 hover:text-white"
              type="button"
            >
              <span>{!isOpen ? "Open Form" : "Close Form"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2">
          <Input
            {...register("name")}
            placeholder={zodError?.fieldErrors?.name ?? "Name..."}
            className={cn(
              "mt-2",
              zodError?.fieldErrors?.name && "border border-red-500",
            )}
          />
          <Input
            {...register("email")}
            placeholder={zodError?.fieldErrors?.email ?? "Email..."}
            className={cn(
              "mt-2",
              zodError?.fieldErrors?.email && "border border-red-500",
            )}
            type="email"
          />
          <Input
            {...register("phone")}
            placeholder="Phone..."
            className="mt-2"
            type="tel"
          />
          <Input {...register("zip")} placeholder="Zip..." className="mt-2" />
          <Input
            {...register("address")}
            placeholder="Address..."
            className="mt-2"
          />
          <Input {...register("city")} placeholder="City..." className="mt-2" />
          <Input
            {...register("state")}
            placeholder="State..."
            className="mt-2"
          />
          <div>
            <Button className="mt-8 w-1/3  bg-violet-500">
              {scenario[1] ? "Edit" : "Create"}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <UserDataTable data={transformedData} onDelete={handleDelete} />
    </div>
  </div>
);

export default CreateInvoiceForm;
