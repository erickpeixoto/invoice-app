"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { UploadCloud } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import type { UploadFileResponse } from "uploadthing/client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import type { RouterInputs } from "~/utils/api";
import { api } from "~/utils/api";
import { UploadButton } from "~/utils/uploadthing";

type ClientFormData = RouterInputs["costumer"]["create"];

const CreateInvoiceForm = () => {
  const methods = useForm<ClientFormData>();
  const { register, handleSubmit } = methods;

  const { toast } = useToast();
  const router = useRouter();
  const { userId } = useAuth();

  const [profile, setProfile] = useState(
    {} as UploadFileResponse[] | undefined,
  );

  const { mutateAsync: createClient } = api.costumer.create.useMutation({
    onSuccess() {
      toast({
        title: "Client created!",
        description: "We've created your Client for you.",
        duration: 5000,
      });
      router.push("/clients");
    },
    onError(error) {
      console.error("Error creating client:", error);
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    const costumerMock = {
      profile: profile?.[0]?.url ?? "",
      authId: userId!,
    };
    console.log({ ...data, ...costumerMock });
    await createClient({ ...data, ...costumerMock });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex h-screen">
          {/* Logo Block */}
          <div className="flex w-[350px] flex-col gap-3 border-r-2 border-r-slate-200 p-10">
            <div className="mb-20 flex h-[200px] justify-center rounded-2xl bg-white p-4 shadow-xl">
              {profile?.[0]?.url && (
                <Avatar className="mr-2 h-[150px] w-[150px]">
                  <AvatarImage
                    src={profile?.[0]?.url}
                    alt="Profile"
                    className="rounded-2xl"
                  />
                  <AvatarFallback>
                    <Loading />
                  </AvatarFallback>
                </Avatar>
              )}

              {!profile?.[0]?.url && (
                <UploadButton
                  content={{
                    button({ isUploading, ready }) {
                      return (
                        <div className="flex flex-col items-center justify-center">
                          {!isUploading && ready && (
                            <UploadCloud className="text-6xl text-violet-600" />
                          )}
                          <div className="text-sm">Profile</div>
                        </div>
                      );
                    },
                    allowedContent({ ready, isUploading }) {
                      if (!ready) return <Loading />;
                      if (isUploading) return <Loading />;

                      return (
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-sm">
                            Click to upload your logo
                          </div>
                        </div>
                      );
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
              )}
            </div>
          </div>

          {/* Client Block */}
          <div className="flex w-full flex-col gap-3 p-5">
            <Label className="mb-5 text-2xl font-bold">
              Create a new Client
            </Label>
            <Input
              {...register("name")}
              placeholder="Name..."
              className="mt-2"
            />
            <Input
              {...register("email")}
              placeholder="Email..."
              className="mt-2"
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
            <Input
              {...register("city")}
              placeholder="City..."
              className="mt-2"
            />
            <Input
              {...register("state")}
              placeholder="State..."
              className="mt-2"
            />
            <div>
              <Button className="mt-8 w-1/3  bg-violet-500">Save</Button>
            </div>
          </div>
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

export default CreateInvoiceForm;
