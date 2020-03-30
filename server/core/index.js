const modules = {
    user: require('../modules/user'),
    bet: require('../modules/bet'),
    account: require('../modules/account')
};

const log = require('../logger').log;
var trace = 0;
const getTraceID = () => {
    trace++;
    if (trace > 99999999999999999) {
        trace = 0;
    }
    // Internal method communication id
    return 'IMC' + trace;
};
const core = {
    call: async function (...params) {
        // in params we have one or more paramaters
        // the first paramater is aways the method
        // the secod and above are the paramters that you want to call the function
        var traceId = getTraceID();
        var method = params && params[0];
        try {
            log({
                io: 'request',
                traceId: traceId,
                params: params
            });
            let module = method.split('.')[0];
            // The first string before the dot is the module name
            let func = Array.prototype.slice.call(method.split('.'), 1).join('.');
            // Remove the first string before the dot, because it is suposed to be the module name
            // Everyting else after the first dot is the name
            params = Array.prototype.slice.call(params, 1);
            if (!modules[module] && modules[module][func]) {
                throw new Error('method_not_found');
            } else {
                return modules[module][func].apply(undefined, params)
                .then((r) => {
                    log({
                        io: 'response',
                        traceId: traceId,
                        method: method,
                        params: r
                    });
                    return Promise.resolve(r);
                })
                .catch((e) => {
                    log({
                        io: 'error',
                        traceId: traceId,
                        method: method,
                        error: {
                            code: e.code,
                            message: e.message,
                            stack: e.stack
                        }
                    });
                    return Promise.reject(e);
                });
            }
        } catch(e) {
            // the log function does not log type TypeError
            log({
                io: 'error',
                traceId: traceId,
                method: method,
                error: {
                    code: e.code,
                    message: e.message,
                    stack: e.stack
                }
            });
            throw e;
        }
    }
};
modules.user.init(core);
modules.bet.init(core);
modules.account.init(core);

module.exports = core;
