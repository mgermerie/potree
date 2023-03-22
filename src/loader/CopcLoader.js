import {
    PointCloudCopcGeometry,
    PointCloudCopcGeometryNode
} from '../PointCloudCopcGeometry';

import { Copc, Las } from 'copc';


export class CopcLoader {
    /**
     * @param {String} file
     * @param {function} callback
     */
    static async load(file, callback) {
        const get = (/** @type {number} */ begin, /** @type {number} */end) =>
            fetch(file, {
                headers: {
                    'range': `bytes=${begin}-${end-1}`,
                    'length': `${begin-end-1}`,
                },
            }).then((res) => res.arrayBuffer())
            .then((buffer) => new Uint8Array(buffer));

        // const header = Las.Header.parse(await get(0, Las.Constants.minHeaderLength));
        // const vlrs = await Las.Vlr.walk(get, header);
        // console.log(header);
        // console.log(vlrs);

        const copc = await Copc.create(get);
        const geometry = new PointCloudCopcGeometry(copc);

        // const hierarchy = await Copc.loadHierarchyPage(get, copc.info.rootHierarchyPage);
        // console.log(hierarchy.nodes); // if pointCount >= 0, we got the offset + length of point data
        // console.log(hierarchy.pages); // if pointCount == -1, we got the offset + length of hierarchy page

        callback(geometry);
    }
}
