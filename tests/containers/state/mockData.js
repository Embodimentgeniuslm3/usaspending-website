import BaseStateProfile from 'models/v2/state/BaseStateProfile';
import mockStateApi from '../../models/state/mockStateApi';

export const mockActions = {
    setStateOverview: jest.fn(),
    setStateFiscalYear: jest.fn()
};

const stateProfile = Object.create(BaseStateProfile);
stateProfile.populate({});

export const mockRedux = {
    params: {
        stateId: '1'
    },
    stateProfile: {
        id: '',
        fy: 'latest',
        overview: stateProfile
    }
};

export const mockTimes = {
    fiscal_year: '2017',
    quarter: '4',
    month: 4
};

export const mockYears = {
    results: [
        {
            time_period: {
                fiscal_year: '1979'
            },
            aggregated_amount: 123,
            group: 'fiscal_Year'
        },
        {
            time_period: {
                fiscal_year: '1980'
            },
            aggregated_amount: 234,
            group: 'fiscal_Year'
        }
    ]
};

export const mockQuarters = {
    results: [{
        time_period: {
            fiscal_year: "1979",
            quarter: "1"
        },
        aggregated_amount: "1234"
    },
    {
        time_period: {
            fiscal_year: "1979",
            quarter: "2"
        },
        aggregated_amount: "5555"
    }]
};

export const mockMonths = {
    results: [{
        time_period: {
            fiscal_year: "1979",
            month: "1"
        },
        aggregated_amount: "1234"
    },
    {
        time_period: {
            fiscal_year: "1979",
            month: "2"
        },
        aggregated_amount: "5555"
    }]
};

export const mockStateOverview = {
    results: {
        mockStateApi
    }
};

export const mockStateList = [
    {
        fips: '01',
        code: 'AA',
        name: 'State A',
        amount: 1234.60
    },
    {
        fips: '02',
        code: 'BB',
        name: 'State B',
        amount: 999.12
    }
];
