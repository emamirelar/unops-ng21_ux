using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;

namespace UNOPS.PAO.Business.Extensions;

public static class ContactExtensions
{
    /// <summary>Loads active <see cref="OfficeRelationship"/> rows for a contact (not EF-mapped on <see cref="Contact"/>).</summary>
    public static async Task LoadOrganizationUnitRelationshipsAsync(this Contact contact, AppDbContext context)
    {
        if (contact?.Id > 0)
        {
            contact.OfficeRelationships = await context.OfficeRelationships
                .Include(r => r.Office)
                .ThenInclude(o => o!.OrganizationHierarchy)
                .Where(r => r.EntityId == contact.Id
                            && r.EntityType == nameof(Contact)
                            && !r.IsDeleted
                            && r.Status == EntityStatus.Active)
                .ToListAsync();
        }
    }

    public static async Task LoadOrganizationUnitRelationshipsAsync(this IEnumerable<Contact> contacts, AppDbContext context)
    {
        var contactList = contacts.ToList();
        if (!contactList.Any()) return;

        var contactIds = contactList.Select(c => c.Id).ToList();

        var allRelationships = await context.OfficeRelationships
            .Include(r => r.Office)
            .ThenInclude(o => o!.OrganizationHierarchy)
            .Where(r => contactIds.Contains(r.EntityId)
                        && r.EntityType == nameof(Contact)
                        && !r.IsDeleted
                        && r.Status == EntityStatus.Active)
            .ToListAsync();

        var relationshipsByContact = allRelationships.GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => g.ToList());

        foreach (var contact in contactList)
        {
            contact.OfficeRelationships = relationshipsByContact.TryGetValue(contact.Id, out var relationships)
                ? relationships
                : new List<OfficeRelationship>();
        }
    }

    public static async Task EnsureOrganizationUnitRelationshipsLoadedAsync(this IEnumerable<Contact> contacts, AppDbContext context)
    {
        var contactsNeedingLoad = contacts.Where(c =>
            c.OfficeRelationships == null || !c.OfficeRelationships.Any()).ToList();

        if (contactsNeedingLoad.Any())
            await contactsNeedingLoad.LoadOrganizationUnitRelationshipsAsync(context);
    }
}
