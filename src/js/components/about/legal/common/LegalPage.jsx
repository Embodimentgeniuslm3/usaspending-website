/**
 * LegalPage.jsx
 * Created by Kevin Li 2/21/18
 */

import React from 'react';
import PropTypes from 'prop-types';

import { aboutPageMetaTags } from 'helpers/metaTagHelper';

import MetaTags from 'components/sharedComponents/metaTags/MetaTags';
import Header from 'components/sharedComponents/header/Header';
import StickyHeader from 'components/sharedComponents/stickyHeader/StickyHeader';
import Footer from 'components/sharedComponents/Footer';

import LegalContent from './LegalContent';

require('pages/about/aboutPage.scss');

const propTypes = {
    activePage: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node
};

const LegalPage = (props) => (
    <div className="usa-da-legal-page">
        <MetaTags {...aboutPageMetaTags} />
        <Header />
        <StickyHeader>
            <div className="sticky-header__title">
                <h1 tabIndex={-1} id="main-focus">
                    Legal
                </h1>
            </div>
        </StickyHeader>
        <main
            id="main-content"
            className="main-content">
            <LegalContent
                activePage={props.activePage}
                title={props.title}>
                {props.children}
            </LegalContent>
        </main>
        <Footer />
    </div>
);

LegalPage.propTypes = propTypes;
export default LegalPage;
