import { GroupsView } from "./GroupsView";

export const metadata = {
  title: "グループ — CodeDojo",
};

export default function GroupsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <GroupsView />
    </div>
  );
}
