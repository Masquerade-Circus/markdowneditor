let schemasaurus = require('schemasaurus');
let moment = require('moment');

let Formats = require('../../config/validation_formats');

let Normalizer = function () { };
Normalizer.prototype = {
    "[default]": function (schema, object, ctx) {
        if (object === null || object === undefined) {
            ctx.replace(schema.default);
        }
    },
    "[properties]": function (schema, object, ctx) {
        if (ctx.parent && (object === null || object === undefined)) {
            ctx.replace({});
        }
    },
    "[additionalProperty]": function (schema, object, ctx) {
        ctx.remove();
    },
    "[type]": function (schema, object, ctx) {
        var isTrue, isFalse;
        if (object === null || object === undefined) {
            return;
        }

        switch (schema.type) {
            case 'null':
                ctx.replace(null);
                break;
            case 'string':
                if (schema.format && schema.format === 'number') {
                    ctx.replace(parseFloat(object));
                    break;
                }

                if (schema.format && schema.format === 'ObjectId') {
                    break;
                }

                if (schema.format && schema.format === 'regex') {
                    ctx.replace({ $regex: new RegExp(object.toString(), "gi") });
                    break;
                }

                if (schema.format && schema.format === 'date') {
                    context.replace(moment(object, Formats.dateFormat).toDate());
                    break;
                }

                ctx.replace(object.toString());
                break;
            case 'integer': ctx.replace(parseInt(object, 10)); break;
            case 'number': ctx.replace(parseFloat(object)); break;
            case 'boolean':
                isTrue = object === true || ['true', 'on'].indexOf(object.toString().toLowerCase()) !== -1;
                isFalse = object === false || ['false', 'off'].indexOf(object.toString().toLowerCase()) !== -1;
                ctx.replace(isTrue ? true : (isFalse ? false : !!object));
                break;
            case 'date-time': ctx.replace(moment(object).toDate()); break;
            case 'date-range':
                object = object.toString();
                let d = object.replace(' ', '').split('-'),
                    start = moment(d[0], Formats.dateFormat).toDate(),
                    end = moment(d[1], Formats.dateFormat).toDate();

                let o = {};

                if (Object.prototype.toString.call(start) === "[object Date]" && !isNaN(start.getTime())) {
                    o.$gte = start;
                }

                if (Object.prototype.toString.call(end) === "[object Date]" && !isNaN(end.getTime())) {
                    o.$lte = end;
                }

                ctx.replace(o);
                break;
            case 'array':
                if (!Array.isArray(object)) {
                    ctx.replace([object]);
                }
                break;
            case 'object':
                if (typeof object === 'object' && Object.keys(object).length === 0) {
                    ctx.remove();
                }
                break;
        }
    },
    end: { inline: "return _" }
};

