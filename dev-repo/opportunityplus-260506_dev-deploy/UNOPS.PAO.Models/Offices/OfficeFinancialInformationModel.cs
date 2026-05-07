namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Financial information section for office detail (Phase 1: stubbed).
/// </summary>
public class OfficeFinancialInformationModel
{
    public string? CostCentreId { get; set; }
    public string? FinancialCentreType { get; set; }
    public string? Funding { get; set; }
    public decimal? NerTarget { get; set; }
    public string? NerTargetPeriod { get; set; }
    public decimal? EaTarget { get; set; }
    public string? EaTargetPeriod { get; set; }
}
