namespace Kaagapay.Api.Models;

public enum ScholarshipStatus
{
    Open,
    Closed,
    Archived
}

public enum ScholarshipType
{
    Government,
    Private,
    Ngo
}

public enum ApplicationStatus
{
    Submitted,
    UnderReview,
    Approved,
    Rejected,
    NeedsInfo
}

public enum DocumentType
{
    Indigency,
    Clearance,
    Grades,
    SchoolId,
    ValidId,
    Others
}

public enum DocumentStatus
{
    Pending,
    Verified,
    Rejected
}
