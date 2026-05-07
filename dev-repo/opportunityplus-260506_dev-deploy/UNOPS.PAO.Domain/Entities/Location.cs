using System.ComponentModel.DataAnnotations;
using UNOPS.PAO.Domain.Enums;

namespace UNOPS.PAO.Domain.Entities;

/// <summary>
/// Location entity representing physical office locations.
/// Data synced from EDS (BigQuery Locations.Location).
/// One Office can have multiple Locations.
/// </summary>
public class Location : IBaseBusinessEntity<int>
{
    // IBaseBusinessEntity requirements
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public EntityStatus Status { get; set; } = EntityStatus.Active;

    // Audit field (managed by External Data Service)
    public bool IsDeleted { get; set; }

    /// <summary>
    /// <summary>
    /// Unique code (e.g. B5015LC-0001).
    /// </summary>
    [Required]
    [MaxLength(50)]
    public required string Code { get; set; }

    /// <summary>
    /// FK to Office; derived from Location_Parent_Entity (Org_Unit).
    /// </summary>
    public int OfficeId { get; set; }

    /// <summary>
    /// Navigation property to parent Office.
    /// </summary>
    public virtual Office? Office { get; set; }

    /// <summary>
    /// Alias or alternate name.
    /// </summary>
    [MaxLength(255)]
    public string? Alias { get; set; }

    /// <summary>
    /// Description of the location.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Location type (e.g. ORGUNIT_OFFICE).
    /// </summary>
    [MaxLength(50)]
    public string? LocationType { get; set; }

    /// <summary>
    /// Street address line.
    /// </summary>
    [MaxLength(500)]
    public string? AddressLine { get; set; }

    /// <summary>
    /// Postal/ZIP code.
    /// </summary>
    [MaxLength(20)]
    public string? PostalCode { get; set; }

    /// <summary>
    /// City name.
    /// </summary>
    [MaxLength(100)]
    public string? City { get; set; }

    /// <summary>
    /// State/Province.
    /// </summary>
    [MaxLength(100)]
    public string? State { get; set; }

    /// <summary>
    /// Country ISO code (e.g. IQ).
    /// </summary>
    [MaxLength(10)]
    public string? CountryCode { get; set; }

    /// <summary>
    /// Country name.
    /// </summary>
    [MaxLength(100)]
    public string? CountryName { get; set; }

    /// <summary>
    /// Primary latitude (first coordinate by Coordinate_Order) for map display.
    /// </summary>
    public decimal? PrimaryLatitude { get; set; }

    /// <summary>
    /// Primary longitude (first coordinate by Coordinate_Order) for map display.
    /// </summary>
    public decimal? PrimaryLongitude { get; set; }

    /// <summary>
    /// Full coordinates array as JSON (jsonb).
    /// </summary>
    public string? CoordinatesJson { get; set; }

    /// <summary>
    /// Location coordinator user ID.
    /// </summary>
    [MaxLength(50)]
    public string? LocationCoordinatorId { get; set; }

    /// <summary>
    /// oUP GUID for the location.
    /// </summary>
    [MaxLength(50)]
    public string? LocationGuid { get; set; }
}
