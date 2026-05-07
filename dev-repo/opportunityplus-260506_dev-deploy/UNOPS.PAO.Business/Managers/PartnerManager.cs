namespace UNOPS.PAO.Business.Managers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Interfaces;
using UNOPS.PAO.Business.Repositories.Generic;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.UNOPSDomain.Entities;
using UNOPS.PAO.Utilities.Helpers;
using Microsoft.AspNetCore.Http;
using UNOPS.PAO.DataAccess.Services;
using UNOPS.PAO.Domain.Infrastructure;
using UNOPS.PAO.Domain.Specifications;
using System.Security.Claims;
using UNOPS.PAO.Business.Services;
using UNOPS.PAO.Models.OrganizationUnits;
using UNOPS.PAO.Models.Partners;
using UNOPS.PAO.Models.Shared;
using UNOPS.PAO.Models.Integrations;

public class PartnerManager : IPartnerManager
{
    private IMapper mapper;
    private AppDbContext _context;

    private DataRepository<Partner> PartnerRepository;
    private DataRepository<PartnerTree> PartnerTreeRepository;
    private DataRepository<OrganizationHierarchy> OrganizationHierarchyRepository;

    public PartnerManager(IMapper mapper, AppDbContext context)
    {
        this.mapper = mapper;
        this._context = context;
        this.PartnerRepository = new DataRepository<Partner>(context);
        this.PartnerTreeRepository = new DataRepository<PartnerTree>(context);
        this.OrganizationHierarchyRepository = new DataRepository<OrganizationHierarchy>(context);
    }

    private async Task EnrichPartnerModelsOrganizationUnitsAsync(
        IReadOnlyList<PartnerModel> models,
        CancellationToken cancellationToken = default)
    {
        if (models == null || models.Count == 0)
            return;

        var ids = models.Select(m => m.Id).Where(id => id > 0).Distinct().ToList();
        if (ids.Count == 0)
            return;

        var dict = await OfficeRelationshipSyncHelper.GetPartnerOrganizationUnitModelsByPartnerIdsAsync(
            _context,
            ids,
            cancellationToken);

        foreach (var m in models)
        {
            m.OfficeRelationships = dict.TryGetValue(m.Id, out var list)
                ? list
                : new List<OrganizationUnitRelationshipModel>();
            m.PartnerOrgUnit = OfficeRelationshipSyncHelper.FormatPartnerOrgUnitDisplay(m.OfficeRelationships);
        }
    }

    private async Task UpdateOrganizationUnitRelationshipsDifferentialAsync(int partnerId, IEnumerable<int> newOrgUnitIds)
    {
        await OfficeRelationshipSyncHelper.ReplaceForHierarchyKeysAsync(
            _context,
            partnerId,
            nameof(Partner),
            newOrgUnitIds);
    }

    public async Task<PartnerModel> CreatePartnerAsync(PartnerRequest model)
    {
        var entity = mapper.Map<Partner>(model);

        // Save the partner first to get its ID
        await PartnerRepository.AddAsync(entity);

        if (model.OrganizationHierarchyIds != null && model.OrganizationHierarchyIds.Any())
        {
            await OfficeRelationshipSyncHelper.ReplaceForHierarchyKeysAsync(
                _context,
                entity.Id,
                nameof(Partner),
                model.OrganizationHierarchyIds);
        }

        var created = mapper.Map<PartnerModel>(entity);
        await EnrichPartnerModelsOrganizationUnitsAsync(new[] { created });
        return created;
    }

    public async Task<PaginationResponse<PartnerModel>> GetPartners(int userId, PaginationRequest request)
    {
        var excludeIds = await OfficeRelationshipSyncHelper.GetPartnerIdsWithOnlyNonOrgUnitOfficeLinksAsync(_context);
        var query = PartnerRepository
            .GetAll(["PartnerGroup", "Contacts"])
            .Where(x => !x.IsDeleted && !excludeIds.Contains(x.Id))
            .AsQueryable();

        var filteredEntities = await query.ToListAsync();

        // Get total count after filtering
        var totalCount = filteredEntities.Count;
        
        // Apply pagination
        var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
        var excludedRows = (pageIndex - 1) * request.PageSize;
        
        if (request.OrderBy != null)
        {
            filteredEntities = filteredEntities.AsQueryable().OrderByColumnName(request.OrderBy, request.Ascending ?? true).ToList();
        }
        
        // Get the entities for this page
        var pagedEntities = filteredEntities
            .Skip(excludedRows)
            .Take(request.PageSize)
            .ToList();
        
        // Map entities
        var mappedEntities = pagedEntities.Select(x => mapper.Map<PartnerModel>(x)).ToList();
        await EnrichPartnerModelsOrganizationUnitsAsync(mappedEntities);

        return new PaginationResponse<PartnerModel>
        {
            TotalCount = totalCount,
            Records = mappedEntities
        };
    }
    
