/** Org hierarchy: Admin > Principal > HOD > Faculty > Student (higher rank = more authority). */

export const normalizeRole = (r) => (r ? String(r).trim() : "");

export const normalizeDept = (d) => (d ? String(d).trim() : "");

export const ROLE_RANK = {
  Admin: 5,
  Principal: 4,
  HOD: 3,
  Faculty: 2,
  Student: 1,
};

export function getRoleRank(user) {
  if (!user) return 0;
  const r = normalizeRole(user.role);
  if (user.isAdmin || r === "Admin") return ROLE_RANK.Admin;
  return ROLE_RANK[r] ?? 0;
}

export function canAssignToTargetRank(creatorRank, targetRole) {
  const tr = normalizeRole(targetRole);
  // Principal/Admin are top authority roles and must not be assignees.
  if (tr === "Principal" || tr === "Admin") return false;
  const allowedByRank = {
    [ROLE_RANK.Admin]: ["Principal", "HOD"],
    [ROLE_RANK.Principal]: ["HOD"],
    [ROLE_RANK.HOD]: ["Faculty"],
    [ROLE_RANK.Faculty]: ["Student"],
  };
  const allowedTargets = allowedByRank[creatorRank] || [];
  return allowedTargets.includes(tr);
}

export function assertAssignableTeam(creator, assigneeUsers) {
  const cr = getRoleRank(creator);
  if (!cr) {
    return { ok: false, message: "Your role cannot assign tasks." };
  }
  for (const u of assigneeUsers) {
    if (!canAssignToTargetRank(cr, u.role)) {
      return {
        ok: false,
        message: `You cannot assign tasks to ${u.name || "a user"} (${u.role}). Allowed chain: Principal -> HOD, HOD -> Faculty, Faculty -> Student.`,
      };
    }
  }
  return { ok: true };
}

export function rolesAssignableBy(creator) {
  const cr = getRoleRank(creator);
  if (!cr) return [];
  return Object.entries(ROLE_RANK)
    .filter(([, rank]) => rank < cr)
    .map(([name]) => name);
}

export function canManageTasksRole(user) {
  if (!user) return false;
  const r = normalizeRole(user.role);
  if (user.isAdmin || r === "Admin" || r === "Principal") return true;
  return r === "HOD" || r === "Faculty";
}
