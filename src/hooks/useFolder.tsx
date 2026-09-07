"use client";
import { getFolder, getFolders, updateFolderStatus } from "@/lib/folder.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFolder(userId: string, id?: string) {
  const queryClient = useQueryClient();
  const folderId = id ?? "";

  // ! Get user's folders
  const {
    data: folders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["folders", userId],
    queryFn: async () => await getFolders(userId),
    enabled: !!userId,
  });

  // ! Get One folder
  const {
    data: folder,
    isLoading: folderIsLoading,
    isError: folderIsError,
    error: folderError,
    refetch: folderRefetch,
  } = useQuery({
    queryKey: ["folder", userId, folderId],
    queryFn: async () => await getFolder(folderId, userId),
    enabled: !!userId && !!folderId,
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

  return {
    folders,
    folder,

    isLoading,
    isError,
    refetch,
    folderIsLoading,
    folderIsError,
    folderError,
    folderRefetch,

    updateStatus,
  };
}
