// The MIT License
// Copyright © 2019 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Euclidean distance to a capped cone. Uses only two square roots instead of
// three like the naive implementation.
//
//
// Other cone functions:
//
// Cone bbox:         https://www.shadertoy.com/view/WdjSRK
// Cone distance:     https://www.shadertoy.com/view/tsSXzK
// Cone intersection: https://www.shadertoy.com/view/llcfRf
//
//
// Other distande functions (SDFs):
//
// Quad:          https://www.shadertoy.com/view/Md2BWW
// Triangle:      https://www.shadertoy.com/view/4sXXRN
// Rounded Cone:  https://www.shadertoy.com/view/tdXGWr
// Cylinder:      https://www.shadertoy.com/view/wdXGDr
// Cone:          https://www.shadertoy.com/view/tsSXzK
// Octahedron:    https://www.shadertoy.com/view/wsSGDG
// Capped Torus:  https://www.shadertoy.com/view/tl23RK
// Solid Angle:   https://www.shadertoy.com/view/wtjSDW
// Piramid:       https://www.shadertoy.com/view/Ws3SDl
// Joint:         https://www.shadertoy.com/view/3ld3DM
// Link:          https://www.shadertoy.com/view/wlXSD7
// Rhombus:       https://www.shadertoy.com/view/tlVGDc
// Bounding Box:  https://www.shadertoy.com/view/3ljcRh
// Many more:     https://www.shadertoy.com/view/Xds3zN
//
// List of primitive SDFs at http://iquilezles.org/www/articles/distfunctions/distfunctions.htm


// http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float s)
{
    return length(p)-s;
}


float map( in vec3 pos )
{
    return sdSphere(pos, 0.4);
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.0005;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}
    
#define AA 3

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
     // camera movement	
	float an = 0.5*(iTime-10.0);
	vec3 ro = vec3( 1.0*cos(an), 0.4, 1.0*sin(an) );
    vec3 ta = vec3( 0.0, 0.0, 0.0 );
    // camera matrix
    vec3 ww = normalize( ta - ro );
    vec3 uu = normalize( cross(ww,vec3(0.0,1.0,0.0) ) );
    vec3 vv = normalize( cross(uu,ww));

    
    
    vec3 tot = vec3(0.0);
    
    #if AA>1
    for( int m=0; m<AA; m++ )
    for( int n=0; n<AA; n++ )
    {
        // pixel coordinates
        vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        #else    
        vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
        #endif

	    // create view ray
        vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );

        // raymarch
        const float tmax = 5.0;
        float t = 0.0;
        for( int i=0; i<256; i++ )
        {
            vec3 pos = ro + t*rd;
            float h = map(pos);
            if( h<0.0001 || t>tmax ) break;
            t += h;
        }
        
    
        // shading/lighting	
        vec3 col = vec3(0.0);
        if( t<tmax )
        {
            vec3 pos = ro + t*rd;
            vec3 nor = calcNormal(pos);
            float dif = clamp( dot(nor,vec3(0.57703)), 0.0, 1.0 );
            float amb = 0.5 + 0.5*dot(nor,vec3(0.0,1.0,0.0));
            col = vec3(0.2,0.3,0.4)*amb + vec3(0.8,0.7,0.5)*dif;
        }

        // gamma        
        col = sqrt( col );
	    tot += col;
    #if AA>1
    }
    tot /= float(AA*AA);
    #endif

	fragColor = vec4( tot, 1.0 );
}