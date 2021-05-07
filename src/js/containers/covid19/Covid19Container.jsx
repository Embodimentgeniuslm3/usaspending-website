/**
 * Covid19Container.jsx
 * Created by Jonathan Hill 06/02/20
 */

import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GlobalConstants from 'GlobalConstants';
import { getQueryParamString, useQueryParams } from 'helpers/queryParams';
import BaseOverview from 'models/v2/covid19/BaseOverview';
import { fetchOverview, fetchAwardAmounts } from 'apis/disaster';
import { useDefCodes } from 'containers/covid19/WithDefCodes';
import { setOverview, setTotals } from 'redux/actions/covid19/covid19Actions';
import { defcByPublicLaw } from 'dataMapping/covid19/covid19';
import Covid19Page from 'components/covid19/Covid19Page';

require('pages/covid19/index.scss');

const Covid19Container = () => {
    const [, areDefCodesLoading, defCodes] = useDefCodes();
    const overviewRequest = useRef(null);
    const awardAmountRequest = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const query = useQueryParams();
    const { publicLaw } = query;
    let pageDefCodes = [];

    useEffect(() => {
        /** Default to all DEFC if:
         * 1) no public law param is defined
         * 2) the public law param is invalid
         * 3) the public law param is for ARP, but the ARP filter is not yet released
         */

        if (!publicLaw ||
            !(publicLaw === 'all' || (publicLaw in defcByPublicLaw)) ||
            (publicLaw === 'american-rescue-plan' && !GlobalConstants.ARP_RELEASED)) {
            const newParams = getQueryParamString({ ...query, publicLaw: 'all' });
            history.replace({
                pathname: '',
                search: newParams
            });
        }
    }, [publicLaw]);

    useEffect(() => {
        pageDefCodes = (publicLaw in defcByPublicLaw && GlobalConstants.ARP_RELEASED) ?
            defcByPublicLaw[publicLaw] :
            defCodes.filter((c) => c.disaster === 'covid_19').map((code) => code.code);

        const getOverviewData = async () => {
            overviewRequest.current = fetchOverview(pageDefCodes);
            try {
                const { data } = await overviewRequest.current.promise;
                const newOverview = Object.create(BaseOverview);
                newOverview.populate(data);
                dispatch(setOverview(newOverview));
            }
            catch (e) {
                console.error(' Error getting COVID overview data from API : ', e.message);
            }
        };

        const getAllAwardTypesAmount = async () => {
            const params = {
                filter: {
                    def_codes: pageDefCodes
                }
            };
            awardAmountRequest.current = fetchAwardAmounts(params);
            try {
                const { data } = await awardAmountRequest.current.promise;
                // set totals in redux, we can use totals elsewhere to calculate unlinked data
                const totals = {
                    obligation: data.obligation,
                    outlay: data.outlay,
                    awardCount: data.award_count,
                    faceValueOfLoan: data.face_value_of_loan
                };
                dispatch(setTotals('', totals));
            }
            catch (e) {
                console.error(' Error getting COVID amounts data from API : ', e.message);
            }
        };
        if (defCodes.length) {
            getOverviewData();
            getAllAwardTypesAmount();
            overviewRequest.current = null;
            awardAmountRequest.current = null;
        }
        return () => {
            if (overviewRequest.current) {
                overviewRequest.cancel();
            }
            if (awardAmountRequest.current) {
                awardAmountRequest.cancel();
            }
        };
    }, [defCodes, dispatch]);

    return <Covid19Page areDefCodesLoading={areDefCodesLoading} />;
};

export default Covid19Container;
