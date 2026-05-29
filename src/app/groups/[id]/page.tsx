import { GroupDetailView } from "./GroupDetailView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GroupDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
      <GroupDetailView groupId={id} />
    </div>
  );
}
