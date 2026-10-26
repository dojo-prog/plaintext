import ErrorState from "@/components/shared/ErrorState";
import LoadingGrid from "@/components/post/LoadingGrid";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const ProfilePage = () => {
  const currentUser = useCurrentUser();

  if (currentUser.isPending) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-xl border p-6" aria-label="Loading profile">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-3 h-4 w-64" />
        </section>
        <LoadingGrid />
      </div>
    );
  }

  if (currentUser.isError || !currentUser.data) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState
          title="Could not load your profile"
          description="Your account information is unavailable right now."
          onRetry={() => void currentUser.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <ProfileHeader user={currentUser.data} />
      <ProfilePosts />
    </div>
  );
};

export default ProfilePage;
