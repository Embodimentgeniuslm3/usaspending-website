/**
 * SpendingByCFDA.jsx
 * Created by Lizzie Salita 6/22/20
 */

import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { financialAssistanceTabs } from 'dataMapping/covid19/covid19';
import { awardTypeGroups } from 'dataMapping/search/awardType';
import { fetchCfdaCount } from 'apis/disaster';
import { areCountsDefined } from 'helpers/covid19Helper';
import { Tabs } from "data-transparency-ui";
import SummaryInsightsContainer from 'containers/covid19/SummaryInsightsContainer';
import SpendingByCFDAContainer from 'containers/covid19/assistanceListing/SpendingByCFDAContainer';
import GlossaryLink from 'components/sharedComponents/GlossaryLink';
import { scrollIntoView } from 'containers/covid19/helpers/scrollHelper';
import Analytics from 'helpers/analytics/Analytics';
import Note, { dodNote } from 'components/sharedComponents/Note';
import DateNote from '../DateNote';

const overviewData = [
    {
        type: 'resultsCount',
        title: 'CFDA Programs'
    },
    {
        type: 'awardObligations',
        title: 'Award Obligations',
        isMonetary: true
    },
    {
        type: 'awardOutlays',
        title: 'Award Outlays',
        isMonetary: true
    },
    {
        type: 'numberOfAwards',
        title: 'Number of Awards'
    }
];

const initialState = {
    all: null,
    grants: null,
    direct_payments: null,
    loans: null,
    other: null
};

const SpendingByCFDA = () => {
    const { defcParams } = useSelector((state) => state.covid19);
    const moreOptionsTabsRef = useRef(null);

    const [activeTab, setActiveTab] = useState(financialAssistanceTabs[0].internal);
    const [inFlight, setInFlight] = useState(true);
    const [tabCounts, setTabCounts] = useState(initialState);
    const [tabs, setTabs] = useState(financialAssistanceTabs);

    const changeActiveTab = (tab) => {
        const selectedTab = financialAssistanceTabs.find((item) => item.internal === tab).internal;
        setActiveTab(selectedTab);
        Analytics.event({ category: 'COVID-19 - Award Spending by CFDA', action: `${activeTab} - click` });
    };

    // Keep track of previous tab to prevent duplicate requests in summary
    const prevTabRef = useRef();
    useEffect(() => {
        prevTabRef.current = activeTab;
    });
    const prevTab = prevTabRef.current;

    useEffect(() => {
        if (defcParams && defcParams.length > 0) {
            // Make an API request for the count of CFDA for each award type
            // Post-MVP this should be updated to use a new endpoint that returns all the counts
            setTabCounts(initialState);
            const promises = financialAssistanceTabs.map((awardType) => {
                const params = {
                    filter: {
                        def_codes: defcParams
                    }
                };
                if (awardType.internal !== 'all') {
                    // Endpoint defaults to all financial assistance types if award_type_codes is not provided
                    params.filter.award_type_codes = awardTypeGroups[awardType.internal];
                }
                return fetchCfdaCount(params).promise;
            });
            // Wait for all the requests to complete and then store the results in state
            Promise.all(promises)
                .then(([allRes, grantsRes, loansRes, directPaymentsRes, otherRes]) => {
                    setTabCounts({
                        all: allRes.data.count,
                        grants: grantsRes.data.count,
                        direct_payments: directPaymentsRes.data.count,
                        loans: loansRes.data.count,
                        other: otherRes.data.count
                    });
                });
        }
    }, [defcParams]);

    const scrollIntoViewTable = (loading, error, errorOrLoadingRef, tableWrapperRef, margin, scrollOptions) => {
        scrollIntoView(loading, error, errorOrLoadingRef, tableWrapperRef, margin, scrollOptions, moreOptionsTabsRef);
    };

    useEffect(() => {
        const countState = areCountsDefined(tabCounts);
        if (!countState) {
            setInFlight(true);
        }
        else if (countState) {
            setInFlight(false);
        }
    }, [tabCounts, setInFlight]);

    useEffect(() => {
        setTabs(tabs.map((tab) => ({ ...tab, count: tabCounts[tab.internal] })));
    }, [tabCounts]);

    return (
        <div className="body__content assistance-listing">
            <DateNote />
            <h3 className="body__narrative">
                <strong>Which CFDA Programs (Assistance Listings)</strong> supported the response to COVID-19?
            </h3>
            <div className="body__narrative-description">
                <p>
                    <span className="glossary-term">Catalog of Federal Domestic Assistance (CFDA) Programs</span> <GlossaryLink term="cfda-program" />, also known as Assistance Listings, are programs, like Supplemental Nutrition Assistance Program (SNAP) that provide financial assistance to individuals, organizations, businesses, or state, local, or tribal governments. All financial assistance awards must be associated with a CFDA Program, all of which must be explicitly authorized by law.
                </p>
                <p>
                    In this section, you will see awards that CFDA Programs have funded in response to COVID-19. Financial assistance awards represent the vast majority of COVID-19 appropriated spending.
                </p>
            </div>
            <div ref={moreOptionsTabsRef}>
                <Tabs active={activeTab} types={tabs} switchTab={changeActiveTab} />
            </div>
            <SummaryInsightsContainer
                // pass CFDA count to the summary section so we don't have to make the same API request again
                resultsCount={tabCounts[activeTab]}
                activeTab={activeTab}
                prevTab={prevTab}
                areCountsLoading={inFlight}
                overviewData={overviewData}
                assistanceOnly />
            <SpendingByCFDAContainer
                activeTab={activeTab}
                scrollIntoView={scrollIntoViewTable} />
            <Note message={dodNote} />
        </div>
    );
};

export default SpendingByCFDA;
