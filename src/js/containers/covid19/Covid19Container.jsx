/**
 * Covid19Container.jsx
 * Created by Jonathan Hill 06/02/20
 */

import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GlobalConstants from 'GlobalConstants';
import { useQueryParams } from 'helpers/queryParams';
import BaseOverview from 'models/v2/covid19/BaseOverview';
import { fetchOverview, fetchAwardAmounts } from 'apis/disaster';
import { useDefCodes } from 'containers/covid19/WithDefCodes';
import { setOverview, setTotals, setDefcParams } from 'redux/actions/covid19/covid19Actions';
import { defcByPublicLaw } from 'dataMapping/covid19/covid19';
import Covid19Page from 'components/covid19/Covid19Page';

require('pages/covid19/index.scss');

const Covid19Container = () => {
    const [, areDefCodesLoading, defCodes] = useDefCodes();
    const overviewRequest = useRef(null);
    const awardAmountRequest = useRef(null);
    const dispatch = useDispatch();
    const history = useHistory();
    let { publicLaw } = useQueryParams();
    publicLaw = publicLaw && publicLaw.toLowerCase();

    useEffect(() => {
        /** Default to all DEFC if:
         * 1) no public law param is defined
         * 2) the public law param is invalid
         * 3) the public law param is for ARP, but the ARP filter is not yet released
         */

        if (!publicLaw ||
            !(publicLaw === 'all' || (publicLaw in defcByPublicLaw)) ||
            (publicLaw === 'american-rescue-plan' && !GlobalConstants.ARP_RELEASED)) {
            history.replace({
                pathname: '',
                search: '?publicLaw=all'
            });
        }
        else if (!areDefCodesLoading) {
            // set DEFC params based on the currently selected public law
            if (publicLaw === 'all') {
                // use all Covid 19 DEFC
                dispatch(setDefcParams(defCodes.map((code) => code.code)));
            }
            else {
                // use our hard-coded mapping
                dispatch(setDefcParams(defcByPublicLaw[publicLaw]));
            }
        }
    }, [publicLaw, areDefCodesLoading]);

    useEffect(() => {
        const getOverviewData = async () => {
            overviewRequest.current = fetchOverview(defCodes.filter((c) => c.disaster === 'covid_19').map((code) => code.code));
            try {
                const { data } = await overviewRequest.current.promise;
                const newOverview = Object.create(BaseOverview);
                newOverview.populate(data);
                dispatch(setOverview(newOverview));
            }
            catch (e) {
                console.log(' Error Overview : ', e.message);
            }
        };
        const getAllAwardTypesAmount = async () => {
            const params = {
                filter: {
                    def_codes: defCodes.filter((c) => c.disaster === 'covid_19').map((code) => code.code)
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
                console.log(' Error Amounts : ', e.message);
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

    return (
        <Covid19Page areDefCodesLoading={areDefCodesLoading} />
    );
};

export default Covid19Container;
