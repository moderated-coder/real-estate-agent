export const dynamic = "force-dynamic";
import SavedEstateList from "./_components/SavedEstateList";
import DeleteFolderButton from "./_components/DeleteFolderButton";
const FolderPage = async ({ params }: { params: Promise<{ user: string; foldername: string }> }) => {
  const resolvedParams = await params;
  const { user, foldername } = resolvedParams;
  return (
    <div className="flex w-full">
      <div className="flex-1 bg-white p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-5">
          <div className="text-2xl font-bold mb-5">부동산 리스트업</div>
          <DeleteFolderButton user={user} foldername={foldername} />
        </div>

        <SavedEstateList user={user} foldername={foldername} />
      </div>
    </div>
  );
};

export default FolderPage;
