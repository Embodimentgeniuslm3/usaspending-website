/**
 * KeywordContainer-test.jsx
 * Created by Emily Gullo 03/13/2017
 */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { KeywordContainer } from 'containers/search/filters/KeywordContainer';
import { OrderedMap } from 'immutable';

const initialFilters = {
    keyword: new OrderedMap(),
    appliedFilter: new OrderedMap()
};

const keyword = 'testing';

describe('KeywordContainer', () => {
    describe('submitText', () => {
        it('should add a keyword that has been selected to Redux', () => {
            const mockReduxAction = jest.fn((args) => {
                expect(args).toEqual("testing");
            });

            // Set up container with mocked action
            const keywordContainer = shallow(
                <KeywordContainer
                    {...initialFilters}
                    updateTextSearchInput={mockReduxAction} />);

            const toggleKeywordSpy = sinon.spy(keywordContainer.instance(),
                'toggleKeyword');

            // Add Keyword to redux
            keywordContainer.instance().toggleKeyword(keyword);

            // Everything should be updated now
            expect(toggleKeywordSpy.callCount).toEqual(1);
            expect(mockReduxAction).toHaveBeenCalled();

            // Reset the spy
            toggleKeywordSpy.reset();
        });
    });
    describe('dirtyFilter', () => {
        it('should return a symbol when the staged filters do not match with the applied filters', () => {
            const container = shallow(
                <KeywordContainer
                    {...initialFilters}
                    updateTextSearchInput={jest.fn()} />);

            container.setProps({
                keyword: new OrderedMap({ blerg: "blerg" })
            });

            const changed = container.instance().dirtyFilter();
            expect(typeof changed).toEqual('symbol');
        });
        it('should return null when the staged filters match with the applied filters', () => {
            const container = shallow(
                <KeywordContainer
                    {...initialFilters}
                    updateTextSearchInput={jest.fn()} />);

            const changed = container.instance().dirtyFilter();
            expect(changed).toBeFalsy();
        });
    });
});
