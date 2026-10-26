import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/features/comment/hooks/useCreateComment";
import type { User } from "@/features/auth/schema";
import {
  CreateCommentSchema,
  type CreateCommentBody,
} from "@/features/comment/schema";

type CommentFormProps = {
  postId: string;
  user?: User;
  isUserPending?: boolean;
};

const CommentForm = ({
  postId,
  user,
  isUserPending = false,
}: CommentFormProps) => {
  const createComment = useCreateComment();
  const form = useForm<CreateCommentBody>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: { content: "" },
  });

  const onSubmit = (body: CreateCommentBody) => {
    createComment.mutate(
      { postId, body },
      { onSuccess: () => form.reset() },
    );
  };

  if (isUserPending) {
    return (
      <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        Checking your account...
      </p>
    );
  }

  if (!user) {
    return (
      <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          to="/auth"
        >
          Sign in
        </Link>{" "}
        to join the conversation.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Field>
        <FieldLabel htmlFor="new-comment">Add a comment</FieldLabel>
        <Textarea
          id="new-comment"
          maxLength={240}
          placeholder="Share your thoughts..."
          aria-invalid={Boolean(form.formState.errors.content)}
          {...form.register("content")}
        />
        <FieldError errors={[form.formState.errors.content]} />
        <FieldDescription>Maximum 240 characters.</FieldDescription>
      </Field>
      <Button type="submit" disabled={createComment.isPending}>
        {createComment.isPending ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
};

export default CommentForm;
