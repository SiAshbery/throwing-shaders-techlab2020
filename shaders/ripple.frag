#iChannel0 "file://../images/cross-functional-badgers.jpg"

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float power = 10.0;
    vec2 uv = (fragCoord.xy / iResolution.xy);
    // offset uv coords
    uv.y += 0.05 * sin(iTime + uv.x * power);
    uv.x += 0.05 * sin(iTime + uv.y * power);
    // sample color from image based on modified uv
    vec4 color  = texture(iChannel0, uv);
    fragColor = color;
}