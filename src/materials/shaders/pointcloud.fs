
#include <potree/WebGL2_pars_fragment>
precision highp float;
precision highp int;
#include <common>
#include <logdepthbuf_pars_fragment>

// #if defined USE_LOGDEPTHBUF_EXT || defined paraboloid_point_shape
// 	#extension GL_EXT_frag_depth : enable
// #endif


uniform mat4 viewMatrix;
uniform mat4 uViewInv;
uniform mat4 uProjInv;
uniform vec3 cameraPosition;


uniform mat4 projectionMatrix;
uniform float uOpacity;

uniform float blendHardness;
uniform float blendDepthSupplement;
uniform float fov;
uniform float uSpacing;
uniform float near;
uniform float far;
uniform float uPCIndex;
uniform float uScreenWidth;
uniform float uScreenHeight;

varying vec3	vColor;
varying float	vLogDepth;
varying vec3	vViewPosition;
varying float	vRadius;
varying float 	vPointSize;
varying vec3 	vPosition;


float specularStrength = 1.0;

void main() {

	#include <logdepthbuf_fragment>
	// gl_FragColor = vec4(vColor, 1.0);

	vec3 color = vColor;
	float depth = gl_FragCoord.z;

	#if defined(circle_point_shape) || defined(paraboloid_point_shape) 
		float u = 2.0 * gl_PointCoord.x - 1.0;
		float v = 2.0 * gl_PointCoord.y - 1.0;
	#endif
	
	#if defined(circle_point_shape) 
		float cc = u*u + v*v;
		if(cc > 1.0){
			discard;
		}
	#endif
		
	#if defined color_type_indices
		gl_FragColor = vec4(color, uPCIndex / 255.0);
	#else
		gl_FragColor = vec4(color, uOpacity);
	#endif

	#if defined paraboloid_point_shape
		float wi = 0.0 - ( u*u + v*v);
		vec4 pos = vec4(vViewPosition, 1.0);
		pos.z += wi * vRadius;
		float linearDepth = -pos.z;
		pos = projectionMatrix * pos;
		pos = pos / pos.w;
		float expDepth = pos.z;
		depth = (pos.z + 1.0) / 2.0;
		// no log depth
		// gl_FragDepthEXT = depth;
		// log depth
		gl_FragDepthEXT =  log2(1.0 + expDepth) * logDepthBufFC * 0.5;

		
		#if defined(color_type_depth)
			color.r = linearDepth;
			color.g = expDepth;
		#endif
		
		#if defined(use_edl)
			// attention doit gerer le log depth!!!
			// ne marche pas vraiment, effet de ligne
			gl_FragColor.a = vLogDepth;
			// gl_FragColor.a = vFragDepth;
		#endif
		
	#else
		#if defined(use_edl)
			gl_FragColor.a = vLogDepth;
		#endif
	#endif

	#if defined(weighted_splats)
		float distance = 2.0 * length(gl_PointCoord.xy - 0.5);
		float weight = max(0.0, 1.0 - distance);
		weight = pow(weight, 1.5);

		gl_FragColor.a = weight;
		gl_FragColor.xyz = gl_FragColor.xyz * weight;
	#endif

	//gl_FragColor = vec4(0.0, 0.7, 0.0, 1.0);
	
}


