import { ProfileView } from "./ProfileView";

export const metadata = {
  title: "プロフィール設定 — CodeDojo",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8 sm:py-10">
      <ProfileView />
    </div>
  );
}
