"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
const loginSchema = z.object({
  email: z.email("Please Enter a valid email Adresses"),
  password: z.string().min(8, "Password is required"),
});
type LoginFormValues = z.Infer<typeof loginSchema>;
const LoginForm = () => {
  const from = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const sigupGithub = async () => {
    const data = await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          toast.error("Something Went Wrong");
        },
      },
    );
  };
  const SignUpGoogle = async () => {
    const data = await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          toast.error("Something Went Wrong");
        },
      },
    );
  };
  const onSubmit = async (value: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: value.email,
        password: value.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };
  const ispending = from.formState.isSubmitted;
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...from}>
            <form onSubmit={from.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={sigupGithub}
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={ispending}
                  >
                    <Image
                      src={"/github.svg"}
                      alt="github"
                      width={20}
                      height={60}
                    />
                    Continue With Github
                  </Button>
                  <Button
                    onClick={SignUpGoogle}
                    variant={"outline"}
                    className="w-full"
                    type="button"
                    disabled={ispending}
                  >
                    <Image
                      src={"/google.svg"}
                      alt="google"
                      width={20}
                      height={60}
                    />
                    Continue With Google
                  </Button>
                </div>
                <div className="grid gap-6">
                  <FormField
                    control={from.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={from.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                </div>
                <div className="text-sm text-center">
                  Don't have an account?{" "}
                  <Link
                    href={"/signup"}
                    className="underline underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