    public async Task<PaginationResponse<PartnerModel>> GetPartnersWithSpecification(int userId, ISpecification<Partner> specification, PaginationRequest pagination)
    {
        var excludeIds = await OfficeRelationshipSyncHelper.GetPartnerIdsWithOnlyNonOrgUnitOfficeLinksAsync(_context);
        var query = PartnerRepository.GetAll().AsQueryable();

        var filteredQuery = query.ApplySpecification(specification);
        
        // Apply org unit filtering if the specification supports it
        filteredQuery = ApplyOrgUnitFilterIfSupported(filteredQuery, specification);
        
        var filteredEntities = await filteredQuery.Where(x => !excludeIds.Contains(x.Id)).ToListAsync();
        
        // Get total count after filtering
        var totalCount = filteredEntities.Count;
        
        // Apply pagination
        var pageIndex = pagination.PageIndex < 1 ? 1 : pagination.PageIndex;
        var excludedRows = (pageIndex - 1) * pagination.PageSize;
        
        if (pagination.OrderBy != null)
        {
            filteredEntities = filteredEntities.AsQueryable().OrderByColumnName(pagination.OrderBy, pagination.Ascending ?? true).ToList();
        }
        
        // Get the entities for this page
        var pagedEntities = filteredEntities
            .Skip(excludedRows)
            .Take(pagination.PageSize)
            .ToList();
        
        // Map entities
        var mappedEntities = pagedEntities.Select(x => mapper.Map<PartnerModel>(x)).ToList();
        await EnrichPartnerModelsOrganizationUnitsAsync(mappedEntities);

        return new PaginationResponse<PartnerModel>
        {
            TotalCount = totalCount,
            Records = mappedEntities
        };
    }

    public virtual async Task<object> GetPartnersWithSpecificationAsync(ClaimsPrincipal user, ISpecification<Partner> specification, PaginationRequest pagination)
    {
        throw new NotImplementedException("GetPartnersWithSpecificationAsync not implemented in base PartnerManager");
    }

    // Implementation for UNOPSPartner specification (interface requirement)
    public async Task<PaginationResponse<PartnerModel>> GetPartnersWithSpecification(int userId, ISpecification<UNOPSPartner> specification, PaginationRequest pagination)
    {
        // This implementation doesn't support UNOPSPartner specifications since this manager works with Partner entities
        // Return empty result or throw NotSupportedException
        throw new NotSupportedException("This PartnerManager implementation does not support UNOPSPartner specifications. Use UNOPSPartnerManager instead.");
    }

    public async Task<PartnerModel?> GetPartner(int userId, int id)
    {
        var item = await PartnerRepository
            .GetAll()
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();

        if (item == null)
        {
            return default;
        }

        if (await OfficeRelationshipSyncHelper.PartnerHasOnlyNonOrgUnitOfficeLinksAsync(_context, item.Id))
            return default;

        var model = mapper.Map<PartnerModel>(item);
        await EnrichPartnerModelsOrganizationUnitsAsync(new[] { model });
        return model;
    }

    /*public IEnumerable<ExternalPartnerModel> GetPostedPartners()
    {
        return PartnerRepository
            .GetAll()
            .Select(mapper.Map<ExternalPartnerModel>);
    }

    public async Task<ExternalPartnerModel?> GetPostedPartner(int id)
    {
        var item = await PartnerRepository.GetByIdAsync(id, ["EligibleEntities"]);

        if (item == null)
        {
            return default;
        }

        return mapper.Map<ExternalPartnerModel>(item);
    }*/

    public async Task<PartnerModel?> UpdatePartnerAsync(int userId, UpdatePartnerRequest model)
    {
        var entity = await PartnerRepository
            .GetAll()
            .Where(x => x.Id == model.Id)
            .FirstOrDefaultAsync();

        if (entity == null)
        {
            return default;
        }

        // Handle organization unit relationship updates using differential approach
        if (model.OrganizationHierarchyIds != null)
        {
            await UpdateOrganizationUnitRelationshipsDifferentialAsync(entity.Id, model.OrganizationHierarchyIds);
        }

        mapper.Map<UpdatePartnerRequest, Partner>(model, entity);
        await PartnerRepository.UpdateAsync(entity);

        var updated = mapper.Map<PartnerModel>(entity);
        await EnrichPartnerModelsOrganizationUnitsAsync(new[] { updated });
        return updated;
    }

