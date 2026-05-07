using UNOPS.PAO.Domain.Infrastructure;

namespace UNOPS.PAO.Domain.Entities;

/// <summary>
/// Polymorphic link between an <see cref="Office"/> and a domain entity (Partner, Contact, Interaction, etc.).
/// Mirrors <see cref="OrganizationUnitRelationship"/> but keys by office instead of organization hierarchy.
/// </summary>
public class OfficeRelationship : ModifiableDeletableEntity
{
    public int OfficeId { get; set; }

    public virtual Office? Office { get; set; }

    public int EntityId { get; set; }

    public required string EntityType { get; set; }
}
