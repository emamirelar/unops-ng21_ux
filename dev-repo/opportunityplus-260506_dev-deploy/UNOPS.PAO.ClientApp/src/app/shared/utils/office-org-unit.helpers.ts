/**
 * @fileoverview Maps between Office dropdown ids and OrganizationHierarchy ids for API payloads.
 */

export type OfficeDropdownEntry = {
  id: number;
  organizationHierarchyId?: number | null;
};

export function hierarchyIdsFromSelectedOfficeId(
  selectedOfficeId: number | null | undefined,
  units: OfficeDropdownEntry[]
): number[] {
  if (selectedOfficeId == null) {
    return [];
  }
  const u = units.find((x) => x.id === selectedOfficeId);
  const hid = u?.organizationHierarchyId;
  return hid != null ? [hid] : [];
}

export function selectedOfficeIdFromHierarchyIds(
  hierarchyIds: number[] | null | undefined,
  units: OfficeDropdownEntry[]
): number | null {
  const first = hierarchyIds?.[0];
  if (first == null) {
    return null;
  }
  const byHierarchy = units.find((x) => x.organizationHierarchyId === first);
  if (byHierarchy) {
    return byHierarchy.id;
  }
  const legacySameId = units.find((x) => x.id === first);
  return legacySameId ? legacySameId.id : null;
}
