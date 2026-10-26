import { CalendarDays, Mail, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/features/auth/schema";

type ProfileHeaderProps = {
  user: User;
};

const formatMemberSince = (dateValue: string) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
};

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Your Dojo account</CardDescription>
        <CardTitle className="text-2xl">Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <UserRound className="size-8" />
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          {user.username && (
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          )}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4" aria-hidden="true" />
              {user.email}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              Member since {formatMemberSince(user.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
