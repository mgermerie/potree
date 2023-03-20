const copc = require('copc');

export class CopcLoader {
    /**
     * @param {String} file
     * @param {function} callback
     */
    static async load(file, callback) {
        const get = (/** @type {number} */ begin, /** @type {number} */end) =>
            fetch(file, {
                headers: {
                    'range': `bytes=${begin}-${end}`,
                    'length': `${begin - end}`,
                },
            }).then((res) => res.arrayBuffer())
            .then((buffer) => new Uint8Array(buffer));

        console.error(copc.Las);
        console.error('Not implemented');
        console.error(await get(0, 10));
    }
}
