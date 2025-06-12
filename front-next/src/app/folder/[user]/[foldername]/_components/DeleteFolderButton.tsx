"use client";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
interface Props {
  user: string;
  foldername: string;
}
const DeleteFolderButton = ({ user, foldername }: Props) => {
  const router = useRouter();
  const queryClient = new QueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/folder/delete/${user}/${foldername}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`폴더 '${foldername}' 삭제 실패`);
      }
      return foldername;
    },
    onSuccess: (foldername) => {
      queryClient.removeQueries({ queryKey: ["folders", user] });
      queryClient.removeQueries({ queryKey: ["folder", user, foldername] });
      alert(`폴더 '${decodeURIComponent(foldername)}'가 성공적으로 삭제되었습니다.`);
      router.push(`/`);
    },
    onError: (error: Error) => {
      alert(`폴더 삭제 실패: ${error.message}`);
    },
  });

  return (
    <button onClick={() => mutation.mutate()} className="bg-red-600 text-white px-4 py-2 rounded text-sm mb-4">
      폴더 삭제
    </button>
  );
};
export default DeleteFolderButton;
