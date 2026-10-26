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
import { LoadingButton } from "@/components/shared/LoadingButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterBody } from "../schema";
import { useRegister } from "../hooks/useRegister";

const RegisterForm = () => {
  const navigate = useNavigate();

  const { mutateAsync: register, isPending } = useRegister();

  const form = useForm({
    resolver: zodResolver(RegisterSchema),

    defaultValues: {
      name: "",
      username: undefined,
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (data: RegisterBody) => {
    await register(data);

    navigate("/auth", { replace: true });
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to create your account
                </p>
              </div>

              {/* Name */}
              <Field>
                <FieldLabel htmlFor="name">
                  Full Name<span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g. John Doe"
                  {...form.register("name")}
                />

                <FieldError errors={[form.formState.errors.name]} />
              </Field>

              {/* Username */}
              <Field>
                <FieldLabel htmlFor="username">
                  Username <span className="text-xs">(optional)</span>
                </FieldLabel>
                <Input
                  id="username"
                  placeholder="e.g. john_doe_123"
                  {...form.register("username")}
                />

                <FieldError errors={[form.formState.errors.username]} />
              </Field>

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

                <FieldDescription className="text-xs">
                  We&apos;ll use this to contact you. We will not share your
                  email with anyone else.
                </FieldDescription>
              </Field>

              <Field>
                <Field className="flex flex-row space-x-4">
                  {/* Password */}
                  <Field>
                    <FieldLabel htmlFor="password">
                      Password<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...form.register("password")}
                    />

                    <FieldError errors={[form.formState.errors.password]} />
                  </Field>

                  {/* Password Confirmation */}
                  <Field>
                    <FieldLabel htmlFor="password_confirmation">
                      Confirm Password<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="password_confirmation"
                      type="password"
                      {...form.register("password_confirmation")}
                    />

                    <FieldError
                      errors={[form.formState.errors.password_confirmation]}
                    />
                  </Field>
                </Field>
                <FieldDescription className="text-xs">
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              {/* Register Button */}
              <Field>
                <LoadingButton type="submit" loading={isPending}>
                  Create Account
                </LoadingButton>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <Link to={"/auth"}>Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="register-image"
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

export default RegisterForm;
