"use client";
import { getFolders, updateFolderStatus } from "@/lib/folder.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFolder(userId: string) {
  const queryClient = useQueryClient();
  // ! Get user's folders

  const { data: folders, isLoading, isError,refetch } = useQuery({
    queryKey: ["folders", userId],
    queryFn: async () => await getFolders(userId as string),
    enabled: !!userId,
  });

  // ! Update folder's status
  const updateStatus = useMutation({
    mutationFn: async (data: {
      id: string;
      userId: string;
      processId: string;
      status: "CREATED" | "PENDING" | "CLOSED" | "ENDED";
    }) => {
      return await updateFolderStatus(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders", userId],
      });
    },
  });

  console.log("Folders (server):", folders);

  return {
    folders,
    isLoading,
    isError,
    refetch,
    updateStatus,
  };
}
