/**
  * TimeVisualizationSection.jsx
  * Created by Kevin Li 12/13/16
  **/

import React from 'react';
import PropTypes from 'prop-types';
import { throttle, capitalize } from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TooltipWrapper } from 'data-transparency-ui';
import { fullMonthFromAbbr } from 'helpers/monthHelper';
import { isIe } from 'helpers/browser';
import TimeVisualization from './TimeVisualization';
import TimeVisualizationPeriodButton from './TimeVisualizationPeriodButton';

const propTypes = {
    data: PropTypes.object,
    updateVisualizationPeriod: PropTypes.func,
    visualizationPeriod: PropTypes.string
};

const downloadTooltip = (
    <div className="tooltip__text">
        Download a CSV of award spending that matches your search criteria, broken down by the selected time unit as shown in the chart(i.e., “Years,” “Quarters,” or “Months”). Note that only the first 10,000 results will be returned. For complete download results, click on the “Download” button in the top right of this page.
    </div>
);

export default class TimeVisualizationSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            windowWidth: 0,
            visualizationWidth: 0
        };

        this.handleWindowResize = throttle(this.handleWindowResize.bind(this), 50);
    }

    componentDidMount() {
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    getDownloadData = () => {
        const data = this.props.data;
        const ret = [];
        if (data.visualizationPeriod === 'fiscal_year') {
            ret[0] = ['fiscal_year', 'total_obligations'];
        }
        else if (data.visualizationPeriod === 'quarter') {
            ret[0] = ['fiscal_year', 'fiscal_quarter', 'total_obligations'];
        }
        else {
            ret[0] = ['fiscal_year', 'month', 'total_obligations'];
        }

        data.rawLabels.map((label, i) => {
            if (data.visualizationPeriod === 'fiscal_year') {
                ret[i + 1] = [label.year, data.ySeries[i][0]];
            }
            else if (data.visualizationPeriod === 'quarter') {
                ret[i + 1] = [label.year, label.period[1], data.ySeries[i][0]];
            }
            else {
                const month = label.period;
                ret[i + 1] = [label.year, fullMonthFromAbbr(month), data.ySeries[i][0]];
                if (['Oct', 'Nov', 'Dec'].indexOf(month) > -1) { // correct the FY
                    ret[i + 1][0] = parseInt(ret[i + 1][0], 10) + 1;
                }
            }
            return null; // required by linter
        });
        return ret;
    };

    handleWindowResize() {
        // determine if the width changed
        const windowWidth = window.innerWidth;
        if (this.state.windowWidth !== windowWidth) {
            // width changed, update the visualization width
            this.setState({
                windowWidth,
                visualizationWidth: this.sectionHr.offsetWidth
            });
        }
    }

    downloadCsv = () => {
        const contents = this.getDownloadData().map((row) => row.join(',')).join('\n');
        // eslint-disable-next-line no-undef
        const file = new Blob([contents], { type: 'text/csv;charset=utf-8;' });
        if (isIe()) {
            window.navigator.msSaveOrOpenBlob(file, 'spending-over-time.csv');
        }
        else {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(file);
            a.download = 'spending-over-time.csv';
            a.click();
        }
    };

    render() {
        return (
            <section
                className="results-visualization-time-section"
                id="results-section-time"
                aria-label="Spending Over Time">
                <h2 className="visualization-title">
                    Spending Over Time
                </h2>
                <hr
                    className="results-divider"
                    ref={(hr) => {
                        this.sectionHr = hr;
                    }} />

                <div className="visualization-top">
                    <div className="visualization-description">
                        <div className="content">
                            Spot trends in spending over your chosen time period. Break down your results by years, quarters, or months, and hover over the bars for more detailed information.
                        </div>
                    </div>
                    <div className="visualization-period">
                        <div className="content">
                            <ul>
                                <li>
                                    <TimeVisualizationPeriodButton
                                        value="fiscal_year"
                                        label="Years"
                                        active={this.props.data.visualizationPeriod === 'fiscal_year'}
                                        changePeriod={this.props.updateVisualizationPeriod} />
                                </li>
                                <li>
                                    <TimeVisualizationPeriodButton
                                        value="quarter"
                                        label="Quarters"
                                        active={this.props.data.visualizationPeriod === 'quarter'}
                                        changePeriod={this.props.updateVisualizationPeriod} />
                                </li>
                                <li>
                                    <TimeVisualizationPeriodButton
                                        value="month"
                                        label="Months"
                                        active={this.props.data.visualizationPeriod === 'month'}
                                        changePeriod={this.props.updateVisualizationPeriod} />
                                </li>
                            </ul>
                        </div>
                        <div className="download">
                            <button onClick={this.downloadCsv}>
                                <FontAwesomeIcon icon="download" size="lg" />
                                <span className="text">
                                    {`Download data by ${this.props.data.visualizationPeriod === 'fiscal_year' ? 'Year' : capitalize(this.props.data.visualizationPeriod)}`}
                                </span>
                            </button>
                            <TooltipWrapper className="tooltip-wrapper" icon="info" tooltipPosition="left" tooltipComponent={downloadTooltip} />
                        </div>
                    </div>
                </div>
                <TimeVisualization
                    {...this.props.data}
                    width={this.state.visualizationWidth} />
            </section>
        );
    }
}

TimeVisualizationSection.propTypes = propTypes;
