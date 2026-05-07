using System.Collections.Generic;
using System.Linq;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.DataAccess.Context;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Domain.Enums;

namespace UNOPS.PAO.Business.Extensions
{
    public static class InteractionExtensions
    {
        /// <summary>Loads active <see cref="OfficeRelationship"/> rows for an interaction (not EF-mapped on <see cref="Interaction"/>).</summary>
        public static async Task LoadOrganizationUnitRelationshipsAsync(this Interaction interaction, AppDbContext context)
        {
            if (interaction?.Id > 0)
            {
                interaction.OfficeRelationships = await context.OfficeRelationships
                    .Include(r => r.Office)
                    .ThenInclude(o => o!.OrganizationHierarchy)
                    .Where(r => r.EntityId == interaction.Id
                                && r.EntityType == nameof(Interaction)
                                && !r.IsDeleted
                                && r.Status == EntityStatus.Active)
                    .ToListAsync();
            }
        }

        public static async Task LoadOrganizationUnitRelationshipsAsync(this IEnumerable<Interaction> interactions, AppDbContext context)
        {
            var interactionList = interactions.ToList();
            if (!interactionList.Any()) return;

            var interactionIds = interactionList.Select(i => i.Id).ToList();

            var allRelationships = await context.OfficeRelationships
                .Include(r => r.Office)
                .ThenInclude(o => o!.OrganizationHierarchy)
                .Where(r => interactionIds.Contains(r.EntityId)
                            && r.EntityType == nameof(Interaction)
                            && !r.IsDeleted
                            && r.Status == EntityStatus.Active)
                .ToListAsync();

            var relationshipsByInteraction = allRelationships.GroupBy(r => r.EntityId)
                .ToDictionary(g => g.Key, g => g.ToList());

            foreach (var interaction in interactionList)
            {
                interaction.OfficeRelationships = relationshipsByInteraction.TryGetValue(interaction.Id, out var relationships)
                    ? relationships
                    : new List<OfficeRelationship>();
            }
        }

        public static async Task EnsureOrganizationUnitRelationshipsLoadedAsync(this Interaction interaction, AppDbContext context)
        {
            if (interaction?.OfficeRelationships == null || !interaction.OfficeRelationships.Any())
            {
                await interaction.LoadOrganizationUnitRelationshipsAsync(context);
            }
        }
    }
}