    /*public async Task<PartnerModel?> UpdateStage(int userId, int id, string newStage)
    {
        var entity = await PartnerRepository.GetByIdAsync(id);

        if (entity == null)
        {
            return default;
        }

        entity.Stage = newStage;

        if (newStage == "Open")
        {
            entity.PostingDate = DateTime.Now.ToUniversalTime();
        }

        await PartnerRepository.UpdateAsync(entity);

        return mapper.Map<PartnerModel>(entity);
    }*/

    public async Task DeletePartnerAsync(int userId, int id)
    {
        var entity = await PartnerRepository.GetByIdAsync(id);
        if (entity != null)
        {
            await PartnerRepository.Delete(entity);
        }
    }

    public async Task<PartnerModel?> GetPartnerAsync(int id)
    {
        string[] includes = ["Documents", "PartnerGroup", "Contacts"];

        var item = await PartnerRepository
            .GetAll(includes)
            .Where(x => x.Id == id)
            .FirstOrDefaultAsync();

        if (item == null)
        {
            return default;
        }

        if (await OfficeRelationshipSyncHelper.PartnerHasOnlyNonOrgUnitOfficeLinksAsync(_context, item.Id))
            return default;

        var model = mapper.Map<PartnerModel>(item);
        await EnrichPartnerModelsOrganizationUnitsAsync(new[] { model });
        return model;
    }

    /// <summary>
    /// Gets a partner with its contacts and their interactions included
    /// </summary>
    public async Task<PartnerModel?> GetPartnerWithContactsAndInteractionsAsync(int id)
    {
        // Include contacts and their interactions using standard Entity Framework includes
        string[] includes = ["Documents", "PartnerGroup", "Contacts", "Contacts.Interactions"];

        var partner = await PartnerRepository
            .GetAll(includes)
            .Where(x => x.Id == id && !x.IsDeleted)
            .FirstOrDefaultAsync();

        if (partner == null)
        {
            return default;
        }

        if (await OfficeRelationshipSyncHelper.PartnerHasOnlyNonOrgUnitOfficeLinksAsync(_context, partner.Id))
            return default;

        // Now you can use the Partner entity's methods to get interaction data
        // Examples:
        // var allInteractions = partner.GetAllInteractions();
        // var recentInteractions = partner.GetRecentInteractions(5);
        // var interactionsByContact = partner.GetInteractionsByContact();
        // var summary = partner.GetSummary();

        return mapper.Map<PartnerModel>(partner);
    }

    public async Task<PaginationResponse<PartnerModel>> GetPartnersByPartnerGroup(int userId, int partnerTreeId, PaginationRequest request)
    {
        var query = PartnerRepository
            .GetAll()
            .Where(x => !x.IsDeleted && x.PartnerGroupId == partnerTreeId)
            .AsQueryable();

        var entities = await query.ToListAsync();

        // Get total count
        var totalCount = entities.Count;
        
        // Apply pagination
        var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
        var excludedRows = (pageIndex - 1) * request.PageSize;
        
        if (request.OrderBy != null)
        {
            entities = entities.AsQueryable().OrderByColumnName(request.OrderBy, request.Ascending ?? true).ToList();
        }
        
        // Get the entities for this page
        var pagedEntities = entities
            .Skip(excludedRows)
            .Take(request.PageSize)
            .ToList();
        
        // Map entities
        var mappedEntities = pagedEntities.Select(x => mapper.Map<PartnerModel>(x)).ToList();
        await EnrichPartnerModelsOrganizationUnitsAsync(mappedEntities);

        return new PaginationResponse<PartnerModel>
        {
            TotalCount = totalCount,
            Records = mappedEntities
        };
    }

