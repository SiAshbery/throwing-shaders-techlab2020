void mainImage (out vec4 fragColor, in vec2 fragCoord) {
    // fragCoord gives our pixel coordinate in absolute terms.
    // So the first pixel in a 100 x 100 image is 0,0 and the last one is 100,100
    // Dividing these coords by the resolution gives a normalized positon that ranges
    // between 0 and 1;
    vec2 uv = fragCoord.xy / iResolution.xy;
    // By subtracting .5 we adjust the coords so 0,0 is in the centre
    // with positive values up to 0.5 on the top and right
    // and negative values dopwn to -0.5 on the bottom and left
    uv -= .5;
    // iResolution.x/iResolution.y; gives us the aspect ratio of our canvas
    // Multiplying one of the uv coords by this corrects for any stretching that 
    // might occur in non square canvases
    uv.x *= iResolution.x/iResolution.y;
    // Distance just gives is a single value for how far the pixel
    // is from the origin (0,0) agnostic of direction
    float d = length(uv);

    // desired circle radius
    float r = 0.3;

    // c will be our color var.
    // Smooth step test a value against a lower and upper threshold
    // and then returns 1 for anything below the threshold, 0 for anything
    // outside of it and a value somewhere between 1 and 0 for any
    // value in between the two thresholds.
    // This gives us a simple form of anti-aliasing on the circle
    // as there is a smooth but gradiented transition between 1 and 0.
    float c = smoothstep(r, r - 0.003, d);

    // Set the outbound color values to c (plus 1 for the alpha channel) 
    fragColor = vec4(vec3(c), 1.0);
}