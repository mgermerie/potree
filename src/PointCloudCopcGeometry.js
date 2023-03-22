import {
    PointAttributes,
    PointAttribute,
    PointAttributeTypes
} from './loader/PointAttributes';
import { PointCloudTreeNode } from './PointCloudTree';

import { Copc, Bounds } from 'copc';
import * as THREE from 'three';

/**
 * @typedef {Object} HierarchyPage
 * @property {number} pageOffset
 * @property {number} pageLength
 */

/**
 * @param {[number, number, number]} p
 */
function toVector3(p) {
    return new THREE.Vector3().fromArray(p);
}

/**
 * @param {Bounds} b
 */
function toBox3(b) {
    return new THREE.Box3(toVector3(Bounds.min(b)), toVector3(Bounds.max(b)));
}

export class PointCloudCopcGeometry {
    /**
     * @param {Copc} copc
     */
    constructor(copc) {
        this.boundingBox = toBox3(copc.info.cube);
        this.offset = new THREE.Vector3(0, 0, 0);

        this.projection = null;
        this.fallbackProjection = null;

        // TODO: Parse crs vlr

        if (copc.wkt) {
            if (!this.projection) this.projection = copc.wkt;
            else this.fallbackProjection = copc.wkt;
        }

        {
            // TODO [mschuetz]: named projections that proj4 can't handle seem to cause problems.
            // remove them for now

            try{
                proj4(this.projection);
            }catch(e){
                this.projection = null;
            }
        }

        { // TODO[QB]: Shall we use data size from copc dimensions ?
            const attributes = new PointAttributes();

            attributes.add(PointAttribute.POSITION_CARTESIAN);
            attributes.add(new PointAttribute("rgba", PointAttributeTypes.DATA_TYPE_UINT8, 4));
            attributes.add(new PointAttribute("intensity", PointAttributeTypes.DATA_TYPE_UINT16, 1));
            attributes.add(new PointAttribute("classification", PointAttributeTypes.DATA_TYPE_UINT8, 1));
            attributes.add(new PointAttribute("gps-time", PointAttributeTypes.DATA_TYPE_DOUBLE, 1));
            attributes.add(new PointAttribute("returnNumber", PointAttributeTypes.DATA_TYPE_UINT8, 1));
            attributes.add(new PointAttribute("number of returns", PointAttributeTypes.DATA_TYPE_UINT8, 1));
            attributes.add(new PointAttribute("return number", PointAttributeTypes.DATA_TYPE_UINT8, 1));
            attributes.add(new PointAttribute("source id", PointAttributeTypes.DATA_TYPE_UINT16, 1));

            this.pointAttributes = attributes;
        }

        this.root = new PointCloudCopcGeometryNode(
            copc,
            copc.info.rootHierarchyPage
        );
        //
        // pageOffset: number;
        // pageLength: number;
        copc.info.rootHierarchyPage;
        // TODO[QB]: Load root
    }
}

export class PointCloudCopcGeometryNode extends PointCloudTreeNode {
    /**
     * @param {Copc} copc
     * @param {HierarchyPage} page
     * @param {Bounds} b - Node bounds
     * @param {number} [d = 0] - Current LOD
     * @param {number} [x = 0]
     * @param {number} [y = 0]
     * @param {number} [z = 0]
     */
    constructor(copc, page, b=copc.info.cube, d=0, x=0, y=0, z=0) {
        super();

        this.loaded = false;
        this.loading = false;
        // TODO: Ept key
        //this.boundingBox = toBox3(
    }

    getChildren () {
        return [];
    }

    /**
     * @param {Object} child - TODO
     */
    addChild(child) {
        throw new Error('addChild');
    }

    async loadHierarchy() {
    }

    getBoundingBox () {
        // TODO: HARCODED
        const bmin = new THREE.Vector3(0, 0, 0);
        const bmax = new THREE.Vector3(0, 0, 0);
        return new THREE.Box3(bmin, bmax);
    }

    isLoaded () { return this.loaded; }

    isGeometryNode () { return true; } // same as EptNode, TODO check callers

    isTreeNode () { return false; } // same as EptNode, TODO check callers

    getLevel () {
        // TODO[QB]: HARDCODED
        return 0;
    }

    getBoundingSphere () {
        super.getBoundingSphere();
    }

    load() {
        if (this.loaded || this.loading) return;
        if (Potree.numNodesLoading >= Potree.maxNodesLoading) return;

        this.loading = true;
        ++Potree.numNodesLoading;

        // TODO: load hierarchy if numPoints == -1
        this.loadPoints();
    }

    loadPoints() {
    }

    // Not called but check nonetheless
    url() {
        throw new Error('URL accessed');
    }

    // Called by viewer.js
    getNumPoints() {
        // TODO[QB]: HARDCODED
        return 10;
    }
}