let extend = {
    "[type=number]": { inline: "if ( typeof _ !== 'undefined' && ( typeof _ === 'NaN' || (typeof _ === 'string' && _.length > 0) || (typeof _ !== 'string' && typeof _ !== 'number') || (typeof _ !== 'string' && isNaN(_)) ) ) this.error('number', ctx)" },
    "[required][^properties]": () => { },
    "[required=true]": () => { },
    "[required=false]": () => { },
    "[^required]": () => { },
    "[properties]": () => { },
    "[required]": function (schema, object, context) {
        // If it's a normal json schema object with array of require properties
        if (schema.properties !== undefined) {
            if (Array.isArray(schema.required)) {
                if (typeof object === 'object' && Object.keys(object).length === 0) {
                    return;
                }

                for (let i = 0; i < schema.required.length; i++) {
                    if (
                        object[schema.required[i]] === undefined ||
                        (typeof object[schema.required[i]] === 'object' && Object.keys(object[schema.required[i]]).length === 0) ||
                        (typeof object[schema.required[i]] === 'string' && object[schema.required[i]].trim().length === 0)
                    ) {
                        this.error("required", context, null, context.path.slice().concat(schema.required[i]));
                    }
                }
            }

            return;
        }

        // If its a property with require equals true
        if (object === undefined ||
            (typeof object === 'object' && Object.keys(object).length === 0) ||
            (typeof object === 'string' && object.trim().length === 0)
        ) {
            this.error('required', context);
            context.stop();
        }
    },
    "[type=string]": function (schema, object, context) {
        if (object !== undefined && typeof object !== 'string') {
            this.error('string', context);
        }

        try {
            let d = JSON.parse(object);
            if (typeof d === 'object') {
                this.error('string', context, 'not_json');
            }
        } catch (error) {

        }
    },
    "[type=date-range]": function (schema, object, context) {
        console.log('schema', schema);
        console.log('object', object);
    },
    "[equalsTo]": function (schema, object, context) {
        let options = schema.equalsTo;
        if (typeof options === 'string') {
            options = { field: options };
        }

        if (options.field !== undefined) {
            if (object !== context.parent[options.field]) {
                this.error(`equalsTo.${options.field}`, context, options.message || `equalsTo.${options.field}`);
            }
        }

        if (options.value !== undefined) {
            if (object !== options.value) {
                this.error(`equalsTo.${options.field}`, context, options.message || `equalsTo.${options.value}`);
            }
        }
    },
    "[notEqualsTo]": function (schema, object, context) {
        let options = schema.notEqualsTo;

        if (typeof options === 'string') {
            options = { field: options };
        }

        if (options.field !== undefined) {
            if (object === context.parent[options.field]) {
                this.error(`notEqualsTo.${options.field}`, context, options.message || `notEqualsTo.${options.field}`);
            }
        }

        if (options.value !== undefined) {
            if (object === options.value) {
                this.error(`notEqualsTo.${options.field}`, context, options.message || `notEqualsTo.${options.value}`);
            }
        }
    },
    "[format]": function (schema, object, context) {
        var fmt = this.formats[schema.format];
        if (!fmt) {
            throw new Error(`Unknown format '${schema.format}'. Did you forget to register it?`);
        }

        if (typeof object === 'string' && object.length > 0 && !object.match(fmt.regexp)) {
            this.error(`format.${schema.format}`, context, fmt.message);
        }

        if (schema.format === 'date') {
            context.replace(moment(object, Formats.dateFormat).toDate());
        }
    },
    "ximum": function (op, excl, count, code) {
        // return {inline: "if (_ !== undefined && _ " + op +  (excl ? "=" : "") + count + ") this.error('" + code + (excl ? ".exclusive" : "") + "', ctx, " + count + ")"};
        return { inline: `if (_ !== undefined && _ ${op}${(excl ? "=" : "")}${count} ) this.error('${code}${(excl ? ".exclusive" : "")}', ctx, ${count})` };
    },
    "[type=objectid]": function (schema, object, context) {
        if (object !== undefined) {
            if (typeof object === 'object') {
                object = `${object}`;
            }

            if (typeof object === 'string' && !/^[a-f\d]{24}$/i.test(object)) {
                this.error('objectid', context);
            }
        }

    },
    "[type=boolean]": function (schema, object, context) {
        if (object === undefined) {
            return;
        }
        if (
            object === true ||
            object === 1 ||
            ['true', 'on'].indexOf((object || '').toString().toLowerCase()) !== -1 ||
            object === false ||
            ['false', 'off'].indexOf((object || '').toString().toLowerCase()) !== -1 ||
            object === 0
        ) {
            let isTrue = object === true || object === 1 || ['true', 'on'].indexOf((object || '').toString().toLowerCase()) !== -1;
            let isFalse = object === false || object === 0 || ['false', 'off'].indexOf((object || '').toString().toLowerCase()) !== -1;
            context.replace(isTrue ? true : (isFalse ? false : !!object));
            return;
        }

        this.error('boolean', context);
    },
    "[enum]": function (schema, object, context) {
        if (object === undefined || object.trim().length === 0) {
            return;
        }

        this.$enums = this.$enums || [];
        let $enum = {}, i, e;
        for (i = 0; i < schema.enum.length; i++) {
            e = schema.enum[i];
            $enum[this.toComparable(e)] = 1;
        }
        this.$enums.push($enum);
        return { inline: "if(!this.$enums[" + (this.$enums.length - 1) + "][this.toComparable(_)]) this.error('enum', ctx, " + JSON.stringify(schema.enum) + ")" };
    },
    "[type=array]": { inline: "if (_ !== undefined && !Array.isArray(_)) this.error('array', ctx)" },
    "[type=object]": { inline: "if (_ !== undefined && (Array.isArray(_) || typeof _ !== 'object' || _ === null)) this.error('object', ctx);" }
},
    options = { formats: Formats.formats, messages: Formats.messages };

let error = function (name = '', errors = {}) {
    return new Promise((resolve, reject) => {
        let error = new Error(name);
        error.name = name;
        error.errors = errors;
        reject(error);
    });
};

let Validator = function (schema, data) {
    let sNormalizer = schemasaurus.newIterator(schema, Normalizer),
        sValidator = schemasaurus.newIterator(schema, schemasaurus.Validator.extend(extend).factory(options));
    let validator = {
        d: data,
        valid: true,
        error: false,
        normalize(data) {
            validator.d = validator.d || data;
            try {
                validator.d = sNormalizer(validator.d);
            } catch (error) {
                validator.valid = false;
                validator.error = error;
            }
            return validator;
        },
        validate(data) {
            if (!validator.valid) {
                return validator;
            }
            let v = sValidator(validator.d || data);
            if (!v.valid) {
                validator.valid = false;
                validator.error = new Error();
                validator.error.name = 'ValidationError';
                validator.error.errors = {};

                for (let i in v.errors) {
                    let e = v.errors[i],
                        additional;

                    validator.error.errors[e.path.join('.')] = {
                        message: `validation.${e.code.replace(/format\./gi, 'string.')}`,
                        path: `${e.path.join('.')}`,
                        value: e.value,
                        arg: e.arg
                    };
                }
            }
            return validator;
        },
        data(data) {
            if (data === undefined) {
                return validator.d;
            }

            validator.d = data;
            return validator;
        },
        middleware() {
            let validatorMiddleware = (req, res, next) => {
                validator
                    .data(req.body)
                    .validate()
                    .then(data => {
                        req.body = data;
                        next();
                    })
                    .catch(next);
            };
            return validatorMiddleware;
        },
        then(callback) {
            let response = validator.valid ?
                Promise.resolve(callback.call(validator, validator.d)) :
                Promise.reject(validator.error);

            validator.valid = true;
            validator.error = false;
            return response;
        }
    };

    return validator;
};

let newValidator = function (schema, data) {
    return new Validator(schema, data);
};

module.exports = newValidator;
