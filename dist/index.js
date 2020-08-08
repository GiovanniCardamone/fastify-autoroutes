"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_plugin_1 = __importDefault(require("fastify-plugin"));
var process_1 = __importDefault(require("process"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var validMethods = [
    'delete',
    'get',
    'head',
    'patch',
    'post',
    'put',
    'options',
    'all',
];
function scan(fastify, baseDir, current) {
    var combined = path_1.default.join(baseDir, current);
    var combinedStat = fs_1.default.statSync(combined);
    if (combinedStat.isDirectory()) {
        for (var _i = 0, _a = fs_1.default.readdirSync(combined); _i < _a.length; _i++) {
            var entry = _a[_i];
            scan(fastify, baseDir, path_1.default.join(current, entry));
        }
    }
    else if (isAcceptableFile(combined, combinedStat)) {
        autoload(fastify, combined, resourcePathOf(current));
    }
}
function isAcceptableFile(file, stat) {
    return (!file.startsWith('.') &&
        !file.startsWith('_') &&
        !file.endsWith('.test.js') &&
        !file.endsWith('.test.ts') &&
        (stat.isFile() || stat.isSymbolicLink()));
}
function resourcePathOf(path) {
    var url = '/' + path.replace('.ts', '').replace('.js', '').replace('index', '');
    return url.endsWith('/') && url.length > 1
        ? url.substring(0, url.length - 1)
        : url.length == 0
            ? '/'
            : url;
}
function autoload(fastify, fullPath, url) {
    var module = loadModule(fullPath);
    if (typeof module !== 'function') {
        throw new Error("module " + fullPath + " must export default function");
    }
    var routes = module(fastify);
    for (var _i = 0, _a = Object.entries(routes); _i < _a.length; _i++) {
        var _b = _a[_i], meth = _b[0], route = _b[1];
        if (validMethods.includes(meth)) {
            var method = meth.toUpperCase();
            console.info('adding', method, url, route);
            fastify.route(__assign({ url: url,
                method: method }, route));
        }
    }
}
function loadModule(path) {
    try {
        return require(path).default;
    }
    catch (error) {
        throw new Error("unable to load module " + path);
    }
}
exports.default = fastify_plugin_1.default(function (fastify, options, next) {
    if (!options.dir) {
        return next(new Error('No autoroutes dir specified'));
    }
    if (typeof options.dir !== 'string') {
        return next(new Error('dir must be a string'));
    }
    var dirPath = path_1.default.join(process_1.default.cwd(), process_1.default.argv[1], '..', options.dir);
    try {
        scan(fastify, dirPath, '');
    }
    catch (error) {
        console.error("[ERROR] fastify-autoload: " + error.message);
        return next(error);
    }
    finally {
        return next();
    }
}, {
    fastify: '>=3.0.0',
    name: 'fastify-autoroutes',
});
//# sourceMappingURL=index.js.map