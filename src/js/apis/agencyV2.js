/**
 * agencyV2.js
 * Created by Lizzie Salita 5/26/20
 */

import { apiRequest } from '../helpers/apiRequest';

export const fetchSpendingCount = (agencyId, fy, type) => apiRequest({
    url: `v2/agency/${agencyId}/${type}/count/`,
    params: {
        fiscal_year: parseInt(fy, 10)
    }
});

export const fetchSpendingByCategory = (agencyId, type, params) => apiRequest({
    url: `v2/agency/${agencyId}/${type}/`,
    params
});

export const fetchBudgetaryResources = (agencyId) => apiRequest({
    url: `v2/agency/${agencyId}/budgetary_resources`
});

export const fetchAgencyOverview = (code, fy) => apiRequest({
    url: `v2/agency/${code}/${fy ? `?fiscal_year=${fy}` : ''}`
});

export const fetchObligationsByAwardType = (code, fy) => apiRequest({
    url: `v2/agency/${code}/obligations_by_award_category/${fy ? `?fiscal_year=${fy}` : ''}`
});

export const fetchRecipientDistribution = (code, fy) => apiRequest({
    url: `v2/agency/${code}/recipients/${fy ? `?fiscal_year=${fy}` : ''}`
});

export const fetchSubagencyCount = (code, fy, params) => apiRequest({
    url: `v2/agency/${code}/sub_agency/count/${fy ? `?fiscal_year=${fy}` : ''}${params ? `&award_type_codes=[${params}]` : ''}`
});

export const fetchSubagencySpendingList = (code, fy, type, params) => apiRequest({
    url: `v2/agency/${code}/sub_agency/${fy ? `?fiscal_year=${fy}` : ''}${type ? `&award_type_codes=[${type}]` : ''}`,
    params
});

export const fetchSubagencyNewAwardsCount = (code, fy, params) => apiRequest({
    url: `v2/agency/${code}/awards/new/count/${fy ? `?fiscal_year=${fy}` : ''}${params ? `&award_type_codes=[${params}]` : ''}`
});

export const fetchSubagencySummary = (code, fy, params) => apiRequest({
    url: `v2/agency/${code}/awards/${fy ? `?fiscal_year=${fy}` : ''}${params ? `&award_type_codes=[${params}]` : ''}`
});
