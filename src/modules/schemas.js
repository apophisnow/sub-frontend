import { createAction, handleActions } from 'redux-actions';
import * as schemaProxies from 'proxies/schema';

// Actions
const ACTION_ROOT = 'schemas';
export const schemasFetching = createAction(`${ACTION_ROOT}/SCHEMAS_FETCHING`);
export const schemasFetched = createAction(`${ACTION_ROOT}/SCHEMAS_FETCHED`);

// Reducer
const INITIAL_STATE = {
    isLoading: false,
    deviceTypes: undefined,
    effects: undefined,
};

export default handleActions(
    {
        [schemasFetching]: state => ({
            ...state,
            isLoading: true,
        }),
        [schemasFetched]: (
            state,
            { payload, payload: { deviceTypes, effects, integrationTypes, displays }, error }
        ) => ({
            ...state,
            isLoading: false,
            effects: error ? {} : effects,
            displays: error ? {} : displays,
            deviceTypes: error ? {} : deviceTypes,
            integrationTypes: error ? {} : integrationTypes,
            error: error ? payload.message : '',
        }),
    },
    INITIAL_STATE
);

export function fetchSchemas() {
    return async dispatch => {
        dispatch(schemasFetching());
        try {
            const response = await schemaProxies.getSchemas();
            if (response.statusText === 'OK') {
                const {
                    devices: deviceTypes,
                    effects,
                    integrations: integrationTypes,
                    displays,
                } = response.data;
                dispatch(schemasFetched({ deviceTypes, effects, integrationTypes, displays }));
            }
        } catch (error) {
            dispatch(schemasFetched(error));
        }
    };
}
