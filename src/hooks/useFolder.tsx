"use client";
import {
  createOrGetFolderAction,
  deleteFolder,
  getFolder,
  getFolders,
  updateFolderStatus,
} from "@/lib/folder.action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFolder(userId: string, id?: string) {
  const queryClient = useQueryClient();
  const folderId = id ?? "";

  // ! Get user folders
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

  // ! Create or get folder
  const createOrGetFolder = useMutation({
    mutationFn: async (data: {
      procedureName: string;
      userId: string;
      category: string;
    }) => {
      return await createOrGetFolderAction(data);
    },

    onSuccess: (result) => {
      // ? Immediatly set the folder in the cache
      queryClient.setQueryData(
        ["folder", userId, result.folder.id],
        result.folder,
      );

      // ? Invalidate the list of folders
      queryClient.invalidateQueries({
        queryKey: ["folders", userId],
      });
    },
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["folders", userId],
      });

      queryClient.invalidateQueries({
        queryKey: ["folder", userId, variables.id],
      });
    },
  });

  // ! Delete folder
  const delFolder = useMutation({
    mutationFn: async (data: { userId: string; id: string }) => {
      return await deleteFolder(data.id, data.userId);
    },
    onSuccess: (_, variables) => {
      // ? Imediatly remove it in the cache
      queryClient.removeQueries({
        queryKey: ["folder", userId, variables.id],
      });

      // ? Invalidate the list of folders
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

    createOrGetFolder,
    createOrGetFolderAsync: createOrGetFolder.mutateAsync,

    updateStatus,
    delFolder,
  };
}
