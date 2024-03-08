import { useGetCurrentUser, useUpdateMyUser } from "@/api/myUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import { Loader2 } from "lucide-react";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetCurrentUser();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();

  if (isGetLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }
  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
