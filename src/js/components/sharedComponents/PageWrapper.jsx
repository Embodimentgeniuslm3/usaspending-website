/**
 * Page.jsx
 * Created by Max Kendall 04/23/2021
*/

import React from 'react';
import PropTypes from 'prop-types';
import { PageHeader } from 'data-transparency-ui';

import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';
import MetaTags from 'components/sharedComponents/metaTags/MetaTags';
import Header from 'containers/shared/HeaderContainer';
import Footer from 'containers/Footer';

const PageWrapper = ({
    pageName,
    classNames,
    metaTagProps = {},
    children,
    ref,
    title,
    overLine,
    toolBarComponents = [],
    filters = {}
}) => (
    <div className={classNames} ref={ref}>
        <MetaTags {...metaTagProps} />
        <Header />
        <PageHeader
            title={title}
            stickyBreakPoint={getStickyBreakPointForSidebar()}
            overLine={overLine}
            toolBar={toolBarComponents} />
        {React.cloneElement(children, {
            className: `usda-page__container${children.props.className ? ` ${children.props.className}` : ''}`
        })}
        <Footer pageName={pageName} filters={filters} />
    </div>
);

PageWrapper.propTypes = {
    pageName: PropTypes.string.isRequired,
    classNames: PropTypes.string,
    metaTagProps: PropTypes.object,
    toolBarComponents: PropTypes.arrayOf(PropTypes.element),
    title: PropTypes.string.isRequired,
    overLine: PropTypes.string,
    children: PropTypes.element,
    ref: PropTypes.object,
    filters: PropTypes.object
};

export default PageWrapper;
