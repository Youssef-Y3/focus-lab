precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

// Simplex-style hash and smooth noise
vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                  dot(p, vec2(269.5, 183.3)), 
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash3(i + vec2(0.0, 0.0)).xy, f - vec2(0.0, 0.0)),
                   dot(hash3(i + vec2(1.0, 0.0)).xy, f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0, 1.0)).xy, f - vec2(0.0, 1.0)),
                   dot(hash3(i + vec2(1.0, 1.0)).xy, f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = rot * p * 2.1 + vec2(u_time * 0.04, -u_time * 0.03);
        a *= 0.48;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    // Subtle mouse interaction
    vec2 mouseOffset = (u_mouse - 0.5) * 0.25;
    p += mouseOffset;

    float t = u_time * 0.35;

    // Aurora Ribbon 1 (Vibrant Emerald / Mint Glow)
    float wave1 = sin(p.x * 2.8 + t * 0.8) * 0.25 + cos(p.x * 5.2 - t * 0.5) * 0.12;
    float dist1 = abs(p.y - wave1 + 0.1);
    float glow1 = 0.045 / (dist1 + 0.035);

    // Aurora Ribbon 2 (Cyan / Azure Curtain)
    float wave2 = sin(p.x * 3.4 - t * 0.6) * 0.3 + sin(p.x * 7.1 + t * 0.4) * 0.08;
    float dist2 = abs(p.y - wave2 - 0.05);
    float glow2 = 0.04 / (dist2 + 0.045);

    // Aurora Ribbon 3 (Deep Violet / Solar Amber Shimmer)
    float wave3 = cos(p.x * 2.2 + t * 0.7) * 0.35 + sin(p.x * 4.4 + t) * 0.1;
    float dist3 = abs(p.y - wave3 + 0.2);
    float glow3 = 0.035 / (dist3 + 0.05);

    // Multi-octave turbulence noise
    float turb = fbm(p * 2.5 + vec2(t * 0.15, -t * 0.1));
    glow1 *= (1.0 + turb * 0.8);
    glow2 *= (1.0 + turb * 0.6);
    glow3 *= (1.0 + turb * 0.7);

    // Color definitions
    vec3 colDeepVoid = vec3(0.035, 0.043, 0.063);       // #090b10 obsidian void
    vec3 colEmerald  = vec3(0.063, 0.85, 0.65);         // Emerald Green #10d9a6
    vec3 colCyan     = vec3(0.0, 0.88, 1.0);            // Electric Cyan #00e0ff
    vec3 colViolet   = vec3(0.62, 0.25, 0.98);          // Cosmic Violet #9e40fa
    vec3 colAmber    = vec3(1.0, 0.72, 0.12);           // Solar Amber #ffb81f

    // Composite Aurora colors
    vec3 color = colDeepVoid;
    color += colEmerald * glow1 * 1.35;
    color += colCyan * glow2 * 1.2;
    color += mix(colViolet, colAmber, sin(p.x * 3.0 + t) * 0.5 + 0.5) * glow3 * 1.1;

    // Subtle star dust particles
    vec2 grid = fract(p * 35.0);
    float starHash = fract(sin(dot(floor(p * 35.0), vec2(12.9898, 78.233))) * 43758.5453);
    if (starHash > 0.982) {
        float starDist = length(grid - 0.5);
        float starShine = smoothstep(0.12, 0.01, starDist) * (0.6 + 0.4 * sin(u_time * 3.0 + starHash * 10.0));
        color += vec3(0.9, 0.95, 1.0) * starShine * 0.7;
    }

    // Top-to-bottom vignette fade for hero typography legibility
    float vignette = smoothstep(0.0, 0.85, uv.y) * smoothstep(1.0, 0.35, uv.y);
    color = mix(colDeepVoid, color, vignette * 0.9 + 0.1);

    // Output final color with smooth alpha
    gl_FragColor = vec4(color, 0.95);
}
