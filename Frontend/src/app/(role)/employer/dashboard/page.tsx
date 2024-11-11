import EmployerDashbaord from "@/components/EmployerDashbaord";
import React from "react";
import { auth } from "../../../../../auth";

const page = async () => {
  const getSession = await auth();
  return (
    <div>
      <EmployerDashbaord session={getSession} user={getSession?.user} />
    </div>
  );
};

export default page;