    public async Task<PaginationResponse<PartnerModel>> GetPartnersByPartnerCategory(int userId, string partnerCategoryCode, PaginationRequest request)
    {
        var query = PartnerRepository
            .GetAll()
            .Where(x => !x.IsDeleted && x.PartnerGroup != null && x.PartnerGroup.PartnerCategoryCode == partnerCategoryCode)
            .AsQueryable();

        var entities = await query.ToListAsync();

        // Get total count
        var totalCount = entities.Count;
        
        // Apply pagination
        var pageIndex = request.PageIndex < 1 ? 1 : request.PageIndex;
        var excludedRows = (pageIndex - 1) * request.PageSize;
        
        if (request.OrderBy != null)
        {
            entities = entities.AsQueryable().OrderByColumnName(request.OrderBy, request.Ascending ?? true).ToList();
        }
        
        // Get the entities for this page
        var pagedEntities = entities
            .Skip(excludedRows)
            .Take(request.PageSize)
            .ToList();
        
        // Map entities
        var mappedEntities = pagedEntities.Select(x => mapper.Map<PartnerModel>(x)).ToList();
        await EnrichPartnerModelsOrganizationUnitsAsync(mappedEntities);

        return new PaginationResponse<PartnerModel>
        {
            TotalCount = totalCount,
            Records = mappedEntities
        };
    }

    public async Task<PaginationResponse<PartnerModel>> GetPartnersByPartnerGroupAsync(ClaimsPrincipal user, int partnerGroupId, PaginationRequest request)
    {
        return await GetPartnersByPartnerGroup(0, partnerGroupId, request);
    }

    public async Task<string?> UpdatePartnerLogoAsync(int partnerId, IFormFile file)
    {
        var entity = await PartnerRepository.GetByIdAsync(partnerId);
        if (entity == null)
        {
            return null;
        }

        // Save the file to a location and get its URL
        var fileExtension = Path.GetExtension(file.FileName);
        var fileName = $"partner-{partnerId}-logo-{DateTime.UtcNow.Ticks}{fileExtension}";
        var filePath = Path.Combine("wwwroot", "uploads", "partners", fileName);
        
        // Ensure directory exists
        var directory = Path.GetDirectoryName(filePath);
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        // Save the file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Update the entity with the logo URL (relative path)
        entity.LogoUrl = $"/uploads/partners/{fileName}";
        await PartnerRepository.UpdateAsync(entity);

        // Return the URL
        return entity.LogoUrl;
    }
    
    /// <summary>
    /// Checks if the user has permission to perform the specified operation on the partner
    /// </summary>
    public async Task<bool> HasPermissionAsync(int userId, int partnerId, string operation)
    {
        // Get the partner entity
        var entity = await PartnerRepository.GetByIdAsync(partnerId);
        if (entity == null)
        {
            return false;
        }
        
        // Basic permission rules:
        // 1. Administrator can do anything
        // 2. Creator of the partner can do anything with their own partners
        // 3. For Read operations, any Internal or Partner role can access
        // 4. For Update/Delete, only creator or admin can perform
        
        // Check if user is the creator
        bool isCreator = entity.CreatedBy == userId;
        
        // If user is creator, they have full access
        if (isCreator)
        {
            return true;
        }
        
        // For Read operations, allow access to all users with Partner role or higher
        if (operation == "Read")
        {
            // This simplified check just allows reading for almost all users
            // In a real implementation, you'd check against user roles in a database
            return true;
        }
        
        // For other operations (Update, Delete), only allow if user is creator or has admin privileges
        // This simplified version just denies access to non-creators
        // In a real implementation, you'd check if the user has Administrator role
        return false;
    }
    
    /// <summary>
    /// Checks if the user has permission to perform the specified operation on the partner
    /// </summary>
    public async Task<bool> HasPermissionAsync(ClaimsPrincipal user, int partnerId, string operation)
    {
        // Get user ID from claims
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return false;
        }
        
