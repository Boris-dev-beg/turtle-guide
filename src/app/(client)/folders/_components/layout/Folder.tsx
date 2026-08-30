"use client";

import { useFolderStore } from "@/store/folder.store";

export default function Folder() {
  const { procedure, category } = useFolderStore();
  return (
    <div>
      <h1>Procedure: {procedure}</h1>
      <h1>Category: {category}</h1>
    </div>
  );
}
