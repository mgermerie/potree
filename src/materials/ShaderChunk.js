import * as THREE from "three";
import {Shaders} from "../../build/shaders/shaders.js";
const WebGL2_pars_vertex = Shaders['WebGL2_pars_vertex.vs'];
const WebGL2_pars_fragment = Shaders['WebGL2_pars_fragment.fs'];

const potreeShaderChunk = {
    WebGL2_pars_vertex,
    WebGL2_pars_fragment,
};

/**
 * The ShaderChunkManager manages the itowns chunks shader.
 * It adds chunks to THREE.ShaderChunk to compile shaders
 *
 * In itowns, if you want access to `ShaderChunkManager` instance :
 *
 * ```js
 * import ShaderChunk from 'Renderer/Shader/ShaderChunk';
 * ```
 * or
 * ```js
 * const ShaderChunk = itowns.ShaderChunk';
 * ```
 *
 * @property {Object} target - The target to install the chunks into.
 * @property {string} [path] - A path to add before a chunk name as a prefix.
 *
 */
class ShaderChunkManager {
    /**
     * Constructs a new instance ShaderChunkManager.
     *
     * @constructor
     *
     * @param {Object} target - The target to install the chunks into.
     * @param {string} [path] - A path to add before a chunk name as a prefix.
     *
     */
    constructor(target, path) {
        this.path = path;
        this.target = target;
        this.install();
    }
    /**
     * Set the header ColorLayer shader.
     *
     * @param  {string}  header  The glsl header
     */
    customHeaderColorLayer(header) {
        itownsShaderChunk.custom_header_colorLayer = header;
        this.target[`${this.path}custom_header_colorLayer`] = header;
    }

    /**
     * Set the body ColorLayer shader.
     * You could define you color terrain shader, with a header and a body.
     * the header defines yours fonctions and the body defines the process on ColorLayer.
     * @example <caption>Custom shader chunk</caption>
     *  itowns.ShaderChunk.customHeaderColorLayer(`
     *  // define yours methods
     *  vec4 myColor(vec4 color, float a) {
     *      return color * a;
     *  }
     * `);
     * itowns.ShaderChunk.customBodyColorLayer(`
     *  // the body set final color layer.
     *  // layer.amount_effect is variable, it could be change in Layer instance.
     *  color = myColor(color, layer.amount_effect)
     * `);
     *
     *  var colorLayer = new itowns.ColorLayer('OPENSM', {
     *    source,
     *    type_effect: itowns.colorLayerEffects.customEffect,
     *    amount_effect: 0.5,
     *  });
     *
     * @param  {string}  body  The glsl body
     */
    customBodyColorLayer(body) {
        itownsShaderChunk.custom_body_colorLayer = body;
        this.target[`${this.path}custom_body_colorLayer`] = body;
    }
    /**
     * Install chunks in a target, for example THREE.ShaderChunk, with adding an
     * optional path.
     *
     * @param {Object} target - The target to install the chunks into.
     * @param {Object} chunks - The chunks to install. The key of each chunk will be
     * the name of installation of the chunk in the target (plus an optional path).
     * @param {string} [path] - A path to add before a chunk name as a prefix.
     *
     * @return {Object} The target with installed chunks.
     */
    install(target = this.target, chunks = potreeShaderChunk, path = this.path) {
        Object.keys(chunks).forEach((key) => {
            Object.defineProperty(this, key, {
                get: () => chunks[key],
            });
            target[path + key] = chunks[key];
        });
        return target;
    }
}

const ShaderChunk = new ShaderChunkManager(THREE.ShaderChunk, 'potree/');

export default ShaderChunk;
