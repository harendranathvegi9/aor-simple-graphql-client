import merge from 'lodash.merge';
import pick from 'lodash.pick';
import getOrCall from '../getOrCall';

export const defaultWatchOptions = {
    fetchPolicy: 'network-only',
    pollInterval: 2000,
};

const knownApolloOptions = [
    'fetchPolicy',
    'metadata',
    'noFetch',
    'notifyOnNetworkStatusChange',
    'pollInterval',
    'query',
    'reducer',
    'returnPartialData',
    'variables',
];

/**
 * Get options for calling ApolloClient.watchQuery.
 * @param apolloWatchOptions {Object} Options supplied by user
 * @param action {Object} Action from admin-on-rest
 */
export default (apolloWatchOptions, { meta: { fetch, resource } }) => {
    const options = [];
    let tmpOptions = getOrCall(apolloWatchOptions, resource, fetch);
    options.push(tmpOptions);

    if (tmpOptions) {
        options.push(tmpOptions);
        tmpOptions = getOrCall(tmpOptions[resource], fetch);

        if (tmpOptions) {
            options.push(tmpOptions);
            tmpOptions = getOrCall(tmpOptions[fetch]);

            if (tmpOptions) {
                options.push(tmpOptions);
            }
        }
    }

    return options.reduce((final, opts) =>
        merge({}, final, pick(opts, knownApolloOptions))
    , defaultWatchOptions);
};
