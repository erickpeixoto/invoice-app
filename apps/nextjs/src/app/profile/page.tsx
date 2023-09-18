import React from "react";
import { UserProfile } from "@clerk/nextjs";

const ProfilePage = () => {
  return (
    <>
      <UserProfile path="/profile" routing="path" />
    </>
  );
};

export default ProfilePage;
