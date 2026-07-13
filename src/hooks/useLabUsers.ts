import { useLabs } from "../context/LabsContext";
import type { CenterUser } from "../data/centerUsers";

export function useLabUsers(labId: number) {
  const { getLabUsers, createLabUser, updateLabUser } = useLabs();
  const users = getLabUsers(labId);

  return {
    users,
    createUser: (user: CenterUser) => createLabUser(labId, user),
    updateUser: (userId: string, patch: Partial<CenterUser>) => updateLabUser(labId, userId, patch),
    findUser: (userId: string) =>
      users.find((user) => user.id === userId || user.username === userId),
  };
}