        // Use the existing method
        return await HasPermissionAsync(userId, partnerId, operation);
    }
    
    /// <summary>
    /// Checks if the user has permission to perform the specified operation on the partner
    /// </summary>
    public async Task<bool> HasPermissionAsync(ClaimsPrincipal user, Partner partner, string operation)
    {
        // Get user ID from claims
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return false;
        }
        
        // Check if user is the creator
        bool isCreator = partner.CreatedBy == userId;
        
        // If user is creator, they have full access
        if (isCreator)
        {
            return true;
        }
        
        // Check if user is administrator
        bool isAdmin = user.IsInRole("Administrator");
        if (isAdmin)
        {
            return true;
        }
        
        // For Read operations, allow access to all users with Partner role or higher
        if (operation == "Read")
        {
            return user.IsInRole("Partner") || user.IsInRole("Internal");
        }
        
        // For other operations (Update, Delete), only allow if user is creator or has admin privileges
        return false;
    }

    public List<PartnerTree> GetChildPartnerTreesRecursively(List<string> parentCodes)
    {
        if (parentCodes == null || !parentCodes.Any())
            return new List<PartnerTree>();

        // Get immediate children
        var children = PartnerTreeRepository.GetAll()
            .Where(pt => pt.Parent != null && parentCodes.Contains(pt.Parent))
            .ToList();

        if (!children.Any())
            return new List<PartnerTree>();

        // Get child codes
        var childCodes = children.Select(c => c.Code).ToList();

        // Recursively get descendants
        var descendants = GetChildPartnerTreesRecursively(childCodes);

        // Combine immediate children with their descendants
        return children.Union(descendants).ToList();
    }
    
    public List<PartnerTree> GetAllDescendantPartnerTrees(List<string> partnerTreesByCategoryCodes)
    {
        // Get the original PartnerTrees by their codes
        var originalPartnerTrees = PartnerTreeRepository.GetAll()
            .Where(pt => partnerTreesByCategoryCodes.Contains(pt.Code))
            .ToList();
            
        // Get all descendants recursively
        var descendants = GetChildPartnerTreesRecursively(partnerTreesByCategoryCodes);
        
        // Return all trees including the original ones and their descendants
        return originalPartnerTrees.Union(descendants).ToList();
    }

    #region Secure Methods for Permission-based Access
    
    /// <summary>
    /// Gets partners with row-level security applied based on user permissions
    /// Note: This implementation provides basic functionality without advanced security filtering
    /// </summary>
    public async Task<PaginationResponse<PartnerModel>> GetPartnersAsync(ClaimsPrincipal user, PaginationRequest request)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Gets a specific partner with row-level security applied
    /// Note: This implementation provides basic functionality without advanced security filtering
    /// </summary>
    public async Task<PartnerModel?> GetPartnerAsync(ClaimsPrincipal user, int id)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Creates a new partner with permission validation
    /// Note: This implementation provides basic functionality without advanced security validation
    /// </summary>
    public async Task<PartnerModel?> CreatePartnerAsync(ClaimsPrincipal user, PartnerRequest model)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Updates a partner with permission validation
    /// Note: This implementation provides basic functionality without advanced security validation
    /// </summary>
    public async Task<PartnerModel?> UpdatePartnerAsync(ClaimsPrincipal user, UpdatePartnerRequest model)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    /// <summary>
    /// Deletes a partner with permission validation
    /// Note: This implementation provides basic functionality without advanced security validation
    /// </summary>
    public async Task<bool> DeletePartnerAsync(ClaimsPrincipal user, int id)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    /// <summary>
    /// Gets partners by partner group with security applied
    /// Note: This implementation provides basic functionality without advanced security filtering
    /// </summary>
    public async Task<PaginationResponse<PartnerModel>> GetPartnersByPartnerGroupAsync(ClaimsPrincipal user, string partnerGroupCode, PaginationRequest request)
    {
        throw new NotImplementedException();
    }

    /// <summary>
    /// Gets partners by partner category with security applied
    /// Note: This implementation provides basic functionality without advanced security filtering
    /// </summary>
    public async Task<PaginationResponse<PartnerModel>> GetPartnersByCategoryAsync(ClaimsPrincipal user, string partnerCategoryCode, PaginationRequest request)
    {
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    public async Task<List<PartnerModel?>> GetPartnersForGmailAddon(GmailRelatedRecordsRequest input, ClaimsPrincipal user = null)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Use UNOPSInteractionManager for UNOPS-specific implementation");
    }

    #endregion
    
    /// <summary>
    /// Applies org unit filtering if the specification supports it using manual joins
    /// </summary>
    private IQueryable<Partner> ApplyOrgUnitFilterIfSupported(IQueryable<Partner> query, ISpecification<Partner> specification)
    {
        // Check if specification has ApplyOrgUnitFilter method and call it
        var specType = specification.GetType();
        var filterMethod = specType.GetMethod("ApplyOrgUnitFilter");
        
        if (filterMethod != null)
        {
            try
            {
                // Call the ApplyOrgUnitFilter method if it exists
                var result = filterMethod.Invoke(specification, new object[] { query, _context });
                if (result is IQueryable<Partner> filteredQuery)
                {
                    return filteredQuery;
                }
            }
            catch (Exception ex)
            {
                // Log error but continue without org unit filtering
                Console.WriteLine($"Error applying org unit filter: {ex.Message}");
            }
        }
        
        return query;
    }

    // Partner Status Management Methods
    public async Task<PartnerModel?> ActivatePartnerAsync(ClaimsPrincipal user, int id, ActivatePartnerRequest request)
    {
        await Task.CompletedTask;
        // This implementation doesn't support activation since it works with Partner entities (not UNOPSPartner)
        // Status workflows are managed by UNOPSPartnerManager
        throw new NotSupportedException("Partner activation is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation.");
    }

    public async Task<PartnerModel?> ClosePartnerAsync(ClaimsPrincipal user, int id, StatusChangeRequest request)
    {
        await Task.CompletedTask;
        // This implementation doesn't support closing since it works with Partner entities (not UNOPSPartner)
        // Status workflows are managed by UNOPSPartnerManager
        throw new NotSupportedException("Partner closing is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation.");
    }

    public async Task<PartnerModel?> ArchivePartnerAsync(ClaimsPrincipal user, int id, StatusChangeRequest request)
    {
        await Task.CompletedTask;
        // This implementation doesn't support archiving since it works with Partner entities (not UNOPSPartner)
        // Status workflows are managed by UNOPSPartnerManager
        throw new NotSupportedException("Partner archiving is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation.");
    }

    public async Task<PartnerModel?> ApprovePartnerAsync(ClaimsPrincipal user, int id, UpdatePartnerRequest request)
    {
        await Task.CompletedTask;
        // This implementation doesn't support approval since it works with Partner entities (not UNOPSPartner)
        // Status workflows are managed by UNOPSPartnerManager
        throw new NotSupportedException("Partner approval is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation.");
    }

    public async Task<PartnerModel?> UnapprovePartnerAsync(ClaimsPrincipal user, int id, StatusChangeRequest request)
    {
        // This implementation doesn't support archiving since it works with Partner entities (not UNOPSPartner)
        // Status workflows are managed by UNOPSPartnerManager
        throw new NotSupportedException("Partner unapproval is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation.");
    }

    public virtual async Task<PartnerModel?> GetPartnerByNameAsync(ClaimsPrincipal user, string name)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Use UNOPSPartnerManager for UNOPS-specific implementation");
    }

    /// <summary>
    /// Performs comprehensive smart search across Partners and all related entities.
    /// This base implementation redirects to UNOPSPartnerManager for full functionality.
    /// </summary>
    /// <param name="user">The user performing the search (for RBAC)</param>
    /// <param name="searchText">Text to search across all partner and related entity fields</param>
    /// <param name="includeInactive">Whether to include inactive/deleted partners (default: false)</param>
    /// <param name="maxResults">Maximum number of results to return (default: 50)</param>
    /// <param name="request">Pagination request for final result formatting</param>
    /// <returns>Paginated response with ranked search results and metadata</returns>
    public async Task<PaginationResponse<PartnerModel>> PerformSmartSearchAsync(
        ClaimsPrincipal user,
        string searchText,
        bool includeInactive = false,
        int maxResults = 50,
        PaginationRequest? request = null)
    {
        await Task.CompletedTask;
        // This base implementation doesn't support advanced smart search
        // Smart search with related entities and intelligent ranking is managed by UNOPSPartnerManager
        throw new NotSupportedException("Smart search is managed by UNOPSPartnerManager. Use the UNOPS-specific implementation for comprehensive search across all related entities.");
    }

    public virtual async Task<int> GetTotalPartnerCountAsync(ClaimsPrincipal user)
    {
        throw new NotImplementedException("Use UNOPSPartnerManager for debug functionality");
    }

    public virtual async Task<List<string>> GetSamplePartnerNamesAsync(ClaimsPrincipal user, int count = 5)
    {
        await Task.CompletedTask;
        throw new NotImplementedException("Use UNOPSPartnerManager for debug functionality");
    }

    public virtual async Task<PaginationResponse<PartnerModel>> NewAdvancedSearchPartnersAsync(ClaimsPrincipal user, string searchCriteria, PaginationRequest request)
    {
        await Task.CompletedTask;
        throw new NotSupportedException("NEW Advanced search functionality is only available in UNOPS implementation. Use UNOPSPartnerManager instead.");
    }

    // GetPartnerSearchFields removed - now handled directly in PartnerController for dynamic translation support
}