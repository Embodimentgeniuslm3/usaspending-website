/**
 * RecipientSection.jsx
 * Created by Jonathan Hill 06/08/20
 */

import React, { useState } from 'react';
import tabs from 'containers/covid19/helpers/recipient';
import DateNote from 'components/covid19/DateNote';
import { Tabs } from "data-transparency-ui";
import ReadMore from 'components/sharedComponents/ReadMore';
import ExternalLink from 'components/sharedComponents/ExternalLink';
import Analytics from 'helpers/analytics/Analytics';

const RecipientSection = () => {
    const [activeTab, setActiveTab] = useState('recipient_locations');
    const changeActiveTab = (tab) => {
        const tabInternal = tabs.find((item) => item.internal === tab).internal;
        setActiveTab(tabInternal);
        Analytics.event({ category: 'covid-19 - profile', action: `award spending by recipient - ${activeTab}` });
    };
    return (
        <div className="body__content recipient__container">
            <DateNote />
            <h3 className="body__narrative">
                <strong>Who</strong> received funding through COVID-19 awards?
            </h3>
            <div className="body__narrative-description">
                <p>
                    Once the federal government has determined that an individual, organization, business, or state, local, or tribal government will receive an award, the money is obligated (promised) and then outlayed (paid) according to the terms of the contract or financial assistance.<sup>3</sup>
                </p>
                <ReadMore>
                    <p>
                        In the following map, you will see a spending breakdown by state, county, or congressional district of recipients who have received awards funded by COVID-19 appropriations. These recipient locations shown below reflect the location of organizational offices that were used to register for awards, and do not reflect the actual distribution of funds. You can also view recipients in a table by selecting the Recipients tab on the visualization. In the case of recipients who are individual persons and not organizations, data is aggregated by county or state to protect personally identifiable information (PII). Data about the location where the award money is used, known as the &apos;Primary Place of Performance&apos;, is available through the download button at the top of the table.
                    </p>
                    <p className="footnotes">
                        <sup>3</sup> To learn more about eligibility criteria for receiving a financial assistance award or contract, visit <ExternalLink url="https://beta.sam.gov/" />
                    </p>
                </ReadMore>
            </div>
            <div className="recipient__tabs-container count-tabs">
                <Tabs active={activeTab} types={tabs} switchTab={changeActiveTab} />
                <div className="recipient__content">
                    {tabs.find((t) => activeTab === t.internal).component}
                </div>
            </div>
        </div>
    );
};

export default RecipientSection;
