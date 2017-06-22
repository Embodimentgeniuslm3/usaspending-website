/**
  * SearchHeader.jsx
  * Created by Kevin Li 11/10/16
  **/

import React from 'react';
import * as Icons from 'components/sharedComponents/icons/Icons';

import ComingSoonLabel from 'components/sharedComponents/ComingSoonLabel';
import FormatItem from './FormatItem';
import DownloadButton from './DownloadButton';

const propTypes = {
    isSticky: React.PropTypes.bool,
    showingMobile: React.PropTypes.bool,
    currentSection: React.PropTypes.string,
    toggleMobileFilters: React.PropTypes.func
};

export default class SearchHeader extends React.Component {
    render() {
        let stickyClass = '';
        if (this.props.isSticky) {
            stickyClass = ' sticky';
        }

        let showingMobile = '';
        if (this.props.showingMobile) {
            showingMobile = ' active-mobile';
        }
        return (
            <div
                className={`search-header-wrapper${stickyClass}${showingMobile}`}
                id="search-header-wrapper"
                ref={(div) => {
                    this.headerDiv = div;
                }}>
                <div className="search-header">
                    <div className="search-title">
                        <h1>Search &amp; Download Your Data</h1>
                    </div>
                    <div className="search-options">
                        <ul className="search-formats">
                            <li>
                                <FormatItem
                                    code="time"
                                    currentSection={this.props.currentSection}
                                    label="Time"
                                    accessibleLabel="Organize spending by time periods"
                                    icon={<Icons.Calendar alt="Time" />} />
                            </li>
                            <li>
                                <FormatItem
                                    code="rank"
                                    currentSection={this.props.currentSection}
                                    label="Rank"
                                    accessibleLabel="Rank spending by category"
                                    icon={<Icons.Bar alt="Rank" />} />
                            </li>
                            <li>
                                <FormatItem
                                    code="geo"
                                    currentSection={this.props.currentSection}
                                    label="Map"
                                    accessibleLabel="View spending on a map"
                                    icon={<Icons.MapMarker alt="Map Marker" />} />
                            </li>
                            <li>
                                <FormatItem
                                    code="table"
                                    currentSection={this.props.currentSection}
                                    label="Table"
                                    accessibleLabel="View spending by award in a table"
                                    icon={<Icons.Table alt="Table Icon" />} />
                            </li>
                            <li className="coming-soon">
                                <DownloadButton />
                                <ComingSoonLabel />
                            </li>
                        </ul>
                        <ul className="mobile-options">
                            <li>
                                <button
                                    className="mobile-filter"
                                    onClick={this.props.toggleMobileFilters}>
                                    <div className="mobile-filter-content">
                                        <div className="mobile-filter-icon">
                                            <Icons.Filter alt="Filters" />
                                        </div>
                                        <div className="mobile-filter-label">
                                            Filters
                                        </div>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

SearchHeader.propTypes = propTypes;
