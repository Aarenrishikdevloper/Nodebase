import * as React from "react";
import RegisterForm from "../_components/RegisterForm";
import { requireUNAuth } from "@/lib/auth-utils";

const Signup = async () => {
  await requireUNAuth();
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default Signup;
