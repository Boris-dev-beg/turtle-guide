import { updateFolderStatus } from "@/lib/folder.action";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useFolder() {
  const [data, setData] = useState<{
    id: string;
    userId: string;
    processId: string;
    status: "CREATED" | "PENDING" | "CLOSED" | "ENDED";
  }>({
    id: "",
    userId: "",
    processId: "",
    status: "CREATED",
  });

  const { data: folder } = useQuery({
    queryKey: ["folder", data],
    queryFn: () => updateFolderStatus(data),
    enabled: !!data,
  });

  const updateStatus = (data: {
    id: string;
    userId: string;
    processId: string;
    status: "CREATED" | "PENDING" | "CLOSED" | "ENDED";
  }) => setData(data);

  return {
    folder,
    updateStatus,
  };
}