import { cn } from "cn";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginBody } from "../schema";
import { useLogin } from "../hooks/useLogin";
import { LoadingButton } from "@/components/shared/LoadingButton";

const LoginForm = () => {
  const navigate = useNavigate();

  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm({
    resolver: zodResolver(LoginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBody) => {
    await login(data);

    navigate("/", { replace: true });
  };

  return (
    <div className={cn("h-full flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Plaintext account
                </p>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">
                  Email<span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...form.register("email")}
                />

                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">
                    Password<span className="text-red-500">*</span>
                  </FieldLabel>
                  {/* <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                />

                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              {/* Login Button */}
              <Field>
                <LoadingButton type="submit" loading={isPending}>
                  Login
                </LoadingButton>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link to={"/auth/register"}>Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="login_image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};

export default LoginForm;
