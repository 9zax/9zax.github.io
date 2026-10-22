import{g as i}from"./CqkleIqs.js";function l(t,a){for(var o=0;o<a.length;o++){const e=a[o];if(typeof e!="string"&&!Array.isArray(e)){for(const n in e)if(n!=="default"&&!(n in t)){const r=Object.getOwnPropertyDescriptor(e,n);r&&Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:()=>e[n]})}}}return Object.freeze(Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}))}var s=[{name:"AdvancedMosaic",paramsTypes:{pixelSize:"float"},defaultParams:{pixelSize:50},glsl:`// Author: Sergey Kosarevsky
// License: MIT
// Description: Both images break into large blocks that blend, then sharpen into the incoming image
// Tags: pixelate, mosaic, blend
// Ported from https://gist.github.com/corporateshark/21d2fdd24c706952dc8c

uniform float pixelSize; // = 50.0

vec4 transition(vec2 uv) {
  float T = progress;
  float half_ = 0.5;
  float size = (T < half_) ? mix(1.0, pixelSize, T / half_) : mix(pixelSize, 1.0, (T - half_) / half_);
  float D = size * 0.005;
  // Remap UV to center the mosaic pattern
  vec2 UV = (uv - 0.5) / D;
  vec2 coord = clamp(D * (ceil(UV - 0.5)) + 0.5, 0.0, 1.0);
  vec4 C0 = getFromColor(coord);
  vec4 C1 = getToColor(coord);
  return mix(C0, C1, T);
}
`,author:"Sergey Kosarevsky",license:"MIT",description:"Both images break into large blocks that blend, then sharpen into the incoming image",tags:["pixelate","mosaic","blend"],params:{pixelSize:{type:"float",default:50}},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"BlockDissolve",paramsTypes:{blocksize:"float"},defaultParams:{blocksize:.02},glsl:`// Author: nwoeanhinnogaehr
// License: MIT
// Description: The incoming image appears in small random blocks
// Tags: dissolve, blocks, noise
// Ported from https://gist.github.com/nwoeanhinnogaehr/b93818de23d4511fde10

uniform float blocksize; // = 0.02

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 transition(vec2 uv) {
  return mix(getFromColor(uv), getToColor(uv), step(rand(floor(uv / blocksize)), progress));
}
`,author:"nwoeanhinnogaehr",license:"MIT",description:"The incoming image appears in small random blocks",tags:["dissolve","blocks","noise"],params:{blocksize:{type:"float",default:.02}},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"BookFlip",paramsTypes:{},defaultParams:{},glsl:`// Author: hong
// License: MIT
// Description: The outgoing image turns like a book page from right to left, revealing the incoming one
// Tags: page, flip, 3d

// Avoids dividing by zero when the page is edge-on (progress = 0.5).
float nonZero(float x) {
  return abs(x) < 1e-4 ? (x < 0.0 ? -1e-4 : 1e-4) : x;
}

vec2 skewRight(vec2 p) {
  float skewX = (p.x - progress)/nonZero(0.5 - progress) * 0.5;
  float skewY =  (p.y - 0.5)/(0.5 + progress * (p.x - 0.5) / 0.5)* 0.5  + 0.5;
  return vec2(skewX, skewY);
}

vec2 skewLeft(vec2 p) {
  float skewX = (p.x - 0.5)/nonZero(progress - 0.5) * 0.5 + 0.5;
  float skewY = (p.y - 0.5) / (0.5 + (1.0 - progress ) * (0.5 - p.x) / 0.5) * 0.5  + 0.5;
  return vec2(skewX, skewY);
}

vec4 addShade() {
  float shadeVal  =  max(0.7, abs(progress - 0.5) * 2.0);
  return vec4(vec3(shadeVal ), 1.0);
}

vec4 transition (vec2 p) {
  float pr = step(1.0 - progress, p.x);

  if (p.x < 0.5) {
    return mix(getFromColor(p), getToColor(skewLeft(p)) * addShade(), pr);
  } else {
    return mix(getFromColor(skewRight(p)) * addShade(), getToColor(p),   pr);
  }
}
`,author:"hong",license:"MIT",description:"The outgoing image turns like a book page from right to left, revealing the incoming one",tags:["page","flip","3d"],params:{},textures:[],createdAt:"Fri, 27 May 2022 19:13:57 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Bounce",paramsTypes:{shadow_colour:"vec4",shadow_height:"float",bounces:"float"},defaultParams:{shadow_colour:[0,0,0,.6],shadow_height:.075,bounces:3},glsl:`// Author: Adrian Purser
// License: MIT
// Description: The outgoing image drops out of the frame with a few bounces, revealing the incoming one
// Tags: bounce, slide, vertical, shadow

// @color Color of the shadow cast on the incoming image
uniform vec4 shadow_colour; // = vec4(0.,0.,0.,.6)
// @range(0.01, 0.5) Height of the shadow, relative to the image height
uniform float shadow_height; // = 0.075
// @range(1, 10, 1) Number of bounces before settling
uniform float bounces; // = 3.0

const float PI = 3.14159265358;

vec4 transition (vec2 uv) {
  float time = progress;
  float stime = sin(time * PI / 2.);
  float phase = time * PI * bounces;
  float y = (abs(cos(phase))) * (1.0 - stime);
  float d = uv.y - y;
  return mix(
    mix(
      getToColor(uv),
      shadow_colour,
      step(d, shadow_height) * (1. - mix(
        ((d / shadow_height) * shadow_colour.a) + (1.0 - shadow_colour.a),
        1.0,
        smoothstep(0.95, 1., progress) // fade-out the shadow at the end
      ))
    ),
    getFromColor(vec2(uv.x, uv.y + (1.0 - y))),
    step(d, 0.0)
  );
}
`,author:"Adrian Purser",license:"MIT",description:"The outgoing image drops out of the frame with a few bounces, revealing the incoming one",tags:["bounce","slide","vertical","shadow"],params:{shadow_colour:{type:"vec4",default:[0,0,0,.6],color:!0,description:"Color of the shadow cast on the incoming image"},shadow_height:{type:"float",default:.075,min:.01,max:.5,description:"Height of the shadow, relative to the image height"},bounces:{type:"float",default:3,min:1,max:10,step:1,description:"Number of bounces before settling"}},textures:[],createdAt:"Fri, 10 Nov 2017 17:01:45 +0000",updatedAt:"Fri, 9 Oct 2026 23:18:05 +0200"},{name:"BowTieHorizontal",paramsTypes:{},defaultParams:{},glsl:`// Author: huynx
// License: MIT
// Description: Two triangles grow from the left and right edges into a bow tie that reveals the incoming image
// Tags: wipe, shape, horizontal

const vec2 bottom_left = vec2(0.0, 1.0);
const vec2 bottom_right = vec2(1.0, 1.0);
const vec2 top_left = vec2(0.0, 0.0);
const vec2 top_right = vec2(1.0, 0.0);
const vec2 center = vec2(0.5, 0.5);

float check(vec2 p1, vec2 p2, vec2 p3)
{
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool PointInTriangle (vec2 pt, vec2 p1, vec2 p2, vec2 p3)
{
    bool b1, b2, b3;
    b1 = check(pt, p1, p2) < 0.0;
    b2 = check(pt, p2, p3) < 0.0;
    b3 = check(pt, p3, p1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}

bool in_left_triangle(vec2 p){
  vec2 vertex1, vertex2, vertex3;
  vertex1 = vec2(progress, 0.5);
  vertex2 = vec2(0.0, 0.5-progress);
  vertex3 = vec2(0.0, 0.5+progress);
  if (PointInTriangle(p, vertex1, vertex2, vertex3))
  {
    return true;
  }
  return false;
}

bool in_right_triangle(vec2 p){
  vec2 vertex1, vertex2, vertex3;
  vertex1 = vec2(1.0-progress, 0.5);
  vertex2 = vec2(1.0, 0.5-progress);
  vertex3 = vec2(1.0, 0.5+progress);
  if (PointInTriangle(p, vertex1, vertex2, vertex3))
  {
    return true;
  }
  return false;
}

float blur_edge(vec2 bot1, vec2 bot2, vec2 top, vec2 testPt)
{
  vec2 lineDir = bot1 - top;
  vec2 perpDir = vec2(lineDir.y, -lineDir.x);
  vec2 dirToPt1 = bot1 - testPt;
  float dist1 = abs(dot(normalize(perpDir), dirToPt1));
  
  lineDir = bot2 - top;
  perpDir = vec2(lineDir.y, -lineDir.x);
  dirToPt1 = bot2 - testPt;
  float min_dist = min(abs(dot(normalize(perpDir), dirToPt1)), dist1);
  
  if (min_dist < 0.005) {
    return min_dist / 0.005;
  }
  else  {
    return 1.0;
  };
}


vec4 transition (vec2 uv) {
  if (in_left_triangle(uv))
  {
    if (progress < 0.1)
    {
      return getFromColor(uv);
    }
    if (uv.x < 0.5)
    {
      vec2 vertex1 = vec2(progress, 0.5);
      vec2 vertex2 = vec2(0.0, 0.5-progress);
      vec2 vertex3 = vec2(0.0, 0.5+progress);
      return mix(
        getFromColor(uv),
        getToColor(uv),
        blur_edge(vertex2, vertex3, vertex1, uv)
      );
    }
    else
    {
      if (progress > 0.0)
      {
        return getToColor(uv);
      }
      else
      {
        return getFromColor(uv);
      }
    }    
  }
  else if (in_right_triangle(uv))
  {
    if (uv.x >= 0.5)
    {
      vec2 vertex1 = vec2(1.0-progress, 0.5);
      vec2 vertex2 = vec2(1.0, 0.5-progress);
      vec2 vertex3 = vec2(1.0, 0.5+progress);
      return mix(
        getFromColor(uv),
        getToColor(uv),
        blur_edge(vertex2, vertex3, vertex1, uv)
      );  
    }
    else
    {
      return getFromColor(uv);
    }
  }
  else {
    return getFromColor(uv);
  }
}`,author:"huynx",license:"MIT",description:"Two triangles grow from the left and right edges into a bow tie that reveals the incoming image",tags:["wipe","shape","horizontal"],params:{},textures:[],createdAt:"Sat, 24 Mar 2018 12:54:26 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"BowTieVertical",paramsTypes:{},defaultParams:{},glsl:`// Author: huynx
// License: MIT
// Description: Two triangles grow from the top and bottom edges into a bow tie that reveals the incoming image
// Tags: wipe, shape, vertical

float check(vec2 p1, vec2 p2, vec2 p3)
{
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool PointInTriangle (vec2 pt, vec2 p1, vec2 p2, vec2 p3)
{
    bool b1, b2, b3;
    b1 = check(pt, p1, p2) < 0.0;
    b2 = check(pt, p2, p3) < 0.0;
    b3 = check(pt, p3, p1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}

bool in_top_triangle(vec2 p){
  vec2 vertex1, vertex2, vertex3;
  vertex1 = vec2(0.5, progress);
  vertex2 = vec2(0.5-progress, 0.0);
  vertex3 = vec2(0.5+progress, 0.0);
  if (PointInTriangle(p, vertex1, vertex2, vertex3))
  {
    return true;
  }
  return false;
}

bool in_bottom_triangle(vec2 p){
  vec2 vertex1, vertex2, vertex3;
  vertex1 = vec2(0.5, 1.0 - progress);
  vertex2 = vec2(0.5-progress, 1.0);
  vertex3 = vec2(0.5+progress, 1.0);
  if (PointInTriangle(p, vertex1, vertex2, vertex3))
  {
    return true;
  }
  return false;
}

float blur_edge(vec2 bot1, vec2 bot2, vec2 top, vec2 testPt)
{
  vec2 lineDir = bot1 - top;
  vec2 perpDir = vec2(lineDir.y, -lineDir.x);
  vec2 dirToPt1 = bot1 - testPt;
  float dist1 = abs(dot(normalize(perpDir), dirToPt1));
  
  lineDir = bot2 - top;
  perpDir = vec2(lineDir.y, -lineDir.x);
  dirToPt1 = bot2 - testPt;
  float min_dist = min(abs(dot(normalize(perpDir), dirToPt1)), dist1);
  
  if (min_dist < 0.005) {
    return min_dist / 0.005;
  }
  else  {
    return 1.0;
  };
}


vec4 transition (vec2 uv) {
  if (in_top_triangle(uv))
  {
    if (progress < 0.1)
    {
      return getFromColor(uv);
    }
    if (uv.y < 0.5)
    {
      vec2 vertex1 = vec2(0.5, progress);
      vec2 vertex2 = vec2(0.5-progress, 0.0);
      vec2 vertex3 = vec2(0.5+progress, 0.0);
      return mix(
        getFromColor(uv),
        getToColor(uv),
        blur_edge(vertex2, vertex3, vertex1, uv)
      );
    }
    else
    {
      if (progress > 0.0)
      {
        return getToColor(uv);
      }
      else
      {
        return getFromColor(uv);
      }
    }    
  }
  else if (in_bottom_triangle(uv))
  {
    if (uv.y >= 0.5)
    {
      vec2 vertex1 = vec2(0.5, 1.0-progress);
      vec2 vertex2 = vec2(0.5-progress, 1.0);
      vec2 vertex3 = vec2(0.5+progress, 1.0);
      return mix(
        getFromColor(uv),
        getToColor(uv),
        blur_edge(vertex2, vertex3, vertex1, uv)
      );  
    }
    else
    {
      return getFromColor(uv);
    }
  }
  else {
    return getFromColor(uv);
  }
}`,author:"huynx",license:"MIT",description:"Two triangles grow from the top and bottom edges into a bow tie that reveals the incoming image",tags:["wipe","shape","vertical"],params:{},textures:[],createdAt:"Tue, 27 Mar 2018 10:07:54 +0700",updatedAt:"Fri, 9 Oct 2026 23:12:22 +0200"},{name:"BowTieWithParameter",paramsTypes:{adjust:"float",reverse:"bool"},defaultParams:{adjust:.5,reverse:!1},glsl:`// Author: KMojek
// License: MIT
// Description: A bow-tie wipe with an adjustable shape that can run in reverse
// Tags: wipe, shape

uniform float adjust; // = 0.5
// @param Run the wipe in reverse
uniform bool reverse; // = false

float check(vec2 p1, vec2 p2, vec2 p3)
{
  return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

bool pointInTriangle(vec2 pt, vec2 p1, vec2 p2, vec2 p3)
{

    bool b1 = check(pt, p1, p2) < 0.0;
    bool b2 = check(pt, p2, p3) < 0.0;
    bool b3 = check(pt, p3, p1) < 0.0;
    return b1 == b2 && b2 == b3;
}

const float height = 0.5;

vec4 transition_firstHalf( vec2 uv, float prog )
{
  if ( uv.y < 0.5 )
  {
    vec2 botLeft = vec2( -0., prog-height );
    vec2 botRight = vec2( 1., prog-height );
    vec2 tip = vec2( adjust, prog );
    if ( pointInTriangle( uv, botLeft, botRight, tip ) )
        return getToColor(uv);
    }
  else
  {
    vec2 topLeft = vec2( -0., 1.-prog+height );
    vec2 topRight = vec2( 1., 1.-prog+height );
    vec2 tip = vec2( adjust, 1.-prog );
    if ( pointInTriangle( uv, topLeft, topRight, tip ) )
      return getToColor( uv );
  }
  return getFromColor( uv );
}

vec4 transition_secondHalf( vec2 uv, float prog )
{
  if ( uv.x > adjust )
  {
    vec2 top = vec2( prog + height,  1. );
    vec2 bot = vec2( prog + height, -0. );
    vec2 tip = vec2( mix( adjust, 1.0, 2.0 * (prog - 0.5) ), 0.5 );
    if ( pointInTriangle( uv, top, bot, tip) )
      return getFromColor( uv );
  }
  else
  {
    vec2 top = vec2( 1.0-prog - height,  1. );
    vec2 bot = vec2( 1.0-prog - height, -0. );
    vec2 tip = vec2( mix( adjust, 0.0, 2.0 * (prog - 0.5)  ), 0.5 );
    if ( pointInTriangle( uv, top, bot, tip) )
      return getFromColor( uv );
  }
  return getToColor( uv );
}

vec4 transition (vec2 uv) {
  if ( reverse )
    return ( progress < 0.5 ) ? transition_secondHalf( uv, 1.-progress ) : transition_firstHalf( uv, 1.-progress );
  else
    return ( progress < 0.5 ) ? transition_firstHalf( uv, progress ) : transition_secondHalf( uv, progress );
}`,author:"KMojek",license:"MIT",description:"A bow-tie wipe with an adjustable shape that can run in reverse",tags:["wipe","shape"],params:{adjust:{type:"float",default:.5},reverse:{type:"bool",default:!1,description:"Run the wipe in reverse"}},textures:[],createdAt:"Thu, 19 Mar 2020 21:36:12 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Box",paramsTypes:{rectIn:"int",location:"int"},defaultParams:{rectIn:1,location:0},glsl:`// Author: lql
// License: MIT
// Description: The outgoing image shrinks into a box, toward the center or a corner, revealing the incoming one
// Tags: box, zoom, shape
uniform int rectIn; // =1
// center:0, left_top:1, left_bottom:2, right_top:3, right_bottom:4
// @range(0, 4, 1) Where the box goes: 0 center, 1 left top, 2 left bottom, 3 right top, 4 right bottom
uniform int location; // =0

vec4 transition(vec2 uv) {
    float p = rectIn == 1 ? 1.0 - progress : progress;
    float x1, y1, x2, y2;

    // Determine rectangle coordinates based on location
    if (location == 0) {
        x1 = y1 = 0.5 * (1.0 - p);
        x2 = y2 = 1.0 - x1;
    } else {
        // Calculate the x and y coordinates based on the location
        x1 = (location == 1 || location == 2) ? 0.0 : 1.0 - p;
        y1 = (location == 1 || location == 3) ? 1.0 - p : 0.0;
        x2 = (location == 1 || location == 2) ? p : 1.0;
        y2 = (location == 1 || location == 3) ? 1.0 : p;
    }

    // Determine if the point is inside the rectangle
    float in_rect = step(x1, uv.x) * step(uv.x, x2) * step(y1, uv.y) * step(uv.y, y2);
    in_rect = rectIn == 1 ? 1.0 - in_rect : in_rect;

    // Mix colors based on the in_rect value
    return mix(getFromColor(uv), getToColor(uv), in_rect);
}
`,author:"lql",license:"MIT",description:"The outgoing image shrinks into a box, toward the center or a corner, revealing the incoming one",tags:["box","zoom","shape"],params:{rectIn:{type:"int",default:1},location:{type:"int",default:0,min:0,max:4,step:1,description:"Where the box goes: 0 center, 1 left top, 2 left bottom, 3 right top, 4 right bottom"}},textures:[],createdAt:"Tue, 23 Jan 2024 23:06:37 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"ButterflyWaveScrawler",paramsTypes:{amplitude:"float",waves:"float",colorSeparation:"float"},defaultParams:{amplitude:1,waves:30,colorSeparation:.3},glsl:`// Author: mandubian
// License: MIT
// Description: Wavy, color-separated ripples scramble the outgoing image into the incoming one
// Tags: wave, distort, chromatic
uniform float amplitude; // = 1.0
uniform float waves; // = 30.0
uniform float colorSeparation; // = 0.3
const float PI = 3.14159265358979323846264;
float compute(vec2 p, float progress, vec2 center) {
vec2 o = p*sin(progress * amplitude)-center;
// horizontal vector
vec2 h = vec2(1., 0.);
// butterfly polar function (don't ask me why this one :))
float theta = acos(dot(o, h)) * waves;
float s = sin((2.*theta - PI) / 24.);
float s2 = s * s;
return (exp(cos(theta)) - 2.*cos(4.*theta) + s2 * s2 * s) / 10.;
}
vec4 transition(vec2 uv) {
  if (progress <= 0.0) return getFromColor(uv);
  if (progress >= 1.0) return getToColor(uv);
  vec2 p = uv;
  float inv = 1. - progress;
  float disp = compute(p, progress, vec2(0.5, 0.5));
  vec4 texTo = getToColor(p + inv*disp);
  vec4 texFrom = vec4(
    getFromColor(p + progress*disp*(1.0 - colorSeparation)).r,
    getFromColor(p + progress*disp).g,
    getFromColor(p + progress*disp*(1.0 + colorSeparation)).b,
    1.0);
  return texTo*progress + texFrom*inv;
}
`,author:"mandubian",license:"MIT",description:"Wavy, color-separated ripples scramble the outgoing image into the incoming one",tags:["wave","distort","chromatic"],params:{amplitude:{type:"float",default:1},waves:{type:"float",default:30},colorSeparation:{type:"float",default:.3}},textures:[],createdAt:"Thu, 1 Jun 2017 11:47:17 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"CircleCrop",paramsTypes:{bgcolor:"vec4"},defaultParams:{bgcolor:[0,0,0,1]},glsl:`// License: MIT
// Author: fkuteken
// Description: The outgoing image closes into a circle over a background color, then the incoming one opens from it
// Tags: circle, iris, shape
// ported by gre from https://gist.github.com/fkuteken/f63e3009c1143950dee9063c3b83fb88

// @color Background color
uniform vec4 bgcolor; // = vec4(0.0, 0.0, 0.0, 1.0)

vec4 transition(vec2 p) {
  vec2 ratio2 = vec2(1.0, 1.0 / ratio);
  float s = pow(2.0 * abs(progress - 0.5), 3.0);
  float dist = length((vec2(p) - 0.5) * ratio2);
  return mix(
    progress < 0.5 ? getFromColor(p) : getToColor(p), // branching is ok here as we statically depend on progress uniform (branching won't change over pixels)
    bgcolor,
    step(s, dist)
  );
}
`,author:"fkuteken",license:"MIT",description:"The outgoing image closes into a circle over a background color, then the incoming one opens from it",tags:["circle","iris","shape"],params:{bgcolor:{type:"vec4",default:[0,0,0,1],color:!0,description:"Background color"}},textures:[],createdAt:"Mon, 12 Jun 2017 12:52:34 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"ColourDistance",paramsTypes:{power:"float"},defaultParams:{power:5},glsl:`// License: MIT
// Author: P-Seebauer
// Description: Pixels switch to the incoming image in order of how close their colors are
// Tags: blend, color
// ported by gre from https://gist.github.com/P-Seebauer/2a5fa2f77c883dd661f9

uniform float power; // = 5.0

vec4 transition(vec2 p) {
  vec4 fTex = getFromColor(p);
  vec4 tTex = getToColor(p);
  float m = step(distance(fTex, tTex), progress);
  return mix(
    mix(fTex, tTex, m),
    tTex,
    pow(progress, power)
  );
}
`,author:"P-Seebauer",license:"MIT",description:"Pixels switch to the incoming image in order of how close their colors are",tags:["blend","color"],params:{power:{type:"float",default:5}},textures:[],createdAt:"Mon, 12 Jun 2017 12:57:42 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"CrazyParametricFun",paramsTypes:{a:"float",b:"float",amplitude:"float",smoothness:"float"},defaultParams:{a:4,b:1,amplitude:120,smoothness:.1},glsl:`// Author: mandubian
// License: MIT
// Description: The outgoing image is pulled along a parametric curve into a psychedelic swirl
// Tags: distort, psychedelic

uniform float a; // = 4
uniform float b; // = 1
uniform float amplitude; // = 120
uniform float smoothness; // = 0.1

vec4 transition(vec2 uv) {
  vec2 p = uv.xy / vec2(1.0).xy;
  vec2 dir = p - vec2(.5);
  float dist = length(dir);
  float x = (a - b) * cos(progress) + b * cos(progress * ((a / b) - 1.) );
  float y = (a - b) * sin(progress) - b * sin(progress * ((a / b) - 1.));
  vec2 offset = dir * vec2(sin(progress  * dist * amplitude * x), sin(progress * dist * amplitude * y)) / smoothness;
  return mix(getFromColor(p + offset), getToColor(p), smoothstep(0.2, 1.0, progress));
}
`,author:"mandubian",license:"MIT",description:"The outgoing image is pulled along a parametric curve into a psychedelic swirl",tags:["distort","psychedelic"],params:{a:{type:"float",default:4},b:{type:"float",default:1},amplitude:{type:"float",default:120},smoothness:{type:"float",default:.1}},textures:[],createdAt:"Thu, 1 Jun 2017 13:03:12 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"CrossZoom",paramsTypes:{strength:"float"},defaultParams:{strength:.4},glsl:`// License: MIT
// Author: rectalogic
// Description: A crossfade through a strong zoom blur
// Tags: zoom, blur, blend
// ported by gre from https://gist.github.com/rectalogic/b86b90161503a0023231

// Converted from https://github.com/rectalogic/rendermix-basic-effects/blob/master/assets/com/rendermix/CrossZoom/CrossZoom.frag
// Which is based on https://github.com/evanw/glfx.js/blob/master/src/filters/blur/zoomblur.js
// With additional easing functions from https://github.com/rectalogic/rendermix-basic-effects/blob/master/assets/com/rendermix/Easing/Easing.glsllib

// @range(0, 1) Blur strength
uniform float strength; // = 0.4

const float PI = 3.141592653589793;

float Linear_ease(in float begin, in float change, in float duration, in float time) {
    return change * time / duration + begin;
}

float Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {
    if (time == 0.0)
        return begin;
    else if (time == duration)
        return begin + change;
    time = time / (duration / 2.0);
    if (time < 1.0)
        return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;
    return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;
}

float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {
    return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;
}

float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 crossFade(in vec2 uv, in float dissolve) {
    return mix(getFromColor(uv), getToColor(uv), dissolve);
}

vec4 transition(vec2 uv) {
    vec2 texCoord = uv.xy / vec2(1.0).xy;

    // Linear interpolate center across center half of the image
    vec2 center = vec2(Linear_ease(0.25, 0.5, 1.0, progress), 0.5);
    float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);

    // Mirrored sinusoidal loop. 0->strength then strength->0
    float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);

    vec4 color = vec4(0.0);
    float total = 0.0;
    vec2 toCenter = center - texCoord;

    /* randomize the lookup values to hide the fixed number of samples */
    float offset = rand(uv);

    for (float t = 0.0; t <= 40.0; t++) {
        float percent = (t + offset) / 40.0;
        float weight = 4.0 * (percent - percent * percent);
        color += crossFade(texCoord + toCenter * percent * strength, dissolve) * weight;
        total += weight;
    }
    return color / total;
}
`,author:"rectalogic",license:"MIT",description:"A crossfade through a strong zoom blur",tags:["zoom","blur","blend"],params:{strength:{type:"float",default:.4,min:0,max:1,description:"Blur strength"}},textures:[],createdAt:"Mon, 12 Jun 2017 12:33:07 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"DefocusBlur",paramsTypes:{blurSize:"float"},defaultParams:{blurSize:.02},glsl:`// Author: Sergey Kosarevsky
// License: MIT
// Description: A crossfade through an out-of-focus blur
// Tags: blur, blend
// Ported from https://gist.github.com/corporateshark/b9f8e5675c647e615419

// @param Amount of blur
uniform float blurSize; // = 0.02

// 12-tap Poisson disk
// https://github.com/spite/Wagner/blob/master/fragment-shaders/poisson-disc-blur-fs.glsl

vec4 transition(vec2 uv) {
  float T = progress;
  float half_ = 0.5;
  float D = (T < half_) ? mix(0.0, blurSize, T / half_) : mix(blurSize, 0.0, (T - half_) / half_);
  vec4 C0 = getFromColor(uv);
  vec4 C1 = getToColor(uv);
  C0 += getFromColor(vec2(-0.326, -0.406) * D + uv);
  C1 += getToColor(vec2(-0.326, -0.406) * D + uv);
  C0 += getFromColor(vec2(-0.840, -0.074) * D + uv);
  C1 += getToColor(vec2(-0.840, -0.074) * D + uv);
  C0 += getFromColor(vec2(-0.696,  0.457) * D + uv);
  C1 += getToColor(vec2(-0.696,  0.457) * D + uv);
  C0 += getFromColor(vec2(-0.203,  0.621) * D + uv);
  C1 += getToColor(vec2(-0.203,  0.621) * D + uv);
  C0 += getFromColor(vec2( 0.962, -0.195) * D + uv);
  C1 += getToColor(vec2( 0.962, -0.195) * D + uv);
  C0 += getFromColor(vec2( 0.473, -0.480) * D + uv);
  C1 += getToColor(vec2( 0.473, -0.480) * D + uv);
  C0 += getFromColor(vec2( 0.519,  0.767) * D + uv);
  C1 += getToColor(vec2( 0.519,  0.767) * D + uv);
  C0 += getFromColor(vec2( 0.185, -0.893) * D + uv);
  C1 += getToColor(vec2( 0.185, -0.893) * D + uv);
  C0 += getFromColor(vec2( 0.507,  0.064) * D + uv);
  C1 += getToColor(vec2( 0.507,  0.064) * D + uv);
  C0 += getFromColor(vec2( 0.896,  0.412) * D + uv);
  C1 += getToColor(vec2( 0.896,  0.412) * D + uv);
  C0 += getFromColor(vec2(-0.322, -0.933) * D + uv);
  C1 += getToColor(vec2(-0.322, -0.933) * D + uv);
  C0 += getFromColor(vec2(-0.792, -0.598) * D + uv);
  C1 += getToColor(vec2(-0.792, -0.598) * D + uv);
  C0 /= 13.0;
  C1 /= 13.0;
  return mix(C0, C1, T);
}
`,author:"Sergey Kosarevsky",license:"MIT",description:"A crossfade through an out-of-focus blur",tags:["blur","blend"],params:{blurSize:{type:"float",default:.02,description:"Amount of blur"}},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Directional",paramsTypes:{direction:"vec2"},defaultParams:{direction:[0,1]},glsl:`// Author: Gaëtan Renaudeau
// License: MIT
// Description: The incoming image pushes the outgoing one out in a given direction
// Tags: slide, push, directional

// @param Direction of the movement
uniform vec2 direction; // = vec2(0.0, 1.0)

vec4 transition (vec2 uv) {
  vec2 p = uv + progress * sign(direction);
  vec2 f = fract(p);
  return mix(
    getToColor(f),
    getFromColor(f),
    step(0.0, p.y) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0)
  );
}
`,author:"Gaëtan Renaudeau",license:"MIT",description:"The incoming image pushes the outgoing one out in a given direction",tags:["slide","push","directional"],params:{direction:{type:"vec2",default:[0,1],description:"Direction of the movement"}},textures:[],createdAt:"Thu, 19 Apr 2018 12:20:29 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"DirectionalScaled",paramsTypes:{direction:"vec2",scale:"float"},defaultParams:{direction:[0,1],scale:.7},glsl:`// Author: Thibaut Foussard
// based on Directional transition by Gaëtan Renaudeau
// https://gl-transitions.com/editor/Directional
// License: MIT
// Description: Like Directional, with both images scaled down while they slide
// Tags: slide, push, zoom, directional

#define PI acos(-1.0)

// @param Direction of the movement
uniform vec2 direction; // = vec2(0.0, 1.0)
uniform float scale; // = .7

float parabola(float x) {
  float y = pow(sin(x * PI), 1.);
  return y;
}

vec4 transition (vec2 uv) {
  float easedProgress = pow(sin(progress  * PI / 2.), 3.);
  vec2 p = uv + easedProgress * sign(direction);
  vec2 f = fract(p);
  
  float s = 1. - (1. - (1. / scale)) * parabola(progress);
  f = (f - 0.5) * s  + 0.5;
  
  float mixer = step(0.0, p.y) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0);
  vec4 col = mix(getToColor(f), getFromColor(f), mixer);
  
  float border = step(0., f.x) * step(0., (1. - f.x)) * step(0., f.y) * step(0., 1. - f.y);
  col *= border;
  
  return col;
}
`,author:"Thibaut Foussard",license:"MIT",description:"Like Directional, with both images scaled down while they slide",tags:["slide","push","zoom","directional"],params:{direction:{type:"vec2",default:[0,1],description:"Direction of the movement"},scale:{type:"float",default:.7}},textures:[],createdAt:"Tue, 4 Apr 2023 03:29:34 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"DoomScreenTransition",paramsTypes:{bars:"int",amplitude:"float",noise:"float",frequency:"float",dripScale:"float"},defaultParams:{bars:30,amplitude:2,noise:.1,frequency:.5,dripScale:.5},glsl:`// Author: Zeh Fernando
// License: MIT
// Description: The outgoing image melts down in uneven columns, like the Doom screen wipe
// Tags: melt, columns, retro


// Transition parameters --------

// Number of total bars/columns
uniform int bars; // = 30

// Multiplier for speed ratio. 0 = no variation when going down, higher = some elements go much faster
uniform float amplitude; // = 2

// Further variations in speed. 0 = no noise, 1 = super noisy (ignore frequency)
uniform float noise; // = 0.1

// Speed variation horizontally. the bigger the value, the shorter the waves
uniform float frequency; // = 0.5

// How much the bars seem to "run" from the middle of the screen first (sticking to the sides). 0 = no drip, 1 = curved drip
uniform float dripScale; // = 0.5


// The code proper --------

float rand(int num) {
  return fract(mod(float(num) * 67123.313, 12.0) * sin(float(num) * 10.3) * cos(float(num)));
}

float wave(int num) {
  float fn = float(num) * frequency * 0.1 * float(bars);
  return cos(fn * 0.5) * cos(fn * 0.13) * sin((fn+10.0) * 0.3) / 2.0 + 0.5;
}

float drip(int num) {
  return sin(float(num) / float(bars - 1) * 3.141592) * dripScale;
}

float pos(int num) {
  return (noise == 0.0 ? wave(num) : mix(wave(num), rand(num), noise)) + (dripScale == 0.0 ? 0.0 : drip(num));
}

vec4 transition(vec2 uv) {
  int bar = int(uv.x * (float(bars)));
  float scale = 1.0 + pos(bar) * amplitude;
  float phase = progress * scale;
  float posY = uv.y / vec2(1.0).y;
  vec2 p;
  vec4 c;
  if (phase + posY < 1.0) {
    p = vec2(uv.x, uv.y + mix(0.0, vec2(1.0).y, phase)) / vec2(1.0).xy;
    c = getFromColor(p);
  } else {
    p = uv.xy / vec2(1.0).xy;
    c = getToColor(p);
  }

  // Finally, apply the color
  return c;
}
`,author:"Zeh Fernando",license:"MIT",description:"The outgoing image melts down in uneven columns, like the Doom screen wipe",tags:["melt","columns","retro"],params:{bars:{type:"int",default:30},amplitude:{type:"float",default:2},noise:{type:"float",default:.1},frequency:{type:"float",default:.5},dripScale:{type:"float",default:.5}},textures:[],createdAt:"Tue, 30 May 2017 09:39:09 -0700",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Dreamy",paramsTypes:{},defaultParams:{},glsl:`// Author: mikolalysenko
// License: MIT
// Description: A crossfade with a gentle wavy distortion
// Tags: wave, blend

vec2 offset(float progress, float x, float theta) {
  float phase = progress*progress + progress + theta;
  float shifty = 0.03*progress*cos(10.0*(progress+x));
  return vec2(0, shifty);
}
vec4 transition(vec2 p) {
  return mix(getFromColor(p + offset(progress, p.x, 0.0)), getToColor(p + offset(1.0-progress, p.x, 3.14)), progress);
}
`,author:"mikolalysenko",license:"MIT",description:"A crossfade with a gentle wavy distortion",tags:["wave","blend"],params:{},textures:[],createdAt:"Mon, 12 Jun 2017 12:27:38 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"DreamyZoom",paramsTypes:{rotation:"float",scale:"float"},defaultParams:{rotation:6,scale:1.2},glsl:`// Author: Zeh Fernando
// License: MIT
// Description: Zooms and rotates into a bright flash, then out to the incoming image
// Tags: zoom, rotate, flash

// Definitions --------
#define DEG2RAD 0.03926990816987241548078304229099 // 1/180*PI


// Transition parameters --------

// In degrees
uniform float rotation; // = 6

// Multiplier
uniform float scale; // = 1.2


// The code proper --------

vec4 transition(vec2 uv) {
  // Massage parameters
  float phase = progress < 0.5 ? progress * 2.0 : (progress - 0.5) * 2.0;
  float angleOffset = progress < 0.5 ? mix(0.0, rotation * DEG2RAD, phase) : mix(-rotation * DEG2RAD, 0.0, phase);
  float newScale = progress < 0.5 ? mix(1.0, scale, phase) : mix(scale, 1.0, phase);
  
  vec2 center = vec2(0, 0);

  // Calculate the source point
  vec2 assumedCenter = vec2(0.5, 0.5);
  vec2 p = (uv.xy - vec2(0.5, 0.5)) / newScale * vec2(ratio, 1.0);

  // This can probably be optimized (with distance())
  float angle = atan(p.y, p.x) + angleOffset;
  float dist = distance(center, p);
  p.x = cos(angle) * dist / ratio + 0.5;
  p.y = sin(angle) * dist + 0.5;
  vec4 c = progress < 0.5 ? getFromColor(p) : getToColor(p);

  // Finally, apply the color
  return c + (progress < 0.5 ? mix(0.0, 1.0, phase) : mix(1.0, 0.0, phase));
}
`,author:"Zeh Fernando",license:"MIT",description:"Zooms and rotates into a bright flash, then out to the incoming image",tags:["zoom","rotate","flash"],params:{rotation:{type:"float",default:6},scale:{type:"float",default:1.2}},textures:[],createdAt:"Tue, 30 May 2017 10:44:06 -0700",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Drop_Zone_Flicker",paramsTypes:{frameRate:"float",rgbOffset:"float",blockAmount:"float",ghostAmount:"float",redCyan:"float",scanline:"float"},defaultParams:{frameRate:24,rgbOffset:.014,blockAmount:.72,ghostAmount:.62,redCyan:.58,scanline:.075},glsl:`// Author: bread
// License: MIT
// Description: A flickering glitch with RGB offset, ghosting and scanlines that flashes back to the outgoing image
// Tags: glitch, flicker, chromatic, scanlines
// Drop_Zone_Flicker.glsl
// gl-transitions compatible: progress, ratio, getFromColor, getToColor
uniform float frameRate;    // = 24.0
uniform float rgbOffset;    // = 0.014
uniform float blockAmount;  // = 0.72
uniform float ghostAmount;  // = 0.62
uniform float redCyan;      // = 0.58
uniform float scanline;     // = 0.075

float sat(float x) {
  return clamp(x, 0.0, 1.0);
}

float hash12(vec2 p) {
  p = fract(p * vec2(443.8975, 397.2973));
  p += dot(p, p.yx + 19.19);
  return fract(p.x * p.y);
}

vec2 safeUv(vec2 uv) {
  return clamp(uv, vec2(0.001), vec2(0.999));
}

// 24fps reference-matched reveal curve.
// Non-monotonic on purpose: the reference flashes back to the old clip.
float frameReveal(float f) {
  if (f < 0.5) return 0.00;
  if (f < 1.5) return 0.28;
  if (f < 2.5) return 0.43;
  if (f < 3.5) return 0.46;
  if (f < 4.5) return 0.38;
  if (f < 5.5) return 0.48;
  if (f < 6.5) return 0.26;
  if (f < 7.5) return 0.10;
  if (f < 8.5) return 0.00;
  if (f < 9.5) return 0.00;
  if (f < 10.5) return 0.30;
  if (f < 11.5) return 0.58;
  if (f < 12.5) return 1.00;
  if (f < 13.5) return 0.70;
  if (f < 14.5) return 0.42;
  if (f < 15.5) return 0.55;
  if (f < 16.5) return 0.72;
  if (f < 17.5) return 0.88;
  if (f < 18.5) return 0.34;
  if (f < 19.5) return 0.48;
  if (f < 20.5) return 0.56;
  if (f < 21.5) return 0.76;
  if (f < 22.5) return 0.93;
  return 1.00;
}

float frameGlitch(float f) {
  if (f < 0.5) return 0.00;
  if (f < 6.5) return 0.92;
  if (f < 10.5) return 0.38;
  if (f < 11.5) return 0.78;
  if (f < 12.5) return 0.12;
  if (f < 17.5) return 0.74;
  if (f < 22.5) return 0.88;
  if (f < 23.5) return 0.28;
  return 0.00;
}

vec4 chromaFrom(vec2 uv, float amt) {
  vec2 o = vec2(amt, 0.0);
  return vec4(
    getFromColor(safeUv(uv + o)).r,
    getFromColor(safeUv(uv)).g,
    getFromColor(safeUv(uv - o)).b,
    1.0
  );
}

vec4 chromaTo(vec2 uv, float amt) {
  vec2 o = vec2(amt, 0.0);
  return vec4(
    getToColor(safeUv(uv - o)).r,
    getToColor(safeUv(uv)).g,
    getToColor(safeUv(uv + o)).b,
    1.0
  );
}

float blockMask(vec2 uv, float f) {
  vec2 big = floor(uv * vec2(4.0, 2.0));
  vec2 small = floor(uv * vec2(8.0, 4.0));

  float wide = step(0.48, hash12(vec2(big.x, f * 1.37)));
  float chunks = step(0.56, hash12(small + vec2(f * 2.11, f * 0.73)));

  float verticalCut = smoothstep(
    -0.035,
    0.035,
    uv.x - mix(0.18, 0.78, hash12(vec2(f, 4.7)))
  );

  return sat(mix(wide, chunks, 0.38) * 0.72 + verticalCut * 0.28);
}

vec4 transition(vec2 uv) {
  if (progress <= 0.0) return getFromColor(uv);
  if (progress >= 1.0) return getToColor(uv);

  float f = floor(progress * frameRate);
  float reveal = frameReveal(f);
  float glitch = frameGlitch(f);

  float rnd = hash12(vec2(f, 9.13));
  vec2 jitter = vec2(
    (rnd - 0.5) * 0.042,
    (hash12(vec2(f, 2.71)) - 0.5) * 0.010
  ) * glitch;

  vec2 fromUv = safeUv(uv + jitter);
  vec2 toUv = safeUv(uv - jitter * 0.55);

  float block = blockMask(uv, f);
  float localReveal = sat(
    reveal +
    (block - 0.5) * blockAmount * glitch +
    (hash12(vec2(f, floor(uv.y * 9.0))) - 0.5) * 0.18 * glitch
  );

  localReveal = smoothstep(0.22, 0.78, localReveal);

  vec4 oldClip = chromaFrom(fromUv, rgbOffset * glitch);
  vec4 newClip = chromaTo(toUv, rgbOffset * glitch);

  vec4 color = mix(oldClip, newClip, localReveal);

  float leftWash = (1.0 - smoothstep(0.10, 0.78, uv.x)) * glitch;
  float cyanWash = smoothstep(0.08, 0.62, uv.x) * (1.0 - smoothstep(0.86, 1.0, uv.x)) * glitch;

  vec3 redGhost = oldClip.rgb * vec3(1.34, 0.42, 0.38);
  vec3 cyanGhost = newClip.rgb * vec3(0.48, 1.12, 1.24);

  color.rgb = mix(color.rgb, redGhost, leftWash * redCyan * 0.42);
  color.rgb = mix(color.rgb, cyanGhost, cyanWash * redCyan * 0.30);

  // Keeps the old circular "drop zone" visible as a translucent flash,
  // especially after the first full new-frame hit.
  float oldReturn = glitch * (1.0 - smoothstep(0.94, 1.0, reveal));
  oldReturn *= 0.18 + 0.52 * (1.0 - abs(localReveal - 0.5) * 2.0);
  color.rgb = mix(color.rgb, oldClip.rgb, oldReturn * ghostAmount);

  float lines = sin((uv.y + f * 0.017) * 1080.0);
  color.rgb += lines * scanline * glitch;

  float exposurePulse = (hash12(vec2(f, 12.4)) - 0.35) * 0.10 * glitch;
  color.rgb += exposurePulse;

  return vec4(sat(color.r), sat(color.g), sat(color.b), 1.0);
}
`,author:"bread",license:"MIT",description:"A flickering glitch with RGB offset, ghosting and scanlines that flashes back to the outgoing image",tags:["glitch","flicker","chromatic","scanlines"],params:{frameRate:{type:"float",default:24},rgbOffset:{type:"float",default:.014},blockAmount:{type:"float",default:.72},ghostAmount:{type:"float",default:.62},redCyan:{type:"float",default:.58},scanline:{type:"float",default:.075}},textures:[],createdAt:"Wed, 10 Jun 2026 11:41:33 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"EdgeTransition",paramsTypes:{edge_thickness:"float",edge_brightness:"float"},defaultParams:{edge_thickness:.001,edge_brightness:8},glsl:`// Author: Woohyun Kim
// License: MIT
// Description: Both images fade through black with their edges glowing
// Tags: edges, fade

uniform float edge_thickness; // = 0.001
uniform float edge_brightness; // = 8.0

vec4 detectEdgeColor(vec3[9] c) {
  /* adjacent texel array for texel c[4]
    036
    147
    258
  */
  vec3 dx = 2.0 * abs(c[7]-c[1]) + abs(c[2] - c[6]) + abs(c[8] - c[0]);
	vec3 dy = 2.0 * abs(c[3]-c[5]) + abs(c[6] - c[8]) + abs(c[0] - c[2]);
  float delta = length(0.25 * (dx + dy) * 0.5);
	return vec4(clamp(edge_brightness * delta, 0.0, 1.0) * c[4], 1.0);
}

vec4 getFromEdgeColor(vec2 uv) {
	vec3 c[9];
	for (int i=0; i < 3; ++i) for (int j=0; j < 3; ++j)
	{
	  vec4 color = getFromColor(uv + edge_thickness * vec2(i-1,j-1));
    c[3*i + j] = color.rgb;
	}
	return detectEdgeColor(c);
}

vec4 getToEdgeColor(vec2 uv) {
	vec3 c[9];
	for (int i=0; i < 3; ++i) for (int j=0; j < 3; ++j)
	{
	  vec4 color = getToColor(uv + edge_thickness * vec2(i-1,j-1));
    c[3*i + j] = color.rgb;
	}
	return detectEdgeColor(c);
}

vec4 transition (vec2 uv) {
  vec4 start = mix(getFromColor(uv), getFromEdgeColor(uv), clamp(2.0 * progress, 0.0, 1.0));
  vec4 end = mix(getToEdgeColor(uv), getToColor(uv), clamp(2.0 * (progress - 0.5), 0.0, 1.0));
  return mix(
    start,
    end,
    progress
  );
}
`,author:"Woohyun Kim",license:"MIT",description:"Both images fade through black with their edges glowing",tags:["edges","fade"],params:{edge_thickness:{type:"float",default:.001},edge_brightness:{type:"float",default:8}},textures:[],createdAt:"Tue, 4 Apr 2023 16:28:18 +0900",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"FilmBurn",paramsTypes:{Seed:"float"},defaultParams:{Seed:2.31},glsl:`// Author: Anastasia Dunbar
// License: MIT
// Description: Glowing film-burn light leaks wash over the image and reveal the incoming one
// Tags: burn, film, light-leak
// @param Random seed
uniform float Seed; // = 2.31
float sigmoid(float x, float a) {
    float b = pow(x*2.,a)/2.;
    if (x > .5) {
        b = 1.-pow(2.-(x*2.),a)/2.;
    }
	return b;
}
float rand(float co){
    return fract(sin((co*24.9898)+Seed)*43758.5453);
}
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float apow(float a,float b) { return pow(abs(a),b)*sign(b); }
vec3 pow3(vec3 a,vec3 b) { return vec3(apow(a.r,b.r),apow(a.g,b.g),apow(a.b,b.b)); }
float smooth_mix(float a,float b,float c) { return mix(a,b,sigmoid(c,2.)); }
float random(vec2 co, float shft){
    co += 10.;
    return smooth_mix(fract(sin(dot(co.xy ,vec2(12.9898+(floor(shft)*.5),78.233+Seed))) * 43758.5453),fract(sin(dot(co.xy ,vec2(12.9898+(floor(shft+1.)*.5),78.233+Seed))) * 43758.5453),fract(shft));
}
float smooth_random(vec2 co, float shft) {
	return smooth_mix(smooth_mix(random(floor(co),shft),random(floor(co+vec2(1.,0.)),shft),fract(co.x)),smooth_mix(random(floor(co+vec2(0.,1.)),shft),random(floor(co+vec2(1.,1.)),shft),fract(co.x)),fract(co.y));
}
vec4 blendedColor(vec2 p) {
    return mix(getFromColor(p), getToColor(p), sigmoid(progress,10.));
}
#define pi 3.14159265358979323
#define clamps(x) clamp(x,0.,1.)

vec4 transition(vec2 p) {
  vec3 f = vec3(0.);
  for (float i = 0.; i < 13.; i++) {
    f += sin(((p.x*rand(i)*6.)+(progress*8.))+rand(i+1.43))*sin(((p.y*rand(i+4.4)*6.)+(progress*6.))+rand(i+2.4));
    f += 1.-clamps(length(p-vec2(smooth_random(vec2(progress*1.3),i+1.),smooth_random(vec2(progress*.5),i+6.25)))*mix(20.,70.,rand(i)));
  }
  f += 4.;
  f /= 11.;
  f = pow3(f*vec3(1.,0.7,0.6),vec3(1.,2.-sin(progress*pi),1.3));
  f *= sin(progress*pi);
  
  p -= .5;
  p *= 1.+(smooth_random(vec2(progress*5.),6.3)*sin(progress*pi)*.05);
  p += .5;
  
  vec4 blurred_image = vec4(0.);
  float bluramount = sin(progress*pi)*.03;
  #define repeats  50.
  for (float i = 0.; i < repeats; i++) { 
      vec2 q = vec2(cos(degrees((i/repeats)*360.)),sin(degrees((i/repeats)*360.))) *  (rand(vec2(i,p.x+p.y))+bluramount); 
      vec2 uv2 = p+(q*bluramount);
      blurred_image += blendedColor(uv2);
  }
  blurred_image /= repeats;
  
  return blurred_image+vec4(f,0.);
}
`,author:"Anastasia Dunbar",license:"MIT",description:"Glowing film-burn light leaks wash over the image and reveal the incoming one",tags:["burn","film","light-leak"],params:{Seed:{type:"float",default:2.31,description:"Random seed"}},textures:[],createdAt:"Wed, 21 Feb 2018 20:52:13 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Fold",paramsTypes:{},defaultParams:{},glsl:`// Author: nwoeanhinnogaehr
// License: MIT
// Description: The incoming image unfolds from the left while the outgoing one folds away to the right
// Tags: fold, slide, horizontal
// Ported from https://gist.github.com/nwoeanhinnogaehr/f6fc39f4cfcbb97f96a6

vec4 transition(vec2 uv) {
  // Only sample the visible side: the other one divides by zero at progress 0 and 1.
  if (progress == 0.0 || uv.x > progress) return getFromColor((uv - vec2(progress, 0.0)) / vec2(1.0 - progress, 1.0));
  return getToColor(uv / vec2(progress, 1.0));
}
`,author:"nwoeanhinnogaehr",license:"MIT",description:"The incoming image unfolds from the left while the outgoing one folds away to the right",tags:["fold","slide","horizontal"],params:{},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Sat, 10 Oct 2026 11:26:01 +0200"},{name:"GlitchDisplace",paramsTypes:{},defaultParams:{},glsl:`// Author: Matt DesLauriers
// License: MIT
// Description: Blocks of the image are displaced in a glitch that flashes into the incoming image
// Tags: glitch, displace

float random(vec2 co)
{
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}
float voronoi( in vec2 x ) {
    vec2 p = floor( x );
    vec2 f = fract( x );
    float res = 8.0;
    for( float j=-1.; j<=1.; j++ )
    for( float i=-1.; i<=1.; i++ ) {
        vec2  b = vec2( i, j );
        vec2  r = b - f + random( p + b );
        float d = dot( r, r );
        res = min( res, d );
    }
    return sqrt( res );
}

vec2 displace(vec4 tex, vec2 texCoord, float dotDepth, float textureDepth, float strength) {
    float b = voronoi(.003 * texCoord + 2.0);
    float g = voronoi(0.2 * texCoord);
    float r = voronoi(texCoord - 1.0);
    vec4 dt = tex * 1.0;
    vec4 dis = dt * dotDepth + 1.0 - tex * textureDepth;

    dis.x = dis.x - 1.0 + textureDepth*dotDepth;
    dis.y = dis.y - 1.0 + textureDepth*dotDepth;
    dis.x *= strength;
    dis.y *= strength;
    vec2 res_uv = texCoord ;
    res_uv.x = res_uv.x + dis.x - 0.0;
    res_uv.y = res_uv.y + dis.y;
    return res_uv;
}

float ease1(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}
float ease2(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}



vec4 transition(vec2 uv) {
  vec2 p = uv.xy / vec2(1.0).xy;
  vec4 color1 = getFromColor(p);
  vec4 color2 = getToColor(p);
  vec2 disp = displace(color1, p, 0.33, 0.7, 1.0-ease1(progress));
  vec2 disp2 = displace(color2, p, 0.33, 0.5, ease2(progress));
  vec4 dColor1 = getToColor(disp);
  vec4 dColor2 = getFromColor(disp2);
  float val = ease1(progress);
  vec3 gray = vec3(dot(min(dColor2, dColor1).rgb, vec3(0.299, 0.587, 0.114)));
  dColor2 = vec4(gray, 1.0);
  dColor2 *= 2.0;
  color1 = mix(color1, dColor2, smoothstep(0.0, 0.5, progress));
  color2 = mix(color2, dColor1, smoothstep(1.0, 0.5, progress));
  return mix(color1, color2, val);
  //gl_FragColor = mix(gl_FragColor, dColor, smoothstep(0.0, 0.5, progress));

   //gl_FragColor = mix(texture2D(from, p), texture2D(to, p), progress);
}
`,author:"Matt DesLauriers",license:"MIT",description:"Blocks of the image are displaced in a glitch that flashes into the incoming image",tags:["glitch","displace"],params:{},textures:[],createdAt:"Tue, 30 May 2017 14:53:04 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"GlitchMemories",paramsTypes:{},defaultParams:{},glsl:`// Author: Gunnar Roth
// based on work from natewave
// License: MIT
// Description: A crossfade with glitchy, color-shifted blocks
// Tags: glitch, chromatic, blend
vec4 transition(vec2 p) {
  vec2 block = floor(p.xy / vec2(16));
  vec2 uv_noise = block / vec2(64);
  uv_noise += floor(vec2(progress) * vec2(1200.0, 3500.0)) / vec2(64);
  vec2 dist = progress > 0.0 ? (fract(uv_noise) - 0.5) * 0.3 *(1.0 -progress) : vec2(0.0);
  vec2 red = p + dist * 0.2;
  vec2 green = p + dist * .3;
  vec2 blue = p + dist * .5;

  return vec4(mix(getFromColor(red), getToColor(red), progress).r,mix(getFromColor(green), getToColor(green), progress).g,mix(getFromColor(blue), getToColor(blue), progress).b,1.0);
}

`,author:"Gunnar Roth",license:"MIT",description:"A crossfade with glitchy, color-shifted blocks",tags:["glitch","chromatic","blend"],params:{},textures:[],createdAt:"Wed, 21 Feb 2018 00:52:15 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"GridFlip",paramsTypes:{size:"ivec2",pause:"float",dividerWidth:"float",bgcolor:"vec4",randomness:"float"},defaultParams:{size:[4,4],pause:.1,dividerWidth:.05,bgcolor:[0,0,0,1],randomness:.1},glsl:`// License: MIT
// Author: TimDonselaar
// Description: The image splits into a grid of tiles that flip one by one to the incoming image
// Tags: grid, tiles, flip
// ported by gre from https://gist.github.com/TimDonselaar/9bcd1c4b5934ba60087bdb55c2ea92e5

// @param Number of tiles (columns, rows)
uniform ivec2 size; // = ivec2(4)
uniform float pause; // = 0.1
uniform float dividerWidth; // = 0.05
// @color Color behind the tiles
uniform vec4 bgcolor; // = vec4(0.0, 0.0, 0.0, 1.0)
uniform float randomness; // = 0.1
 
float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float getDelta(vec2 p) {
  vec2 rectanglePos = floor(vec2(size) * p);
  vec2 rectangleSize = vec2(1.0 / vec2(size).x, 1.0 / vec2(size).y);
  float top = rectangleSize.y * (rectanglePos.y + 1.0);
  float bottom = rectangleSize.y * rectanglePos.y;
  float left = rectangleSize.x * rectanglePos.x;
  float right = rectangleSize.x * (rectanglePos.x + 1.0);
  float minX = min(abs(p.x - left), abs(p.x - right));
  float minY = min(abs(p.y - top), abs(p.y - bottom));
  return min(minX, minY);
}

float getDividerSize() {
  vec2 rectangleSize = vec2(1.0 / vec2(size).x, 1.0 / vec2(size).y);
  return min(rectangleSize.x, rectangleSize.y) * dividerWidth;
}

vec4 transition(vec2 p) {
  if(progress < pause) {
    float currentProg = progress / pause;
    float a = 1.0;
    if(getDelta(p) < getDividerSize()) {
      a = 1.0 - currentProg;
    }
    return mix(bgcolor, getFromColor(p), a);
  }
  else if(progress < 1.0 - pause){
    if(getDelta(p) < getDividerSize()) {
      return bgcolor;
    } else {
      float currentProg = (progress - pause) / (1.0 - pause * 2.0);
      vec2 q = p;
      vec2 rectanglePos = floor(vec2(size) * q);
      
      float r = rand(rectanglePos) - randomness;
      float cp = smoothstep(0.0, 1.0 - r, currentProg);
    
      float rectangleSize = 1.0 / vec2(size).x;
      float delta = rectanglePos.x * rectangleSize;
      float offset = rectangleSize / 2.0 + delta;
      
      p.x = (p.x - offset)/abs(cp - 0.5)*0.5 + offset;
      vec4 a = getFromColor(p);
      vec4 b = getToColor(p);
      
      float s = step(abs(vec2(size).x * (q.x - delta) - 0.5), abs(cp - 0.5));
      return mix(bgcolor, mix(b, a, step(cp, 0.5)), s);
    }
  }
  else {
    float currentProg = (progress - 1.0 + pause) / pause;
    float a = 1.0;
    if(getDelta(p) < getDividerSize()) {
      a = currentProg;
    }
    return mix(bgcolor, getToColor(p), a);
  }
}
`,author:"TimDonselaar",license:"MIT",description:"The image splits into a grid of tiles that flip one by one to the incoming image",tags:["grid","tiles","flip"],params:{size:{type:"ivec2",default:[4,4],description:"Number of tiles (columns, rows)"},pause:{type:"float",default:.1},dividerWidth:{type:"float",default:.05},bgcolor:{type:"vec4",default:[0,0,0,1],color:!0,description:"Color behind the tiles"},randomness:{type:"float",default:.1}},textures:[],createdAt:"Mon, 12 Jun 2017 11:32:51 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"HSVfade",paramsTypes:{},defaultParams:{},glsl:`// Author: nwoeanhinnogaehr
// License: MIT
// Description: A crossfade through the HSV color space that cycles through hues
// Tags: fade, color, hue
// Ported from https://gist.github.com/nwoeanhinnogaehr/b185145363d65751009b

// HSV functions from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl

vec3 hsv2rgb(vec3 c) {
  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 rgb2hsv(vec3 c) {
  const vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 0.001)), d / (q.x + 0.001), q.x);
}

vec4 transition(vec2 uv) {
  vec3 a = rgb2hsv(getFromColor(uv).rgb);
  vec3 b = rgb2hsv(getToColor(uv).rgb);
  vec3 m = mix(a, b, progress);
  return vec4(hsv2rgb(m), 1.0);
}
`,author:"nwoeanhinnogaehr",license:"MIT",description:"A crossfade through the HSV color space that cycles through hues",tags:["fade","color","hue"],params:{},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"HorizontalClose",paramsTypes:{},defaultParams:{},glsl:`// Author: martiniti
// License: MIT
// Description: The incoming image closes in from the top and bottom edges toward the middle
// Tags: wipe, split

vec4 transition (vec2 uv) {

  float s = 2.0 - abs((uv.y - 0.5) / (progress - 1.0)) - 2.0 * progress;
  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    smoothstep(0.5, 0.0, s)
  ); 
}
`,author:"martiniti",license:"MIT",description:"The incoming image closes in from the top and bottom edges toward the middle",tags:["wipe","split"],params:{},textures:[],createdAt:"Tue, 4 Apr 2023 10:35:23 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"HorizontalOpen",paramsTypes:{},defaultParams:{},glsl:`// Author: martiniti
// License: MIT
// Description: The incoming image opens from a line in the middle toward the top and bottom edges
// Tags: wipe, split

vec4 transition (vec2 uv) {
  
  float regress = 1.0 - progress;

  float s = 2.0 - abs((uv.y - 0.5) / (regress - 1.0)) - 2.0 * regress;
  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    smoothstep(0.0, 0.5, s)
  );
}
`,author:"martiniti",license:"MIT",description:"The incoming image opens from a line in the middle toward the top and bottom edges",tags:["wipe","split"],params:{},textures:[],createdAt:"Tue, 4 Apr 2023 10:35:30 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"InvertedPageCurl",paramsTypes:{},defaultParams:{},glsl:`// Author: Hewlett-Packard
// License: BSD 3 Clause
// Description: The outgoing image curls away like a page, revealing the incoming one
// Tags: page, curl, 3d
// Adapted by Sergey Kosarevsky from:
// http://rectalogic.github.io/webvfx/examples_2transition-shader-pagecurl_8html-example.html

/*
Copyright (c) 2010 Hewlett-Packard Development Company, L.P. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
     copyright notice, this list of conditions and the following disclaimer
     in the documentation and/or other materials provided with the
     distribution.
   * Neither the name of Hewlett-Packard nor the names of its
     contributors may be used to endorse or promote products derived from
     this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
in vec2 texCoord;
*/

const float MIN_AMOUNT = -0.16;
const float MAX_AMOUNT = 1.5;

const float PI = 3.141592653589793;

const float scale = 512.0;
const float sharpness = 3.0;

const float cylinderRadius = 1.0 / PI / 2.0;

// These depend on the progress uniform and must be computed per-fragment.
// Global initializers with uniforms are invalid in GLSL ES and fail on Mesa.
float amount;
float cylinderCenter;
float cylinderAngle;

vec3 hitPoint(float hitAngle, float yc, vec3 point, mat3 rrotation)
{
        float hitPoint = hitAngle / (2.0 * PI);
        point.y = hitPoint;
        return rrotation * point;
}

vec4 antiAlias(vec4 color1, vec4 color2, float distanc)
{
        distanc *= scale;
        if (distanc < 0.0) return color2;
        if (distanc > 2.0) return color1;
        float dd = pow(1.0 - distanc / 2.0, sharpness);
        return ((color2 - color1) * dd) + color1;
}

float distanceToEdge(vec3 point)
{
        float dx = abs(point.x > 0.5 ? 1.0 - point.x : point.x);
        float dy = abs(point.y > 0.5 ? 1.0 - point.y : point.y);
        if (point.x < 0.0) dx = -point.x;
        if (point.x > 1.0) dx = point.x - 1.0;
        if (point.y < 0.0) dy = -point.y;
        if (point.y > 1.0) dy = point.y - 1.0;
        if ((point.x < 0.0 || point.x > 1.0) && (point.y < 0.0 || point.y > 1.0)) return sqrt(dx * dx + dy * dy);
        return min(dx, dy);
}

vec4 seeThrough(float yc, vec2 p, mat3 rotation, mat3 rrotation)
{
        float hitAngle = PI - (acos(clamp(yc / cylinderRadius, -1.0, 1.0)) - cylinderAngle);
        vec3 point = hitPoint(hitAngle, yc, rotation * vec3(p, 1.0), rrotation);
        if (yc <= 0.0 && (point.x < 0.0 || point.y < 0.0 || point.x > 1.0 || point.y > 1.0))
        {
            return getToColor(p);
        }

        if (yc > 0.0) return getFromColor(p);

        vec4 color = getFromColor(point.xy);
        vec4 tcolor = vec4(0.0);

        return antiAlias(color, tcolor, distanceToEdge(point));
}

vec4 seeThroughWithShadow(float yc, vec2 p, vec3 point, mat3 rotation, mat3 rrotation)
{
        float shadow = distanceToEdge(point) * 30.0;
        shadow = (1.0 - shadow) / 3.0;

        if (shadow < 0.0) shadow = 0.0; else shadow *= amount;

        vec4 shadowColor = seeThrough(yc, p, rotation, rrotation);
        shadowColor.r -= shadow;
        shadowColor.g -= shadow;
        shadowColor.b -= shadow;

        return shadowColor;
}

vec4 backside(float yc, vec3 point)
{
        vec4 color = getFromColor(point.xy);
        float gray = (color.r + color.b + color.g) / 15.0;
        gray += (8.0 / 10.0) * (pow(max(0.0, 1.0 - abs(yc / cylinderRadius)), 2.0 / 10.0) / 2.0 + (5.0 / 10.0));
        color.rgb = vec3(gray);
        return color;
}

vec4 behindSurface(vec2 p, float yc, vec3 point, mat3 rrotation)
{
        float safeAmount = amount >= 0.0 ? max(amount, 1e-4) : min(amount, -1e-4);
        float shado = (1.0 - ((-cylinderRadius - yc) / safeAmount * 7.0)) / 6.0;
        shado *= 1.0 - abs(point.x - 0.5);

        yc = (-cylinderRadius - cylinderRadius - yc);

        float hitAngle = (acos(clamp(yc / cylinderRadius, -1.0, 1.0)) + cylinderAngle) - PI;
        point = hitPoint(hitAngle, yc, point, rrotation);

        if (yc < 0.0 && point.x >= 0.0 && point.y >= 0.0 && point.x <= 1.0 && point.y <= 1.0 && (hitAngle < PI || amount > 0.5))
        {
                float dx = point.x - 0.5;
                float dy = point.y - 0.5;
                shado = 1.0 - (sqrt(dx * dx + dy * dy) / (71.0 / 100.0));
                float nyc = -yc / cylinderRadius;
                shado *= nyc * nyc * nyc;
                shado *= 0.5;
        }
        else
        {
                shado = 0.0;
        }
        return vec4(getToColor(p).rgb - shado, 1.0);
}

vec4 transition(vec2 p) {
  amount = progress * (MAX_AMOUNT - MIN_AMOUNT) + MIN_AMOUNT;
  cylinderCenter = amount;
  cylinderAngle = 2.0 * PI * amount;

  const float angle = 100.0 * PI / 180.0;
        float c = cos(-angle);
        float s = sin(-angle);

        mat3 rotation = mat3( c, s, 0,
                                                                -s, c, 0,
                                                                -0.801, 0.8900, 1
                                                                );
        c = cos(angle);
        s = sin(angle);

        mat3 rrotation = mat3(	c, s, 0,
                                                                        -s, c, 0,
                                                                        0.98500, 0.985, 1
                                                                );

        vec3 point = rotation * vec3(p, 1.0);

        float yc = point.y - cylinderCenter;

        if (yc < -cylinderRadius)
        {
                // Behind surface
                return behindSurface(p,yc, point, rrotation);
        }

        if (yc > cylinderRadius)
        {
                // Flat surface
                return getFromColor(p);
        }

        float hitAngle = (acos(clamp(yc / cylinderRadius, -1.0, 1.0)) + cylinderAngle) - PI;

        float hitAngleMod = mod(hitAngle, 2.0 * PI);
        if ((hitAngleMod > PI && amount < 0.5) || (hitAngleMod > PI/2.0 && amount < 0.0))
        {
                return seeThrough(yc, p, rotation, rrotation);
        }

        point = hitPoint(hitAngle, yc, point, rrotation);

        if (point.x < 0.0 || point.y < 0.0 || point.x > 1.0 || point.y > 1.0)
        {
                return seeThroughWithShadow(yc, p, point, rotation, rrotation);
        }

        vec4 color = backside(yc, point);

        vec4 otherColor;
        if (yc < 0.0)
        {
                float dx2 = point.x - 0.5;
                float dy2 = point.y - 0.5;
                float shado = 1.0 - (sqrt(dx2 * dx2 + dy2 * dy2) / 0.71);
                float nyc2 = -yc / cylinderRadius;
                shado *= nyc2 * nyc2 * nyc2;
                shado *= 0.5;
                otherColor = vec4(0.0, 0.0, 0.0, shado);
        }
        else
        {
                otherColor = getFromColor(p);
        }

        color = antiAlias(color, otherColor, cylinderRadius - abs(yc));

        vec4 cl = seeThroughWithShadow(yc, p, point, rotation, rrotation);
        float dist = distanceToEdge(point);

        return antiAlias(color, cl, dist);
}
`,author:"Hewlett-Packard",license:"BSD 3 Clause",description:"The outgoing image curls away like a page, revealing the incoming one",tags:["page","curl","3d"],params:{},textures:[],createdAt:"Wed, 21 Feb 2018 01:13:49 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"LeftRight",paramsTypes:{},defaultParams:{},glsl:`// Author: zhmy
// License: MIT
// Description: The outgoing image shrinks away to the left while the incoming one slides in from the right
// Tags: slide, zoom, horizontal

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
    return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
    vec2 spfr,spto = vec2(-1.);

    float size = mix(1.0, 3.0, progress*0.2);
    spto = (uv + vec2(-0.5,-0.5))*vec2(size,size)+vec2(0.5,0.5);
    spfr = (uv - vec2(1.-progress, 0.0));
    if(inBounds(spfr)){
        return getToColor(spfr);
    }else if(inBounds(spto)){
        return getFromColor(spto) * (1.0 - progress);
    } else{
        return black;
    }
}`,author:"zhmy",license:"MIT",description:"The outgoing image shrinks away to the left while the incoming one slides in from the right",tags:["slide","zoom","horizontal"],params:{},textures:[],createdAt:"Thu, 17 Dec 2020 11:50:34 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"LinearBlur",paramsTypes:{intensity:"float"},defaultParams:{intensity:.1},glsl:`// Author: gre
// License: MIT
// Description: A crossfade through a blur
// Tags: blur, blend
// @param Amount of blur
uniform float intensity; // = 0.1
const int passes = 6;

vec4 transition(vec2 uv) {
    vec4 c1 = vec4(0.0);
    vec4 c2 = vec4(0.0);

    float disp = intensity*(0.5-distance(0.5, progress));
    for (int xi=0; xi<passes; xi++)
    {
        float x = float(xi) / float(passes) - 0.5;
        for (int yi=0; yi<passes; yi++)
        {
            float y = float(yi) / float(passes) - 0.5;
            vec2 v = vec2(x,y);
            float d = disp;
            c1 += getFromColor( uv + d*v);
            c2 += getToColor( uv + d*v);
        }
    }
    c1 /= float(passes*passes);
    c2 /= float(passes*passes);
    return mix(c1, c2, progress);
}
`,author:"gre",license:"MIT",description:"A crossfade through a blur",tags:["blur","blend"],params:{intensity:{type:"float",default:.1,description:"Amount of blur"}},textures:[],createdAt:"Fri, 23 Feb 2018 15:18:22 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Mosaic",paramsTypes:{endx:"int",endy:"int"},defaultParams:{endx:2,endy:-1},glsl:`// License: MIT
// Author: Xaychru
// Description: The view pans across a mosaic of rotated tiles from both images and settles on the incoming one
// Tags: mosaic, tiles, zoom
// ported by gre from https://gist.github.com/Xaychru/130bb7b7affedbda9df5

#define PI 3.14159265358979323
#define POW2(X) X*X
#define POW3(X) X*X*X
uniform int endx; // = 2
uniform int endy; // = -1

float Rand(vec2 v) {
  return fract(sin(dot(v.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
vec2 Rotate(vec2 v, float a) {
  mat2 rm = mat2(cos(a), -sin(a),
                 sin(a), cos(a));
  return rm*v;
}
float CosInterpolation(float x) {
  return -cos(x*PI)/2.+.5;
}
vec4 transition(vec2 uv) {
  vec2 p = uv.xy / vec2(1.0).xy - .5;
  vec2 rp = p;
  float rpr = (progress*2.-1.);
  float z = -(rpr*rpr*2.) + 3.;
  float az = abs(z);
  rp *= az;
  rp += mix(vec2(.5, .5), vec2(float(endx) + .5, float(endy) + .5), POW2(CosInterpolation(progress)));
  vec2 mrp = mod(rp, 1.);
  vec2 crp = rp;
  bool onEnd = int(floor(crp.x))==endx&&int(floor(crp.y))==endy;
  if(!onEnd) {
    float ang = float(int(Rand(floor(crp))*4.))*.5*PI;
    mrp = vec2(.5) + Rotate(mrp-vec2(.5), ang);
  }
  if(onEnd || Rand(floor(crp))>.5) {
    return getToColor(mrp);
  } else {
    return getFromColor(mrp);
  }
}
`,author:"Xaychru",license:"MIT",description:"The view pans across a mosaic of rotated tiles from both images and settles on the incoming one",tags:["mosaic","tiles","zoom"],params:{endx:{type:"int",default:2},endy:{type:"int",default:-1}},textures:[],createdAt:"Mon, 12 Jun 2017 10:26:51 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Overexposure",paramsTypes:{strength:"float"},defaultParams:{strength:.6},glsl:`// Author: Ben Zhang
// License: MIT
// Description: A crossfade through a washed-out, overexposed white
// Tags: flash, light, fade

// @param Amount of overexposure
uniform float strength; // = 0.6
const float PI = 3.141592653589793;

vec4 transition (vec2 uv) {
  vec4 from = getFromColor(uv);
  vec4 to = getToColor(uv);

  // Multipliers
  float from_m = 1.0 - progress + sin(PI * progress) * strength;
  float to_m = progress + sin(PI * progress) * strength;
  
  return vec4(
    from.r * from.a * from_m + to.r * to.a * to_m,
    from.g * from.a * from_m + to.g * to.a * to_m,
    from.b * from.a * from_m + to.b * to.a * to_m,
    mix(from.a, to.a, progress)
  );
}
`,author:"Ben Zhang",license:"MIT",description:"A crossfade through a washed-out, overexposed white",tags:["flash","light","fade"],params:{strength:{type:"float",default:.6,description:"Amount of overexposure"}},textures:[],createdAt:"Tue, 15 Mar 2022 20:21:15 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"PolkaDotsCurtain",paramsTypes:{dots:"float",center:"vec2"},defaultParams:{dots:20,center:[0,0]},glsl:`// Author: bobylito
// License: MIT
// Description: The incoming image appears through growing polka dots
// Tags: dots, pattern
const float SQRT_2 = 1.414213562373;
// @param Number of dots across the image
uniform float dots; // = 20.0
uniform vec2 center; // = vec2(0, 0)

vec4 transition(vec2 uv) {
  bool nextImage = distance(fract(uv * dots), vec2(0.5, 0.5)) < ( progress / distance(uv, center));
  return nextImage ? getToColor(uv) : getFromColor(uv);
}
`,author:"bobylito",license:"MIT",description:"The incoming image appears through growing polka dots",tags:["dots","pattern"],params:{dots:{type:"float",default:20,description:"Number of dots across the image"},center:{type:"vec2",default:[0,0]}},textures:[],createdAt:"Tue, 20 Feb 2018 23:41:45 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"PuzzleRight",paramsTypes:{size:"ivec2",pause:"float",dividerWidth:"float"},defaultParams:{size:[4,4],pause:.1,dividerWidth:.005},glsl:`// Author: JustKirillS
// License: MIT
// Description: The image splits into a grid of tiles that flip one by one to the incoming image
// Tags: grid, tiles, flip
// Ported from https://gist.github.com/JustKirillS/714f095318834f4d2375de872c53af1e

uniform ivec2 size; // = ivec2(4, 4)
uniform float pause; // = 0.1
uniform float dividerWidth; // = 0.005

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float getDelta(vec2 p) {
  vec2 rectangleSize = 1.0 / vec2(size);
  vec2 rectanglePos = floor(vec2(size) * p);
  float top = rectangleSize.y * (rectanglePos.y + 1.0);
  float bottom = rectangleSize.y * rectanglePos.y;
  float left = rectangleSize.x * rectanglePos.x;
  float right = rectangleSize.x * (rectanglePos.x + 1.0);
  float minX = min(abs(p.x - left), abs(p.x - right));
  float minY = min(abs(p.y - top), abs(p.y - bottom));
  return min(minX, minY);
}

vec4 transition(vec2 uv) {
  if (progress < pause) {
    float currentProg = progress / pause;
    float a = 1.0;
    if (getDelta(uv) < dividerWidth) { a = 1.0 - currentProg; }
    return mix(vec4(0.0, 0.0, 0.0, 1.0), getFromColor(uv), a);
  } else if (progress < 1.0 - pause) {
    if (getDelta(uv) < dividerWidth) {
      return vec4(0.0, 0.0, 0.0, 1.0);
    }
    float currentProg = (progress - pause) / (1.0 - pause * 2.0);
    vec2 rectanglePos = floor(vec2(size) * uv);
    float r = rand(rectanglePos) - 0.1;
    float cp = smoothstep(0.0, 1.0 - r, currentProg);
    float rectangleSize = 1.0 / float(size.x);
    float delta = rectanglePos.x * rectangleSize;
    float offset = rectangleSize / 2.0 + delta;
    vec2 p = uv;
    p.x = (p.x - offset) / abs(cp - 0.5) * 0.5 + offset;
    vec4 a = getFromColor(p);
    vec4 b = getToColor(p);
    float s = step(abs(float(size.x) * (uv.x - delta) - 0.5), abs(cp - 0.5));
    return vec4(mix(b, a, step(cp, 0.5)).rgb * s, 1.0);
  } else {
    float currentProg = (progress - 1.0 + pause) / pause;
    float a = 1.0;
    if (getDelta(uv) < dividerWidth) { a = currentProg; }
    return mix(vec4(0.0, 0.0, 0.0, 1.0), getToColor(uv), a);
  }
}
`,author:"JustKirillS",license:"MIT",description:"The image splits into a grid of tiles that flip one by one to the incoming image",tags:["grid","tiles","flip"],params:{size:{type:"ivec2",default:[4,4]},pause:{type:"float",default:.1},dividerWidth:{type:"float",default:.005}},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"Radial",paramsTypes:{smoothness:"float"},defaultParams:{smoothness:1},glsl:`// License: MIT
// Author: Xaychru
// Description: A radial wipe that sweeps around the center like a clock hand
// Tags: wipe, radial, clock
// ported by gre from https://gist.github.com/Xaychru/ce1d48f0ce00bb379750

uniform float smoothness; // = 1.0

const float PI = 3.141592653589;

vec4 transition(vec2 p) {
  vec2 rp = p*2.-1.;
  return mix(
    getToColor(p),
    getFromColor(p),
    smoothstep(0., smoothness, atan(rp.y,rp.x) - (progress-.5) * PI * 2.5)
  );
}
`,author:"Xaychru",license:"MIT",description:"A radial wipe that sweeps around the center like a clock hand",tags:["wipe","radial","clock"],params:{smoothness:{type:"float",default:1}},textures:[],createdAt:"Mon, 12 Jun 2017 10:36:24 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Rectangle",paramsTypes:{bgcolor:"vec4"},defaultParams:{bgcolor:[0,0,0,1]},glsl:`// Author: martiniti
// License: MIT
// Description: A rectangle grows from the center to cover the outgoing image, then shrinks to reveal the incoming one
// Tags: box, shape, iris

// @color Color of the rectangle
uniform vec4 bgcolor; // = vec4(0.0, 0.0, 0.0, 1.0)

vec4 transition(vec2 p) {
  float s = pow(2.0 * abs(progress - 0.5), 3.0);
  
   vec2 sq = p.xy / vec2(1.0).xy;
   
    // bottom-left
    vec2 bl = step(vec2(abs(1. - 2.*progress)), sq + .25);
    float dist = bl.x * bl.y;

    // top-right
    vec2 tr = step(vec2(abs(1. - 2.*progress)), 1.25-sq);
    dist *= 1. * tr.x * tr.y;
  
  return mix(
    progress < 0.5 ? getFromColor(p) : getToColor(p),
    bgcolor,
    step(s, dist)
  );
  
}
`,author:"martiniti",license:"MIT",description:"A rectangle grows from the center to cover the outgoing image, then shrinks to reveal the incoming one",tags:["box","shape","iris"],params:{bgcolor:{type:"vec4",default:[0,0,0,1],color:!0,description:"Color of the rectangle"}},textures:[],createdAt:"Tue, 4 Apr 2023 10:29:59 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"RectangleCrop",paramsTypes:{bgcolor:"vec4"},defaultParams:{bgcolor:[0,0,0,1]},glsl:`// License: MIT
// Author: martiniti
// Description: The outgoing image shrinks into a small rectangle over a background color, then the incoming one grows from it
// Tags: box, iris, zoom

// @color Background color
uniform vec4 bgcolor; // = vec4(0.0, 0.0, 0.0, 1.0)

vec4 transition(vec2 uv) {
  
  float s = pow(2.0 * abs(progress - 0.5), 3.0);
              
  vec2 q = uv.xy / vec2(1.0).xy;
  
  // bottom-left
  vec2 bl = step(vec2(1.0 - 2.0*abs(progress - 0.5)), q + 0.25);
  
  // top-right
  vec2 tr = step(vec2(1.0 - 2.0*abs(progress - 0.5)), 1.25 - q);
  
  float dist = length(1.0 - bl.x * bl.y * tr.x * tr.y);
  
  return mix(
    progress < 0.5 ? getFromColor(uv) : getToColor(uv),
    bgcolor,
    step(s, dist)
  );
  
}
`,author:"martiniti",license:"MIT",description:"The outgoing image shrinks into a small rectangle over a background color, then the incoming one grows from it",tags:["box","iris","zoom"],params:{bgcolor:{type:"vec4",default:[0,0,0,1],color:!0,description:"Background color"}},textures:[],createdAt:"Tue, 4 Apr 2023 10:30:36 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Revolve_Left",paramsTypes:{center:"vec2",direction:"float",maxRotation:"float",peakZoom:"float",swirl:"float",barrel:"float",motionBlur:"float",switchStart:"float",switchEnd:"float",shadow:"float"},defaultParams:{center:[.46,.52],direction:-1,maxRotation:1.95,peakZoom:2.22,swirl:2.85,barrel:.38,motionBlur:1,switchStart:.3,switchEnd:.5,shadow:.16},glsl:`// Author: bread
// License: MIT
// Description: The outgoing image swirls and zooms with motion blur into the incoming one
// Tags: swirl, zoom, rotate, blur
// gl-transitions v1 compatible

// @param Center of the swirl
uniform vec2 center;       // = vec2(0.46, 0.52)
uniform float direction;   // = -1.0
uniform float maxRotation; // = 1.95
uniform float peakZoom;    // = 2.22
uniform float swirl;       // = 2.85
uniform float barrel;      // = 0.38
uniform float motionBlur;  // = 1.0
uniform float switchStart; // = 0.30
uniform float switchEnd;   // = 0.50
uniform float shadow;      // = 0.16

float sat(float x) {
  return clamp(x, 0.0, 1.0);
}

float ease(float x) {
  x = sat(x);
  return x * x * (3.0 - 2.0 * x);
}

float revolveEnvelope(float t) {
  float rise = ease((t - 0.10) / 0.33);
  float fall = 1.0 - ease((t - 0.43) / 0.29);
  return rise * fall;
}

vec2 rotate2(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

vec2 warpUv(vec2 uv, float t) {
  float e = revolveEnvelope(t);

  vec2 p = uv - center;
  p.x *= ratio;

  float r = length(p);
  float edgeSpin = maxRotation * e;
  float coreSpin = swirl * e * pow(1.0 - sat(r / 0.96), 1.55);
  float visibleAngle = direction * (edgeSpin + coreSpin);

  p = rotate2(p, -visibleAngle);

  float sc = 1.0 + (peakZoom - 1.0) * pow(e, 0.85);
  p /= sc;

  float rr = length(p);
  p *= 1.0 + barrel * e * rr * rr * 2.8;

  p.x /= ratio;
  return clamp(p + center, vec2(0.001), vec2(0.999));
}

vec4 sampleRevolve(vec2 uv, float t) {
  vec2 p = warpUv(uv, t);
  float reveal = smoothstep(switchStart, switchEnd, t);
  return mix(getFromColor(p), getToColor(p), reveal);
}

vec4 transition(vec2 uv) {
  if (progress <= 0.0) return getFromColor(uv);
  if (progress >= 1.0) return getToColor(uv);

  float e = revolveEnvelope(progress);
  float span = 0.060 * motionBlur * e;

  vec4 color = vec4(0.0);
  float total = 0.0;

  for (int i = -8; i <= 8; i++) {
    float x = float(i) / 8.0;
    float w = 1.0 - abs(x);
    w = w * w + 0.01;

    float t = sat(progress + x * span);
    color += sampleRevolve(uv, t) * w;
    total += w;
  }

  color /= total;

  vec2 q = uv - vec2(0.5);
  q.x *= ratio;
  float vignette = 1.0 - shadow * e * smoothstep(0.35, 0.95, length(q));
  color.rgb *= vignette;

  return color;
}
`,author:"bread",license:"MIT",description:"The outgoing image swirls and zooms with motion blur into the incoming one",tags:["swirl","zoom","rotate","blur"],params:{center:{type:"vec2",default:[.46,.52],description:"Center of the swirl"},direction:{type:"float",default:-1},maxRotation:{type:"float",default:1.95},peakZoom:{type:"float",default:2.22},swirl:{type:"float",default:2.85},barrel:{type:"float",default:.38},motionBlur:{type:"float",default:1},switchStart:{type:"float",default:.3},switchEnd:{type:"float",default:.5},shadow:{type:"float",default:.16}},textures:[],createdAt:"Wed, 10 Jun 2026 09:26:47 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Rolls",paramsTypes:{type:"int",RotDown:"bool"},defaultParams:{type:0,RotDown:!1},glsl:`// Author: Mark Craig
// mrmcsoftware on github and youtube ( http://www.youtube.com/MrMcSoftware )
// License: MIT
// Description: The outgoing image rolls away around a corner, revealing the incoming one
// Tags: rotate, roll

// Rolls Transition by Mark Craig (Copyright © 2022)

// @range(0, 3, 1) Corner to roll around
uniform int type; // = 0
// @param Roll the outgoing image down instead of up
uniform bool RotDown; // = false
// type (0-3): Rotate/Roll from which corner
// RotDown: if true rotate old image down, otherwise rotate old image up

#define M_PI 3.14159265358979323846

vec4 transition(vec2 uv)
{
float theta, c1, s1;
vec2 iResolution = vec2(ratio, 1.0);
vec2 uvi;
// I used if/else instead of switch in case it's an old GPU
if (type == 0) { theta = (RotDown ? M_PI : -M_PI) / 2.0 * progress; uvi.x = 1.0 - uv.x; uvi.y = uv.y; }
else if (type == 1) { theta = (RotDown ? M_PI : -M_PI) / 2.0 * progress; uvi = uv; }
else if (type == 2) { theta = (RotDown ? -M_PI : M_PI) / 2.0 * progress; uvi.x = uv.x; uvi.y = 1.0 - uv.y; }
else if (type == 3) { theta = (RotDown ? -M_PI : M_PI) / 2.0 * progress; uvi = 1.0 - uv; }
c1 = cos(theta); s1 = sin(theta);
vec2 uv2;
uv2.x = (uvi.x * iResolution.x * c1 - uvi.y * iResolution.y * s1);
uv2.y = (uvi.x * iResolution.x * s1 + uvi.y * iResolution.y * c1);
if ((uv2.x >= 0.0) && (uv2.x <= iResolution.x) && (uv2.y >= 0.0) && (uv2.y <= iResolution.y))
	{
	uv2 /= iResolution;
	if (type == 0) { uv2.x = 1.0 - uv2.x; }
	else if (type == 2) { uv2.y = 1.0 - uv2.y; }
	else if (type == 3) { uv2 = 1.0 - uv2; }
	return(getFromColor(uv2));
	}
return(getToColor(uv));
}
`,author:"Mark Craig",license:"MIT",description:"The outgoing image rolls away around a corner, revealing the incoming one",tags:["rotate","roll"],params:{type:{type:"int",default:0,min:0,max:3,step:1,description:"Corner to roll around"},RotDown:{type:"bool",default:!1,description:"Roll the outgoing image down instead of up"}},textures:[],createdAt:"Tue, 4 Apr 2023 03:31:55 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"RotateScaleVanish",paramsTypes:{FadeInSecond:"bool",ReverseEffect:"bool",ReverseRotation:"bool"},defaultParams:{FadeInSecond:!0,ReverseEffect:!1,ReverseRotation:!1},glsl:`// Author: Mark Craig
// mrmcsoftware on github and youtube ( http://www.youtube.com/MrMcSoftware )
// License: MIT
// Description: The outgoing image spins and shrinks away over the incoming one
// Tags: rotate, zoom, spin

// RotateScaleVanish Transition by Mark Craig (Copyright © 2022)

// @param Fade in the incoming image
uniform bool FadeInSecond; // = true
// @param Run the effect in reverse
uniform bool ReverseEffect; // = false
// @param Rotate the other way
uniform bool ReverseRotation; // = false

#define M_PI 3.14159265358979323846
#define _TWOPI 6.283185307179586476925286766559

vec4 transition(vec2 uv)
{
vec2 iResolution = vec2(ratio, 1.0);
float t = ReverseEffect ? 1.0 - progress : progress;
float theta = ReverseRotation ? _TWOPI * t : -_TWOPI * t;
float c1 = cos(theta);
float s1 = sin(theta);
float rad = max(0.00001, 1.0 - t);
float xc1 = (uv.x - 0.5) * iResolution.x;
float yc1 = (uv.y - 0.5) * iResolution.y;
float xc2 = (xc1 * c1 - yc1 * s1) / rad;
float yc2 = (xc1 * s1 + yc1 * c1) / rad;
vec2 uv2 = vec2(xc2 + iResolution.x / 2.0, yc2 + iResolution.y / 2.0);
vec4 col3;
vec4 ColorTo = ReverseEffect ? getFromColor(uv) : getToColor(uv);
if ((uv2.x >= 0.0) && (uv2.x <= iResolution.x) && (uv2.y >= 0.0) && (uv2.y <= iResolution.y))
	{
	uv2 /= iResolution;
	col3 = ReverseEffect ? getToColor(uv2) : getFromColor(uv2);
	}
else { col3 = FadeInSecond ? vec4(0.0, 0.0, 0.0, 1.0) : ColorTo; }
return((1.0 - t) * col3 + t * ColorTo); // could have used mix
}
`,author:"Mark Craig",license:"MIT",description:"The outgoing image spins and shrinks away over the incoming one",tags:["rotate","zoom","spin"],params:{FadeInSecond:{type:"bool",default:!0,description:"Fade in the incoming image"},ReverseEffect:{type:"bool",default:!1,description:"Run the effect in reverse"},ReverseRotation:{type:"bool",default:!1,description:"Rotate the other way"}},textures:[],createdAt:"Tue, 4 Apr 2023 03:31:48 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"SimpleFlip",paramsTypes:{},defaultParams:{},glsl:`// Author: nwoeanhinnogaehr
// License: MIT
// Description: The outgoing image flips around the vertical axis into the incoming one
// Tags: flip, horizontal
// Ported from https://gist.github.com/nwoeanhinnogaehr/408045772d255df97520

vec4 transition(vec2 uv) {
  vec2 q = uv;
  uv.x = (uv.x - 0.5) / abs(progress - 0.5) * 0.5 + 0.5;
  vec4 a = getFromColor(uv);
  vec4 b = getToColor(uv);
  return vec4(mix(a, b, step(0.5, progress)).rgb * step(abs(q.x - 0.5), abs(progress - 0.5)), 1.0);
}
`,author:"nwoeanhinnogaehr",license:"MIT",description:"The outgoing image flips around the vertical axis into the incoming one",tags:["flip","horizontal"],params:{},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"SimpleZoom",paramsTypes:{zoom_quickness:"float"},defaultParams:{zoom_quickness:.8},glsl:`// Author: 0gust1
// License: MIT
// Description: Zooms into the outgoing image, then fades to the incoming one
// Tags: zoom, fade

// @range(0.2, 1) Part of the transition spent zooming
uniform float zoom_quickness; // = 0.8
vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * (1.0-amount));	
}

vec4 transition (vec2 uv) {
  float nQuick = clamp(zoom_quickness,0.2,1.0);
  return mix(
    getFromColor(zoom(uv, smoothstep(0.0, nQuick, progress))),
    getToColor(uv),
   smoothstep(nQuick-0.2, 1.0, progress)
  );
}`,author:"0gust1",license:"MIT",description:"Zooms into the outgoing image, then fades to the incoming one",tags:["zoom","fade"],params:{zoom_quickness:{type:"float",default:.8,min:.2,max:1,description:"Part of the transition spent zooming"}},textures:[],createdAt:"Tue, 6 Mar 2018 00:43:47 +0100",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"SimpleZoomOut",paramsTypes:{zoom_quickness:"float",fade:"bool"},defaultParams:{zoom_quickness:.8,fade:!0},glsl:`// Author: Tianshuo
// License: MIT
// Description: The incoming image zooms out into place while fading in
// Tags: zoom, fade


// @range(0.2, 1) Part of the transition spent zooming
uniform float zoom_quickness; // = 0.8
// @param Fade instead of cutting to the incoming image
uniform bool fade; // = true
vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * (1.0-amount));	
}

vec4 transition (vec2 uv) {
  float nQuick = clamp(zoom_quickness,0.2,1.0);
  return mix(
    getFromColor(uv),
    getToColor(zoom(uv,1.-smoothstep(1.-nQuick, 1., progress))),
   fade?smoothstep(1.0-nQuick, 1., progress):(progress<1.0-nQuick?0.0:1.0)
  );
}
`,author:"Tianshuo",license:"MIT",description:"The incoming image zooms out into place while fading in",tags:["zoom","fade"],params:{zoom_quickness:{type:"float",default:.8,min:.2,max:1,description:"Part of the transition spent zooming"},fade:{type:"bool",default:!0,description:"Fade instead of cutting to the incoming image"}},textures:[],createdAt:"Sun, 29 Mar 2026 19:32:53 +0200",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"Slides",paramsTypes:{type:"int",In:"bool"},defaultParams:{type:0,In:!1},glsl:`// Author: Mark Craig
// mrmcsoftware on github and youtube ( http://www.youtube.com/MrMcSoftware )
// License: MIT
// Description: The outgoing image slides out, or the incoming one slides in, toward an edge, a corner or the center
// Tags: slide, directional

// Slides Transition by Mark Craig (Copyright © 2022)

uniform int type; // = 0
// @param Slide the incoming image in instead of the outgoing one out
uniform bool In; // = false
// type: slide to/from which edge, which corner, or center
// In: if true slide new image in, otherwise slide old image out

#define rad2 rad / 2.0

vec4 transition(vec2 uv)
{
vec2 uv0 = uv;
float rad = In ? progress : 1.0 - progress;
float xc1, yc1;
// I used if/else instead of switch in case it's an old GPU
if (type == 0) { xc1 = .5 - rad2; yc1 = 0.0; }
else if (type == 1) { xc1 = 1.0 - rad; yc1 = .5 - rad2; }
else if (type == 2) { xc1 = .5 - rad2; yc1 = 1.0 - rad; }
else if (type == 3) { xc1 = 0.0; yc1 = .5 - rad2; }
else if (type == 4) { xc1 = 1.0 - rad; yc1 = 0.0; }
else if (type == 5) { xc1 = 1.0 - rad; yc1 = 1.0 - rad; }
else if (type == 6) { xc1 = 0.0; yc1 = 1.0 - rad; }
else if (type == 7) { xc1 = 0.0; yc1 = 0.0; }
else if (type == 8) { xc1 = .5 - rad2; yc1 = .5 - rad2; }
uv.y = 1.0 - uv.y;
vec2 uv2;
if ((uv.x >= xc1) && (uv.x <= xc1 + rad) && (uv.y >= yc1) && (uv.y <= yc1 + rad))
	{
	uv2 = vec2((uv.x - xc1) / rad, 1.0 - (uv.y - yc1) / rad);
	return(In ? getToColor(uv2) : getFromColor(uv2));
	}
return(In ? getFromColor(uv0) : getToColor(uv0));
}
`,author:"Mark Craig",license:"MIT",description:"The outgoing image slides out, or the incoming one slides in, toward an edge, a corner or the center",tags:["slide","directional"],params:{type:{type:"int",default:0},In:{type:"bool",default:!1,description:"Slide the incoming image in instead of the outgoing one out"}},textures:[],createdAt:"Tue, 4 Apr 2023 03:32:13 -0400",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"StarWipe",paramsTypes:{border_thickness:"float",star_rotation:"float",border_color:"vec4",star_center:"vec2"},defaultParams:{border_thickness:.01,star_rotation:.75,border_color:[1,1,1,1],star_center:[.5,.5]},glsl:`// Author: Ben Lucas
// License: MIT
// Description: A growing star reveals the incoming image
// Tags: wipe, shape, star
#define PI 3.141592653589793
#define STAR_ANGLE 1.2566370614359172

// @param Thickness of the star's border
uniform float border_thickness;// = 0.01
uniform float star_rotation;// = 0.75
// @color Color of the star's border
uniform vec4 border_color; // = vec4(1.0)
// @param Center of the star
uniform vec2 star_center;// = vec2(0.5)

vec2 rotate(vec2 v, float theta) {
    float cosTheta = cos(theta);
    float sinTheta = sin(theta);

    return vec2(
        cosTheta * v.x - sinTheta * v.y,
        sinTheta * v.x + cosTheta * v.y
    );
}

bool inStar(vec2 uv, vec2 center, float radius){
  vec2 uv_centered = uv - center;
  uv_centered = rotate(uv_centered, star_rotation * STAR_ANGLE);
  float theta = atan(uv_centered.y, uv_centered.x) + PI;

  vec2 uv_rotated = rotate(uv_centered, -STAR_ANGLE * (floor(theta / STAR_ANGLE) + 0.5));

  float slope = 0.3;
  if(uv_rotated.y > 0.0){
      return (radius + uv_rotated.x * slope > uv_rotated.y);
  } else {
     return (-radius - uv_rotated.x * slope < uv_rotated.y);
  }
}

vec4 transition (vec2 uv) {
  float progressScaled = (2.0 * border_thickness + 1.0) * progress - border_thickness;
  if(inStar(uv, star_center, progressScaled)){
    return getToColor(uv);
  } else if(inStar(uv, star_center, progressScaled+border_thickness)){
    return border_color;
  } else {
    return getFromColor(uv);
  }
}
`,author:"Ben Lucas",license:"MIT",description:"A growing star reveals the incoming image",tags:["wipe","shape","star"],params:{border_thickness:{type:"float",default:.01,description:"Thickness of the star's border"},star_rotation:{type:"float",default:.75},border_color:{type:"vec4",default:[1,1,1,1],color:!0,description:"Color of the star's border"},star_center:{type:"vec2",default:[.5,.5],description:"Center of the star"}},textures:[],createdAt:"Wed, 1 Apr 2026 10:31:54 -0700",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"StaticFade",paramsTypes:{n_noise_pixels:"float",static_luminosity:"float"},defaultParams:{n_noise_pixels:200,static_luminosity:.8},glsl:`// Author: Ben Lucas
// License: MIT
// Description: Cuts to the incoming image halfway, hidden behind a burst of TV static
// Tags: static, noise, retro

uniform float n_noise_pixels ; // = 200.0
uniform float static_luminosity ; // = 0.8

float rnd (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(10.5302340293,70.23492931)))*
        12345.5453123);
}

vec4 staticNoise (vec2 st, float offset, float luminosity) {
  float staticR = luminosity * rnd(st * vec2(offset * 2.0, offset * 3.0));
  float staticG = luminosity * rnd(st * vec2(offset * 3.0, offset * 5.0));
  float staticB = luminosity * rnd(st * vec2(offset * 5.0, offset * 7.0));
  return vec4(staticR, staticG, staticB, 1.0);
}

float staticIntensity(float t)
{
  float transitionProgress = abs(2.0*(t-0.5));
  float transformedThreshold =1.2*(1.0 - transitionProgress)-0.1;
  return min(1.0, transformedThreshold);
}
  
vec4 transition (vec2 uv) {

  float baseMix = step(0.5, progress);
  vec4 transitionMix = mix(
    getFromColor(uv),
    getToColor(uv),
    baseMix
  );
  
  vec2 uvStatic = floor(uv * n_noise_pixels)/n_noise_pixels;
  
  vec4 staticColor = staticNoise(uvStatic, progress, static_luminosity);

  float staticThresh = staticIntensity(progress);
  float staticMix = step(rnd(uvStatic), staticThresh);

  return mix(transitionMix, staticColor, staticMix);
}
`,author:"Ben Lucas",license:"MIT",description:"Cuts to the incoming image halfway, hidden behind a burst of TV static",tags:["static","noise","retro"],params:{n_noise_pixels:{type:"float",default:200},static_luminosity:{type:"float",default:.8}},textures:[],createdAt:"Fri, 2 Jun 2023 04:27:43 -0400",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"StereoViewer",paramsTypes:{zoom:"float",corner_radius:"float"},defaultParams:{zoom:.88,corner_radius:.22},glsl:`// Tunable parameters
// How much to zoom (out) for the effect ~ 0.5 - 1.0
// @range(0.5, 1) How much the images zoom out
uniform float zoom; // = 0.88
// Corner radius as a fraction of the image height
uniform float corner_radius;  // = 0.22

// Author: Ted Schundler
// License: BSD 2 Clause
// Description: Both images shrink into rounded cards that swap, like a stereo viewer toy
// Tags: cards, zoom, retro
// Free for use and modification by anyone with credit

// Copyright (c) 2016, Theodore K Schundler
// All rights reserved.

// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

///////////////////////////////////////////////////////////////////////////////
// Stereo Viewer Toy Transition                                              //
//                                                                           //
// Inspired by ViewMaster / Image3D image viewer devices.                    //
// This effect is similar to what you see when you press the device's lever. //
// There is a quick zoom in / out to make the transition 'valid' for GLSL.io //
///////////////////////////////////////////////////////////////////////////////

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 c00 = vec2(0.0, 0.0); // the four corner points
const vec2 c01 = vec2(0.0, 1.0);
const vec2 c11 = vec2(1.0, 1.0);
const vec2 c10 = vec2(1.0, 0.0);

// Check if a point is within a given corner
bool in_corner(vec2 p, vec2 corner, vec2 radius) {
  // determine the direction we want to be filled
  vec2 axis = (c11 - corner) - corner;

  // warp the point so we are always testing the bottom left point with the
  // circle centered on the origin
  p = p - (corner + axis * radius);
  p *= axis / radius;
  return (p.x > 0.0 && p.y > -1.0) || (p.y > 0.0 && p.x > -1.0) || dot(p, p) < 1.0;
}

// Check all four corners
// return a float for v2 for anti-aliasing?
bool test_rounded_mask(vec2 p, vec2 corner_size) {
  return
      in_corner(p, c00, corner_size) &&
      in_corner(p, c01, corner_size) &&
      in_corner(p, c10, corner_size) &&
      in_corner(p, c11, corner_size);
}

// Screen blend mode - https://en.wikipedia.org/wiki/Blend_modes
// This more closely approximates what you see than linear blending
vec4 screen(vec4 a, vec4 b) {
  return 1.0 - (1.0 - a) * (1.0 -b);
}

// Given RGBA, find a value that when screened with itself
// will yield the original value.
vec4 unscreen(vec4 c) {
  return 1.0 - sqrt(1.0 - c);
}

// Grab a pixel, only if it isn't masked out by the rounded corners
vec4 sample_with_corners_from(vec2 p, vec2 corner_size) {
  p = (p - 0.5) / zoom + 0.5;
  if (!test_rounded_mask(p, corner_size)) {
    return black;
  }
  return unscreen(getFromColor(p));
}

vec4 sample_with_corners_to(vec2 p, vec2 corner_size) {
  p = (p - 0.5) / zoom + 0.5;
  if (!test_rounded_mask(p, corner_size)) {
    return black;
  }
  return unscreen(getToColor(p));
}

// special sampling used when zooming - extra zoom parameter and don't unscreen
vec4 simple_sample_with_corners_from(vec2 p, vec2 corner_size, float zoom_amt) {
  p = (p - 0.5) / (1.0 - zoom_amt + zoom * zoom_amt) + 0.5;
  if (!test_rounded_mask(p, corner_size)) {
    return black;
  }
  return getFromColor(p);
}

vec4 simple_sample_with_corners_to(vec2 p, vec2 corner_size, float zoom_amt) {
  p = (p - 0.5) / (1.0 - zoom_amt + zoom * zoom_amt) + 0.5;
  if (!test_rounded_mask(p, corner_size)) {
    return black;
  }
  return getToColor(p);
}

// Basic 2D affine transform matrix helpers
// These really shouldn't be used in a fragment shader - I should work out the
// the math for a translate & rotate function as a pair of dot products instead

mat3 rotate2d(float angle, float ratio) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, s ,0.0,
    -s, c, 0.0,
    0.0, 0.0, 1.0);
}

mat3 translate2d(float x, float y) {
  return mat3(
    1.0, 0.0, 0,
    0.0, 1.0, 0,
    -x, -y, 1.0);
}

mat3 scale2d(float x, float y) {
  return mat3(
    x, 0.0, 0,
    0.0, y, 0,
    0, 0, 1.0);
}

// Split an image and rotate one up and one down along off screen pivot points
vec4 get_cross_rotated(vec3 p3, float angle, vec2 corner_size, float ratio) {
  angle = angle * angle; // easing
  angle /= 2.4; // works out to be a good number of radians

  mat3 center_and_scale = translate2d(-0.5, -0.5) * scale2d(1.0, ratio);
  mat3 unscale_and_uncenter = scale2d(1.0, 1.0/ratio) * translate2d(0.5,0.5);
  mat3 slide_left = translate2d(-2.0,0.0);
  mat3 slide_right = translate2d(2.0,0.0);
  mat3 rotate = rotate2d(angle, ratio);

  mat3 op_a = center_and_scale * slide_right * rotate * slide_left * unscale_and_uncenter;
  mat3 op_b = center_and_scale * slide_left * rotate * slide_right * unscale_and_uncenter;

  vec4 a = sample_with_corners_from((op_a * p3).xy, corner_size);
  vec4 b = sample_with_corners_from((op_b * p3).xy, corner_size);

  return screen(a, b);
}

// Image stays put, but this time move two masks
vec4 get_cross_masked(vec3 p3, float angle, vec2 corner_size, float ratio) {
  angle = 1.0 - angle;
  angle = angle * angle; // easing
  angle /= 2.4;

  vec4 img;

  mat3 center_and_scale = translate2d(-0.5, -0.5) * scale2d(1.0, ratio);
  mat3 unscale_and_uncenter = scale2d(1.0 / zoom, 1.0 / (zoom * ratio)) * translate2d(0.5,0.5);
  mat3 slide_left = translate2d(-2.0,0.0);
  mat3 slide_right = translate2d(2.0,0.0);
  mat3 rotate = rotate2d(angle, ratio);

  mat3 op_a = center_and_scale * slide_right * rotate * slide_left * unscale_and_uncenter;
  mat3 op_b = center_and_scale * slide_left * rotate * slide_right * unscale_and_uncenter;

  bool mask_a = test_rounded_mask((op_a * p3).xy, corner_size);
  bool mask_b = test_rounded_mask((op_b * p3).xy, corner_size);

  if (mask_a || mask_b) {
    img = sample_with_corners_to(p3.xy, corner_size);
    return screen(mask_a ? img : black, mask_b ? img : black);
  } else {
    return black;
  }
}

vec4 transition(vec2 uv) {
  float a;
  vec2 p=uv.xy/vec2(1.0).xy;
  vec3 p3 = vec3(p.xy, 1.0); // for 2D matrix transforms

  // corner is warped to represent to size after mapping to 1.0, 1.0
  vec2 corner_size = vec2(corner_radius / ratio, corner_radius);

  if (progress <= 0.0) {
    // 0.0: start with the base frame always
    return getFromColor(p);
  } else if (progress < 0.1) {
    // 0.0-0.1: zoom out and add rounded corners
    a = progress / 0.1;
    return  simple_sample_with_corners_from(p, corner_size * a, a);
  } else if (progress < 0.48) {
    // 0.1-0.48: Split original image apart
    a = (progress - 0.1)/0.38;
    return get_cross_rotated(p3, a, corner_size, ratio);
  } else if (progress < 0.9) {
    // 0.48-0.52: black
    // 0.52 - 0.9: unmask new image
    return get_cross_masked(p3, (progress - 0.52)/0.38, corner_size, ratio);
  } else if (progress < 1.0) {
    // zoom out and add rounded corners
    a = (1.0 - progress) / 0.1;
    return simple_sample_with_corners_to(p, corner_size * a, a);
  } else {
    // 1.0 end with base frame
    return getToColor(p);
  }
}
`,author:"Ted Schundler",license:"BSD 2 Clause",description:"Both images shrink into rounded cards that swap, like a stereo viewer toy",tags:["cards","zoom","retro"],params:{zoom:{type:"float",default:.88,min:.5,max:1,description:"How much the images zoom out"},corner_radius:{type:"float",default:.22}},textures:[],createdAt:"Tue, 20 Feb 2018 23:20:29 +0100",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"StripDatamoshGlitch",paramsTypes:{strength:"float",horizontalBars:"float",verticalSlits:"float",tear:"float",chroma:"float",residue:"float",noiseAmount:"float",scanAmount:"float",flashAmount:"float"},defaultParams:{strength:1,horizontalBars:42,verticalSlits:18,tear:.18,chroma:.032,residue:.62,noiseAmount:.16,scanAmount:.13,flashAmount:.2},glsl:`// Author: bread
// License: MIT
// Description: A datamosh glitch: torn strips, chroma shifts and scan noise drag the outgoing image into the incoming one
// Tags: glitch, datamosh, chromatic

uniform float strength;       // = 1.0
uniform float horizontalBars; // = 42.0
uniform float verticalSlits;  // = 18.0
uniform float tear;           // = 0.18
uniform float chroma;         // = 0.032
uniform float residue;        // = 0.62
uniform float noiseAmount;    // = 0.16
uniform float scanAmount;     // = 0.13
uniform float flashAmount;    // = 0.20

const float PI = 3.141592653589793;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float sat(float v) {
  return clamp(v, 0.0, 1.0);
}

float burst() {
  return pow(max(0.0, sin(progress * PI)), 0.42) * strength;
}

vec2 safeUv(vec2 uv) {
  return clamp(uv, vec2(0.0), vec2(1.0));
}

float stripeY(vec2 uv, float density, float seed, float minWidth, float maxWidth) {
  float y = uv.y * density + seed * 0.137;
  float id = floor(y);
  float f = fract(y);
  float c = hash(vec2(id, seed));
  float w = mix(minWidth, maxWidth, hash(vec2(id + 9.17, seed + 2.31)));
  return 1.0 - smoothstep(w, w + 0.018, abs(f - c));
}

float stripeX(vec2 uv, float density, float seed, float minWidth, float maxWidth) {
  float x = uv.x * density + seed * 0.091;
  float id = floor(x);
  float f = fract(x);
  float c = hash(vec2(id, seed + 41.0));
  float w = mix(minWidth, maxWidth, hash(vec2(id + 4.7, seed + 8.9)));
  return 1.0 - smoothstep(w, w + 0.012, abs(f - c));
}

float brokenGate(vec2 uv, float row, float rnd, float frame) {
  float segs = mix(1.0, 9.0, hash(vec2(row, frame + 44.0)));
  float seg = floor(uv.x * segs);
  return step(0.16, hash(vec2(seg, row + frame * 3.0 + rnd)));
}

float horizontalMask(vec2 uv, float frame) {
  float r1 = floor((uv.y + hash(frame) * 0.031) * horizontalBars * 0.38);
  float r2 = floor((uv.y + hash(frame + 2.0) * 0.013) * horizontalBars);
  float r3 = floor((uv.y + hash(frame + 7.0) * 0.006) * horizontalBars * 3.4);

  float thick = stripeY(uv, horizontalBars * 0.38, frame + 1.0, 0.035, 0.22);
  float mid   = stripeY(uv, horizontalBars,        frame + 4.0, 0.014, 0.11);
  float hair  = stripeY(uv, horizontalBars * 3.4,  frame + 9.0, 0.004, 0.035);

  thick *= step(0.42, hash(vec2(r1, frame + 10.0)));
  mid   *= step(0.48, hash(vec2(r2, frame + 20.0)));
  hair  *= step(0.62, hash(vec2(r3, frame + 30.0)));

  thick *= brokenGate(uv, r1, hash(vec2(r1, frame)), frame);
  mid   *= brokenGate(uv, r2, hash(vec2(r2, frame)), frame + 3.0);

  return sat(max(thick, max(mid, hair)));
}

float verticalMask(vec2 uv, float frame) {
  float col = floor((uv.x + hash(frame + 12.0) * 0.017) * verticalSlits);
  float slit = stripeX(uv, verticalSlits, frame + 13.0, 0.01, 0.075);
  slit *= step(0.66, hash(vec2(col, frame + 19.0)));
  return sat(slit);
}

vec4 chromaFrom(vec2 uv, vec2 s) {
  uv = safeUv(uv);
  return vec4(
    getFromColor(safeUv(uv + s)).r,
    getFromColor(uv).g,
    getFromColor(safeUv(uv - s)).b,
    1.0
  );
}

vec4 chromaTo(vec2 uv, vec2 s) {
  uv = safeUv(uv);
  return vec4(
    getToColor(safeUv(uv - s)).r,
    getToColor(uv).g,
    getToColor(safeUv(uv + s)).b,
    1.0
  );
}

vec2 distortUv(vec2 uv, float dir, float b, float h, float v, float frame) {
  float row = floor(uv.y * horizontalBars);
  float col = floor(uv.x * verticalSlits);

  float rowRnd = hash(vec2(row, frame));
  float colRnd = hash(vec2(col, frame + 27.0));

  float xTear = (rowRnd - 0.5) * 2.0 * tear * b * h;
  xTear += sin(uv.y * 120.0 + progress * 95.0) * 0.006 * b;

  float yDrag = (colRnd - 0.5) * 0.13 * b * v;
  float micro = (hash(vec2(row, col + frame)) - 0.5) * 0.018 * b * max(h, v);

  return uv + vec2(xTear * dir + micro, yDrag);
}

vec4 transition(vec2 uv) {
  if (progress <= 0.0) return getFromColor(uv);
  if (progress >= 1.0) return getToColor(uv);

  float b = burst();
  float frame = floor(progress * 30.0);

  float h = horizontalMask(uv, frame);
  float v = verticalMask(uv, frame);
  float glitch = sat(max(h, v * 0.75));

  float row = floor(uv.y * horizontalBars);
  float rowRnd = hash(vec2(row, frame + 5.0));

  float bandDelay = (rowRnd - 0.5) * 0.30 * h;
  float reveal = smoothstep(0.18, 0.84, progress + bandDelay);

  vec2 split = vec2(chroma * b * (1.0 + 1.7 * glitch), chroma * 0.22 * b * v);

  vec2 fromUv = distortUv(uv,  1.0, b, h, v, frame);
  vec2 toUv   = distortUv(uv, -1.0, b, h, v, frame);

  vec4 color = mix(
    chromaFrom(fromUv, split),
    chromaTo(toUv, split),
    reveal
  );

  // Horizontal time-slice residue: old/new frames dragged through uneven scan bands.
  vec2 smearUv = uv;
  smearUv.x += (rowRnd - 0.5) * 0.46 * b * h;
  smearUv.y += (hash(vec2(row, frame + 31.0)) - 0.5) * 0.045 * b * h;

  float sliceReveal = smoothstep(0.28, 0.78, progress + (rowRnd - 0.5) * 0.22);
  vec4 sliceColor = mix(
    chromaFrom(smearUv, split * 1.65),
    chromaTo(smearUv - vec2((rowRnd - 0.5) * 0.18 * b, 0.0), split * 1.65),
    sliceReveal
  );

  color = mix(color, sliceColor, h * b * residue);

  // Thin scan sparks and broken white lines, like the reference clip's bright horizontal noise.
  float hairLine = stripeY(uv, 190.0, frame + 55.0, 0.002, 0.012);
  hairLine *= step(0.70, hash(vec2(floor(uv.y * 190.0), frame + 56.0)));
  color.rgb += vec3(0.72, 0.90, 1.0) * hairLine * b * 0.28;

  float scan = 0.5 + 0.5 * sin(uv.y * 980.0 + progress * 130.0);
  color.rgb *= 1.0 - scanAmount * b * scan;

  vec2 nCell = floor(uv * vec2(360.0 * ratio, 210.0));
  float n = hash(nCell + vec2(frame * 7.0, frame * 13.0));
  color.rgb += (n - 0.5) * noiseAmount * b * (0.55 + glitch);

  // Slight desaturation during the damage peak makes it feel more like broadcast/video signal corruption.
  float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(color.rgb, vec3(luma), 0.18 * b * glitch);

  float strobe = step(0.78, hash(vec2(frame, 3.14))) * pow(b, 1.65);
  color.rgb += vec3(strobe * flashAmount);

  return vec4(clamp(color.rgb, vec3(0.0), vec3(1.0)), 1.0);
}
`,author:"bread",license:"MIT",description:"A datamosh glitch: torn strips, chroma shifts and scan noise drag the outgoing image into the incoming one",tags:["glitch","datamosh","chromatic"],params:{strength:{type:"float",default:1},horizontalBars:{type:"float",default:42},verticalSlits:{type:"float",default:18},tear:{type:"float",default:.18},chroma:{type:"float",default:.032},residue:{type:"float",default:.62},noiseAmount:{type:"float",default:.16},scanAmount:{type:"float",default:.13},flashAmount:{type:"float",default:.2}},textures:[],createdAt:"Fri, 12 Jun 2026 15:15:42 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"Swirl",paramsTypes:{},defaultParams:{},glsl:`// License: MIT
// Author: Sergey Kosarevsky
// Description: Both images swirl around the center while crossfading
// Tags: swirl, rotate, blend
// ( http://www.linderdaum.com )
// ported by gre from https://gist.github.com/corporateshark/cacfedb8cca0f5ce3f7c

vec4 transition(vec2 UV)
{
	float Radius = 1.0;

	float T = progress;

	UV -= vec2( 0.5, 0.5 );

	float Dist = length(UV);

	if ( Dist < Radius )
	{
		float Percent = (Radius - Dist) / Radius;
		float A = ( T <= 0.5 ) ? mix( 0.0, 1.0, T/0.5 ) : mix( 1.0, 0.0, (T-0.5)/0.5 );
		float Theta = Percent * Percent * A * 8.0 * 3.14159;
		float S = sin( Theta );
		float C = cos( Theta );
		UV = vec2( dot(UV, vec2(C, -S)), dot(UV, vec2(S, C)) );
	}
	UV += vec2( 0.5, 0.5 );

	vec4 C0 = getFromColor(UV);
	vec4 C1 = getToColor(UV);

	return mix( C0, C1, T );
}
`,author:"Sergey Kosarevsky",license:"MIT",description:"Both images swirl around the center while crossfading",tags:["swirl","rotate","blend"],params:{},textures:[],createdAt:"Mon, 12 Jun 2017 12:38:27 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"TVStatic",paramsTypes:{offset:"float"},defaultParams:{offset:.05},glsl:`// Author: Brandon Anzaldi
// License: MIT
// Description: Cuts to full-screen TV static, then to the incoming image
// Tags: static, noise, retro
// @param Part of the transition, at each end, that shows the images instead of static
uniform float offset; // = 0.05

// Pseudo-random noise function
// http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float noise(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy * progress, vec2(a, b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec4 transition(vec2 p) {
  if (progress < offset) {
    return getFromColor(p);
  } else if (progress > (1.0 - offset)) {
    return getToColor(p);
  } else {
    return vec4(vec3(noise(p)), 1.0);
  }
}
`,author:"Brandon Anzaldi",license:"MIT",description:"Cuts to full-screen TV static, then to the incoming image",tags:["static","noise","retro"],params:{offset:{type:"float",default:.05,description:"Part of the transition, at each end, that shows the images instead of static"}},textures:[],createdAt:"Fri, 22 Mar 2019 11:53:09 -0700",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"TilesWave",paramsTypes:{tileCount:"ivec2",flipX:"bool",flipY:"bool"},defaultParams:{tileCount:[8,8],flipX:!0,flipY:!1},glsl:`// Author: numb3r23
// License: MIT
// Description: The incoming image is revealed tile by tile in a diagonal wave
// Tags: tiles, wave, wipe
// Ported from https://gist.github.com/numb3r23/169781bb76f310e2bfde

// @param Number of tiles (columns, rows)
uniform ivec2 tileCount; // = ivec2(8, 8)
uniform bool flipX; // = true
uniform bool flipY; // = false

vec4 transition(vec2 uv) {
  vec2 tileSize = 1.0 / vec2(tileCount);
  vec2 posInTile = fract(uv * vec2(tileCount));
  vec2 tileNum = floor(uv * vec2(tileCount));
  float countTiles = float(tileCount.x * tileCount.y);

  // Diagonal wave from bottom-left to top-right
  float offset = (tileNum.y + tileNum.x * float(tileCount.y)) / countTiles;
  float timeOffset = clamp((progress - offset) * countTiles, 0.0, 0.5);
  float sinTime = 1.0 - abs(cos(fract(timeOffset) * 3.1415926));

  vec2 texC = posInTile;

  if (sinTime <= 0.5) {
    if (flipX) {
      if (texC.x < sinTime || texC.x > 1.0 - sinTime)
        return getFromColor(uv);
      texC.x = texC.x < 0.5
        ? (texC.x - sinTime) * 0.5 / (0.5 - sinTime)
        : (texC.x - 0.5) * 0.5 / (0.5 - sinTime) + 0.5;
    }
    if (flipY) {
      if (texC.y < sinTime || texC.y > 1.0 - sinTime)
        return getFromColor(uv);
      texC.y = texC.y < 0.5
        ? (texC.y - sinTime) * 0.5 / (0.5 - sinTime)
        : (texC.y - 0.5) * 0.5 / (0.5 - sinTime) + 0.5;
    }
    vec2 globalUV = tileNum * tileSize + texC * tileSize;
    return getFromColor(globalUV);
  } else {
    if (flipX) {
      if (texC.x > sinTime || texC.x < 1.0 - sinTime)
        return getToColor(uv);
      texC.x = texC.x < 0.5
        ? (texC.x - sinTime) * 0.5 / (0.5 - sinTime)
        : (texC.x - 0.5) * 0.5 / (0.5 - sinTime) + 0.5;
      texC.x = 1.0 - texC.x;
    }
    if (flipY) {
      if (texC.y > sinTime || texC.y < 1.0 - sinTime)
        return getToColor(uv);
      texC.y = texC.y < 0.5
        ? (texC.y - sinTime) * 0.5 / (0.5 - sinTime)
        : (texC.y - 0.5) * 0.5 / (0.5 - sinTime) + 0.5;
      texC.y = 1.0 - texC.y;
    }
    vec2 globalUV = tileNum * tileSize + texC * tileSize;
    return getToColor(globalUV);
  }
}
`,author:"numb3r23",license:"MIT",description:"The incoming image is revealed tile by tile in a diagonal wave",tags:["tiles","wave","wipe"],params:{tileCount:{type:"ivec2",default:[8,8],description:"Number of tiles (columns, rows)"},flipX:{type:"bool",default:!0},flipY:{type:"bool",default:!1}},textures:[],createdAt:"Sun, 29 Mar 2026 20:32:54 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"TopBottom",paramsTypes:{},defaultParams:{},glsl:`// Author: zhmy
// License: MIT
// Description: The outgoing image shrinks away upward while the incoming one slides in from the bottom
// Tags: slide, zoom, vertical

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
    return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
    vec2 spfr,spto = vec2(-1.);
    float size = mix(1.0, 3.0, progress*0.2);
    spto = (uv + vec2(-0.5,-0.5))*vec2(size,size)+vec2(0.5,0.5);
    spfr = (uv + vec2(0.0, 1.0 - progress));
    if(inBounds(spfr)){
        return getToColor(spfr);
    } else if(inBounds(spto)){
        return getFromColor(spto) * (1.0 - progress);
    } else{
        return black;
    }
}`,author:"zhmy",license:"MIT",description:"The outgoing image shrinks away upward while the incoming one slides in from the bottom",tags:["slide","zoom","vertical"],params:{},textures:[],createdAt:"Thu, 17 Dec 2020 11:50:34 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"VerticalClose",paramsTypes:{},defaultParams:{},glsl:`// Author: martiniti
// License: MIT
// Description: The incoming image closes in from the left and right edges toward the middle
// Tags: wipe, split

vec4 transition (vec2 uv) {

  float s = 2.0 - abs((uv.x - 0.5) / (progress - 1.0)) - 2.0 * progress;
  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    smoothstep(0.5, 0.0, s)
  );
}
`,author:"martiniti",license:"MIT",description:"The incoming image closes in from the left and right edges toward the middle",tags:["wipe","split"],params:{},textures:[],createdAt:"Tue, 4 Apr 2023 10:35:17 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"VerticalOpen",paramsTypes:{},defaultParams:{},glsl:`// Author: martiniti
// License: MIT
// Description: The incoming image opens from a line in the middle toward the left and right edges
// Tags: wipe, split

vec4 transition (vec2 uv) {

  float regress = 1.0 - progress;
  float s = 2.0 - abs((uv.x - 0.5) / (regress - 1.0)) - 2.0 * regress;
  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    smoothstep(0.0, 0.5, s)
  );
}
`,author:"martiniti",license:"MIT",description:"The incoming image opens from a line in the middle toward the left and right edges",tags:["wipe","split"],params:{},textures:[],createdAt:"Tue, 4 Apr 2023 10:35:12 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"WaterDrop",paramsTypes:{amplitude:"float",speed:"float"},defaultParams:{amplitude:30,speed:30},glsl:`// Author: Paweł Płóciennik
// License: MIT
// Description: Ripples spread from the center like a drop falling into water, crossfading to the incoming image
// Tags: ripple, water, blend
// @param Frequency of the ripples
uniform float amplitude; // = 30
// @param Speed of the ripples
uniform float speed; // = 30

vec4 transition(vec2 p) {
  vec2 dir = p - vec2(.5);
  float dist = length(dir);

  if (dist > progress) {
    return mix(getFromColor( p), getToColor( p), progress);
  } else {
    vec2 offset = dir * sin(dist * amplitude - progress * speed);
    return mix(getFromColor( p + offset), getToColor( p), progress);
  }
}
`,author:"Paweł Płóciennik",license:"MIT",description:"Ripples spread from the center like a drop falling into water, crossfading to the incoming image",tags:["ripple","water","blend"],params:{amplitude:{type:"float",default:30,description:"Frequency of the ripples"},speed:{type:"float",default:30,description:"Speed of the ripples"}},textures:[],createdAt:"Wed, 21 Feb 2018 19:37:15 +0100",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"ZoomInCircles",paramsTypes:{},defaultParams:{},glsl:`// License: MIT
// Author: dycm8009
// Description: Concentric rings of the outgoing image zoom at different speeds before revealing the incoming one
// Tags: zoom, circle
// ported by gre from https://gist.github.com/dycm8009/948e99b1800e81ad909a

vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * amount);	
}

vec4 transition(vec2 uv) {
  vec2 ratio2 = vec2(1.0, 1.0 / ratio);
  // TODO: some timing are hardcoded but should be one or many parameters
  // TODO: should also be able to configure how much circles
  // TODO: if() branching should be avoided when possible, prefer use of step() & other functions
  vec2 r = 2.0 * ((vec2(uv.xy) - 0.5) * ratio2);
  float pro = progress / 0.8;
  float z = pro * 0.2;
  float t = 0.0;
  if (pro > 1.0) {
    z = 0.2 + (pro - 1.0) * 5.;
    t = clamp((progress - 0.8) / 0.07, 0.0, 1.0);
  }
  if (length(r) < 0.5+z) {
    // uv = zoom(uv, 0.9 - 0.1 * pro);
  }
  else if (length(r) < 0.8+z*1.5) {
    uv = zoom(uv, 1.0 - 0.15 * pro);
    t = t * 0.5;
  }
  else if (length(r) < 1.2+z*2.5) {
    uv = zoom(uv, 1.0 - 0.2 * pro);
    t = t * 0.2;
  }
  else {
    uv = zoom(uv, 1.0 - 0.25 * pro);
  }
  return mix(getFromColor(uv), getToColor(uv), t);
}
`,author:"dycm8009",license:"MIT",description:"Concentric rings of the outgoing image zoom at different speeds before revealing the incoming one",tags:["zoom","circle"],params:{},textures:[],createdAt:"Mon, 12 Jun 2017 11:24:34 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"ZoomLeftWipe",paramsTypes:{zoom_quickness:"float"},defaultParams:{zoom_quickness:.8},glsl:`// Author: Handk
// License: MIT
// Description: Zooms into the outgoing image, then the incoming one wipes in from right to left
// Tags: zoom, wipe, horizontal

// @param Part of the first half spent zooming (capped at 0.5)
uniform float zoom_quickness; // = 0.8
vec2 zoom(vec2 uv, float amount) {
  if(amount<0.5)
  return 0.5 + ((uv - 0.5) * (1.0-amount));
  else
  return 0.5 + ((uv - 0.5) * (amount));
  
}

vec4 transition (vec2 uv) {
  float nQuick = clamp(zoom_quickness,0.0,0.5);
  if(progress<0.5){
    vec4 c= mix(
      getFromColor(zoom(uv, smoothstep(0.0, nQuick, progress))),
      getToColor(uv),
     step(0.5, progress)
    );
    
    return c;
  }
  else{
    vec2 p=uv.xy/vec2(1.0).xy;
    vec4 d=getFromColor(p);
    vec4 e=getToColor(p);
    vec4 f= mix(d, e, step(1.0-p.x,(progress-0.5)*2.0));
    
    return f;
  }
}
`,author:"Handk",license:"MIT",description:"Zooms into the outgoing image, then the incoming one wipes in from right to left",tags:["zoom","wipe","horizontal"],params:{zoom_quickness:{type:"float",default:.8,description:"Part of the first half spent zooming (capped at 0.5)"}},textures:[],createdAt:"Tue, 15 Mar 2022 21:20:28 +0900",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"ZoomRigthWipe",paramsTypes:{zoom_quickness:"float"},defaultParams:{zoom_quickness:.8},glsl:`// Author: Handk
// License: MIT
// Description: Zooms into the outgoing image, then the incoming one wipes in from left to right
// Tags: zoom, wipe, horizontal

// @param Part of the first half spent zooming (capped at 0.5)
uniform float zoom_quickness; // = 0.8
vec2 zoom(vec2 uv, float amount) {
  if(amount<0.5)
  return 0.5 + ((uv - 0.5) * (1.0-amount));
  else
  return 0.5 + ((uv - 0.5) * (amount));
  
}

vec4 transition (vec2 uv) {
  float nQuick = clamp(zoom_quickness,0.0,0.5);
  if(progress<0.5){
    vec4 c= mix(
      getFromColor(zoom(uv, smoothstep(0.0, nQuick, progress))),
      getToColor(uv),
     step(0.5, progress)
    );
    
    return c;
  }
  else{
    vec2 p=uv.xy/vec2(1.0).xy;
    vec4 d=getFromColor(p);
    vec4 e=getToColor(p);
    vec4 f= mix(d, e, step(0.0+p.x,(progress-0.5)*2.0));
    
    return f;
  }
}
`,author:"Handk",license:"MIT",description:"Zooms into the outgoing image, then the incoming one wipes in from left to right",tags:["zoom","wipe","horizontal"],params:{zoom_quickness:{type:"float",default:.8,description:"Part of the first half spent zooming (capped at 0.5)"}},textures:[],createdAt:"Tue, 15 Mar 2022 21:20:28 +0900",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"angular",paramsTypes:{startingAngle:"float"},defaultParams:{startingAngle:90},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: A wipe that sweeps around the center from a starting angle
// Tags: wipe, radial, clock

#define PI 3.141592653589

// @range(0, 360) Angle where the wipe starts, in degrees
uniform float startingAngle; // = 90

vec4 transition (vec2 uv) {
  
  float offset = startingAngle * PI / 180.0;
  float angle = atan(uv.y - 0.5, uv.x - 0.5) + offset;
  float normalizedAngle = (angle + PI) / (2.0 * PI);
  
  normalizedAngle = normalizedAngle - floor(normalizedAngle);

  return mix(
    getFromColor(uv),
    getToColor(uv),
    step(normalizedAngle, progress)
    );
}
`,author:"Fernando Kuteken",license:"MIT",description:"A wipe that sweeps around the center from a starting angle",tags:["wipe","radial","clock"],params:{startingAngle:{type:"float",default:90,min:0,max:360,description:"Angle where the wipe starts, in degrees"}},textures:[],createdAt:"Sun, 28 May 2017 18:30:24 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"burn",paramsTypes:{color:"vec3"},defaultParams:{color:[.9,.4,.2]},glsl:`// Author: gre
// License: MIT
// Description: A crossfade that brightens toward a color in the middle
// Tags: fade, color, flash
// @color Color the images brighten toward
uniform vec3 color /* = vec3(0.9, 0.4, 0.2) */;
vec4 transition (vec2 uv) {
  return mix(
    getFromColor(uv) + vec4(progress*color, 1.0),
    getToColor(uv) + vec4((1.0-progress)*color, 1.0),
    progress
  );
}
`,author:"gre",license:"MIT",description:"A crossfade that brightens toward a color in the middle",tags:["fade","color","flash"],params:{color:{type:"vec3",default:[.9,.4,.2],color:!0,description:"Color the images brighten toward"}},textures:[],createdAt:"Sat, 20 May 2017 19:28:26 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"burn0",paramsTypes:{burnColor:"vec3"},defaultParams:{burnColor:[1,.5,0]},glsl:`// Author: liubailin2020@gmail.com
// License: MIT
// Description: The outgoing image burns away in noisy, glowing patches
// Tags: burn, fire, noise

// @color Color of the burning edges
uniform vec3 burnColor; // = vec3(1.0, 0.5, 0.0)

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 4
float fbm (in vec2 st) {
    float value = 0.0;
    float amplitude = .5;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

vec4 transition (vec2 uv) {
    if (progress <= 0.0) return getFromColor(uv);
    if (progress >= 1.0) return getToColor(uv);
    vec4 from = getFromColor(uv);
    vec4 to = getToColor(uv);
    float n = fbm(uv * 4.);
    float l = smoothstep(progress, progress + 0.05, n);
    float edge = (1.0 - l) * l * 5.0;
    return mix(to, from, l) + vec4(burnColor, 0.0) * edge;
}
`,author:"liubailin2020@gmail.com",license:"MIT",description:"The outgoing image burns away in noisy, glowing patches",tags:["burn","fire","noise"],params:{burnColor:{type:"vec3",default:[1,.5,0],color:!0,description:"Color of the burning edges"}},textures:[],createdAt:"Thu, 4 Jul 2024 14:49:27 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"cannabisleaf",paramsTypes:{},defaultParams:{},glsl:`// Author: @Flexi23
// License: MIT
// Description: A cannabis-leaf shape grows from the center to reveal the incoming image
// Tags: shape, wipe

// inspired by http://www.wolframalpha.com/input/?i=cannabis+curve

vec4 transition (vec2 uv) {
  if(progress == 0.0){
    return getFromColor(uv);
  }
  vec2 leaf_uv = (uv - vec2(0.5))/10./pow(progress,3.5);
	leaf_uv.y += 0.35;
	float r = 0.18;
	float o = atan(leaf_uv.y, leaf_uv.x);
  return mix(getFromColor(uv), getToColor(uv), 1.-step(1. - length(leaf_uv)+r*(1.+sin(o))*(1.+0.9 * cos(8.*o))*(1.+0.1*cos(24.*o))*(0.9+0.05*cos(200.*o)), 1.));
}
`,author:"@Flexi23",license:"MIT",description:"A cannabis-leaf shape grows from the center to reveal the incoming image",tags:["shape","wipe"],params:{},textures:[],createdAt:"Thu, 1 Jun 2017 15:58:58 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"chessboard",paramsTypes:{grid_num:"float"},defaultParams:{grid_num:10},glsl:`// Author: lql
// License: MIT
// Description: A chessboard pattern of squares reveals the incoming image
// Tags: grid, squares, pattern

// @param Number of squares per row
uniform float grid_num; // = 10.0

vec4 transition(vec2 uv) {
    vec2 st = uv * grid_num;
    vec2 idx = floor(st);
    vec2 grid = fract(st);

    vec4 a = getFromColor(uv);
    vec4 b = getToColor(uv);

    float checker = mod(idx.x + idx.y, 2.0);
    float mixFactor;

    if (progress <= 0.5) {
        mixFactor = (checker > 0.5) ? step(grid.x, progress * 2.0) : 0.0;
    } else {
        mixFactor = (checker < 0.5) ? step(grid.x, (progress - 0.5) * 2.0) : 1.0;
    }

    return mix(a, b, mixFactor);
}
`,author:"lql",license:"MIT",description:"A chessboard pattern of squares reveals the incoming image",tags:["grid","squares","pattern"],params:{grid_num:{type:"float",default:10,description:"Number of squares per row"}},textures:[],createdAt:"Mon, 22 Jan 2024 22:35:57 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"circle",paramsTypes:{center:"vec2",backColor:"vec3"},defaultParams:{center:[.5,.5],backColor:[.1,.1,.1]},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: The outgoing image closes into a circle over a background color, then the incoming one opens from it
// Tags: circle, iris, shape

// @param Center of the circle
uniform vec2 center; // = vec2(0.5, 0.5)
// @color Background color
uniform vec3 backColor; // = vec3(0.1, 0.1, 0.1)

vec4 transition (vec2 uv) {
  
  float distance = length(uv - center);
  float radius = sqrt(8.0) * abs(progress - 0.5);
  
  if (distance > radius) {
    return vec4(backColor, 1.0);
  }
  else {
    if (progress < 0.5) return getFromColor(uv);
    else return getToColor(uv);
  }
}
`,author:"Fernando Kuteken",license:"MIT",description:"The outgoing image closes into a circle over a background color, then the incoming one opens from it",tags:["circle","iris","shape"],params:{center:{type:"vec2",default:[.5,.5],description:"Center of the circle"},backColor:{type:"vec3",default:[.1,.1,.1],color:!0,description:"Background color"}},textures:[],createdAt:"Sun, 28 May 2017 18:00:31 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"circleopen",paramsTypes:{smoothness:"float",opening:"bool"},defaultParams:{smoothness:.3,opening:!0},glsl:`// Author: gre
// License: MIT
// Description: A soft-edged circle opens from the center to reveal the incoming image
// Tags: circle, iris, wipe
// @param Softness of the circle's edge
uniform float smoothness; // = 0.3
// @param Open the circle; false closes it instead
uniform bool opening; // = true

const vec2 center = vec2(0.5, 0.5);
const float SQRT_2 = 1.414213562373;

vec4 transition (vec2 uv) {
  float x = opening ? progress : 1.-progress;
  float m = smoothstep(-smoothness, 0.0, SQRT_2*distance(center, uv) - x*(1.+smoothness));
  return mix(getFromColor(uv), getToColor(uv), opening ? 1.-m : m);
}
`,author:"gre",license:"MIT",description:"A soft-edged circle opens from the center to reveal the incoming image",tags:["circle","iris","wipe"],params:{smoothness:{type:"float",default:.3,description:"Softness of the circle's edge"},opening:{type:"bool",default:!0,description:"Open the circle; false closes it instead"}},textures:[],createdAt:"Sat, 20 May 2017 19:28:26 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"colorphase",paramsTypes:{fromStep:"vec4",toStep:"vec4"},defaultParams:{fromStep:[0,.2,.4,0],toStep:[.6,.8,1,1]},glsl:`// Author: gre
// License: MIT
// Description: A crossfade in which each color channel changes at a different time
// Tags: fade, color

// Usage: fromStep and toStep must be in [0.0, 1.0] range 
// and all(fromStep) must be < all(toStep)

// @range(0, 1) When each channel (r, g, b, a) starts changing
uniform vec4 fromStep; // = vec4(0.0, 0.2, 0.4, 0.0)
// @range(0, 1) When each channel (r, g, b, a) finishes changing
uniform vec4 toStep; // = vec4(0.6, 0.8, 1.0, 1.0)

vec4 transition (vec2 uv) {
  vec4 a = getFromColor(uv);
  vec4 b = getToColor(uv);
  return mix(a, b, smoothstep(fromStep, toStep, vec4(progress)));
}
`,author:"gre",license:"MIT",description:"A crossfade in which each color channel changes at a different time",tags:["fade","color"],params:{fromStep:{type:"vec4",default:[0,.2,.4,0],min:0,max:1,description:"When each channel (r, g, b, a) starts changing"},toStep:{type:"vec4",default:[.6,.8,1,1],min:0,max:1,description:"When each channel (r, g, b, a) finishes changing"}},textures:[],createdAt:"Sat, 27 May 2017 14:09:58 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"coord-from-in",paramsTypes:{},defaultParams:{},glsl:`// Author: haiyoucuv
// License: MIT
// Description: A crossfade in which the colors of one image displace the other
// Tags: displace, distort, blend

vec4 transition (vec2 uv) {

  vec4 coordTo = getToColor(uv);
  vec4 coordFrom = getFromColor(uv);

  return mix(
    getFromColor(mix(uv, coordTo.rg, progress)),
    getToColor(mix(coordFrom.rg, uv, progress)),
    progress
  );

}
`,author:"haiyoucuv",license:"MIT",description:"A crossfade in which the colors of one image displace the other",tags:["displace","distort","blend"],params:{},textures:[],createdAt:"Tue, 15 Mar 2022 20:22:47 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"crosshatch",paramsTypes:{center:"vec2",threshold:"float",fadeEdge:"float"},defaultParams:{center:[.5,.5],threshold:3,fadeEdge:.1},glsl:`// License: MIT
// Author: pthrasher
// Description: The incoming image appears through a crosshatch of lines spreading from the center
// Tags: pattern, lines, noise
// adapted by gre from https://gist.github.com/pthrasher/04fd9a7de4012cbb03f6

// @param Point the lines spread from
uniform vec2 center; // = vec2(0.5)
uniform float threshold; // = 3.0
uniform float fadeEdge; // = 0.1

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
vec4 transition(vec2 p) {
  float dist = distance(center, p) / threshold;
  float r = progress - min(rand(vec2(p.y, 0.0)), rand(vec2(0.0, p.x)));
  return mix(getFromColor(p), getToColor(p), mix(0.0, mix(step(dist, r), 1.0, smoothstep(1.0-fadeEdge, 1.0, progress)), smoothstep(0.0, fadeEdge, progress)));    
}
`,author:"pthrasher",license:"MIT",description:"The incoming image appears through a crosshatch of lines spreading from the center",tags:["pattern","lines","noise"],params:{center:{type:"vec2",default:[.5,.5],description:"Point the lines spread from"},threshold:{type:"float",default:3},fadeEdge:{type:"float",default:.1}},textures:[],createdAt:"Mon, 12 Jun 2017 10:02:12 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"crosswarp",paramsTypes:{},defaultParams:{},glsl:`// Author: Eke Péter <peterekepeter@gmail.com>
// License: MIT
// Description: The outgoing image zooms in while the incoming one zooms out into place, sweeping from right to left
// Tags: warp, zoom, horizontal
vec4 transition(vec2 p) {
  float x = progress;
  x=smoothstep(.0,1.0,(x*2.0+p.x-1.0));
  return mix(getFromColor((p-.5)*(1.-x)+.5), getToColor((p-.5)*x+.5), x);
}
`,author:"Eke Péter <peterekepeter@gmail.com>",license:"MIT",description:"The outgoing image zooms in while the incoming one zooms out into place, sweeping from right to left",tags:["warp","zoom","horizontal"],params:{},textures:[],createdAt:"Sat, 27 May 2017 00:19:45 +0300",updatedAt:"Fri, 9 Oct 2026 22:46:55 +0200"},{name:"cube",paramsTypes:{persp:"float",unzoom:"float",reflection:"float",floating:"float"},defaultParams:{persp:.7,unzoom:.3,reflection:.4,floating:3},glsl:`// Author: gre
// License: MIT
// Description: The two images are faces of a rotating 3D cube, with a floor reflection
// Tags: 3d, cube, rotate, reflection
// @range(0, 1) Amount of perspective
uniform float persp; // = 0.7
uniform float unzoom; // = 0.3
// @range(0, 1) Strength of the reflection
uniform float reflection; // = 0.4
uniform float floating; // = 3.0

vec2 project (vec2 p) {
  return p * vec2(1.0, -1.2) + vec2(0.0, -floating/100.);
}

bool inBounds (vec2 p) {
  return all(lessThan(vec2(0.0), p)) && all(lessThan(p, vec2(1.0)));
}

vec4 bgColor (vec2 p, vec2 pfr, vec2 pto) {
  vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
  pfr = project(pfr);
  // FIXME avoid branching might help perf!
  if (inBounds(pfr)) {
    c += mix(vec4(0.0), getFromColor(pfr), reflection * mix(1.0, 0.0, pfr.y));
  }
  pto = project(pto);
  if (inBounds(pto)) {
    c += mix(vec4(0.0), getToColor(pto), reflection * mix(1.0, 0.0, pto.y));
  }
  return c;
}

// p : the position
// persp : the perspective in [ 0, 1 ]
// center : the xcenter in [0, 1] \\ 0.5 excluded
vec2 xskew (vec2 p, float persp, float center) {
  float x = mix(p.x, 1.0-p.x, center);
  return (
    (
      vec2( x, (p.y - 0.5*(1.0-persp) * x) / (1.0+(persp-1.0)*x) )
      - vec2(0.5-distance(center, 0.5), 0.0)
    )
    * vec2(0.5 / distance(center, 0.5) * (center<0.5 ? 1.0 : -1.0), 1.0)
    + vec2(center<0.5 ? 0.0 : 1.0, 0.0)
  );
}

vec4 transition(vec2 op) {
  float uz = unzoom * 2.0*(0.5-distance(0.5, progress));
  vec2 p = -uz*0.5+(1.0+uz) * op;
  vec2 fromP = xskew(
    (p - vec2(progress, 0.0)) / vec2(1.0-progress, 1.0),
    1.0-mix(progress, 0.0, persp),
    0.0
  );
  vec2 toP = xskew(
    p / vec2(progress, 1.0),
    mix(pow(progress, 2.0), 1.0, persp),
    1.0
  );
  // FIXME avoid branching might help perf!
  if (inBounds(fromP)) {
    return getFromColor(fromP);
  }
  else if (inBounds(toP)) {
    return getToColor(toP);
  }
  return bgColor(op, fromP, toP);
}
`,author:"gre",license:"MIT",description:"The two images are faces of a rotating 3D cube, with a floor reflection",tags:["3d","cube","rotate","reflection"],params:{persp:{type:"float",default:.7,min:0,max:1,description:"Amount of perspective"},unzoom:{type:"float",default:.3},reflection:{type:"float",default:.4,min:0,max:1,description:"Strength of the reflection"},floating:{type:"float",default:3}},textures:[],createdAt:"Sat, 27 May 2017 11:39:22 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"directional-easing",paramsTypes:{direction:"vec2"},defaultParams:{direction:[0,1]},glsl:`// Author: Max Plotnikov
// License: MIT
// Description: Like Directional, with an eased movement
// Tags: slide, push, directional

// @param Direction of the movement
uniform vec2 direction; // = vec2(0.0, 1.0)

vec4 transition (vec2 uv) {
  float easing = sqrt((2.0 - progress) * progress);
  vec2 p = uv + easing * sign(direction);
  vec2 f = fract(p);
  return mix(
    getToColor(f),
    getFromColor(f),
    step(0.0, p.y) * step(p.y, 1.0) * step(0.0, p.x) * step(p.x, 1.0)
  );
}
`,author:"Max Plotnikov",license:"MIT",description:"Like Directional, with an eased movement",tags:["slide","push","directional"],params:{direction:{type:"vec2",default:[0,1],description:"Direction of the movement"}},textures:[],createdAt:"Wed, 23 Sep 2020 22:54:49 +0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"directionalwarp",paramsTypes:{smoothness:"float",direction:"vec2"},defaultParams:{smoothness:.1,direction:[-1,1]},glsl:`// Author: pschroen
// License: MIT
// Description: A diagonal wipe with a warped, smeared edge
// Tags: wipe, warp, directional

// @param Softness of the edge
uniform float smoothness; // = 0.1
// @param Direction of the wipe
uniform vec2 direction; // = vec2(-1.0, 1.0)

const vec2 center = vec2(0.5, 0.5);

vec4 transition (vec2 uv) {
  vec2 v = normalize(direction);
  v /= abs(v.x) + abs(v.y);
  float d = v.x * center.x + v.y * center.y;
  float m = 1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d - 0.5 + progress * (1.0 + smoothness)));
  return mix(getFromColor((uv - 0.5) * (1.0 - m) + 0.5), getToColor((uv - 0.5) * m + 0.5), m);
}
`,author:"pschroen",license:"MIT",description:"A diagonal wipe with a warped, smeared edge",tags:["wipe","warp","directional"],params:{smoothness:{type:"float",default:.1,description:"Softness of the edge"},direction:{type:"vec2",default:[-1,1],description:"Direction of the wipe"}},textures:[],createdAt:"Wed, 13 Dec 2017 12:08:49 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"directionalwipe",paramsTypes:{direction:"vec2",smoothness:"float"},defaultParams:{direction:[1,-1],smoothness:.5},glsl:`// Author: gre
// License: MIT
// Description: A soft-edged diagonal wipe
// Tags: wipe, directional

// @param Direction of the wipe
uniform vec2 direction; // = vec2(1.0, -1.0)
// @param Softness of the edge
uniform float smoothness; // = 0.5
 
const vec2 center = vec2(0.5, 0.5);
 
vec4 transition (vec2 uv) {
  vec2 v = normalize(direction);
  v /= abs(v.x)+abs(v.y);
  float d = v.x * center.x + v.y * center.y;
  float m =
    (1.0-step(progress, 0.0)) * // there is something wrong with our formula that makes m not equals 0.0 with progress is 0.0
    (1.0 - smoothstep(-smoothness, 0.0, v.x * uv.x + v.y * uv.y - (d-0.5+progress*(1.+smoothness))));
  return mix(getFromColor(uv), getToColor(uv), m);
}
`,author:"gre",license:"MIT",description:"A soft-edged diagonal wipe",tags:["wipe","directional"],params:{direction:{type:"vec2",default:[1,-1],description:"Direction of the wipe"},smoothness:{type:"float",default:.5,description:"Softness of the edge"}},textures:[],createdAt:"Fri, 26 May 2017 10:41:57 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"displacement",paramsTypes:{strength:"float"},defaultParams:{strength:.5},glsl:`// Author: Travis Fischer
// License: MIT
// Description: A crossfade in which a displacement map (an extra grayscale texture) warps both images
// Tags: displace, distort, blend
//
// Adapted from a Codrops article by Robin Delaporte
// https://tympanus.net/Development/DistortionHoverEffect

uniform sampler2D displacementMap;

// @param Strength of the displacement
uniform float strength; // = 0.5

vec4 transition (vec2 uv) {
  float displacement = texture2D(displacementMap, uv).r * strength;

  vec2 uvFrom = vec2(uv.x + progress * displacement, uv.y);
  vec2 uvTo = vec2(uv.x - (1.0 - progress) * displacement, uv.y);

  return mix(
    getFromColor(uvFrom),
    getToColor(uvTo),
    progress
  );
}
`,author:"Travis Fischer",license:"MIT",description:"A crossfade in which a displacement map (an extra grayscale texture) warps both images",tags:["displace","distort","blend"],params:{strength:{type:"float",default:.5,description:"Strength of the displacement"}},textures:["displacementMap"],createdAt:"Tue, 10 Apr 2018 23:03:38 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"dissolve",paramsTypes:{uLineWidth:"float",uSpreadClr:"vec3",uHotClr:"vec3",uPow:"float",uIntensity:"float"},defaultParams:{uLineWidth:.1,uSpreadClr:[1,0,0],uHotClr:[.9,.9,.2],uPow:5,uIntensity:1},glsl:`// Author: hjm1fb
// License: MIT
// Description: The incoming image spreads over the outgoing one with a hot, glowing edge
// Tags: dissolve, burn, glow

uniform float uLineWidth; // = 0.1
// @color Color of the spreading edge
uniform vec3 uSpreadClr; // = vec3(1.0, 0.0, 0.0)
// @color Color of the hottest part of the edge
uniform vec3 uHotClr; // = vec3(0.9, 0.9, 0.2)
uniform float uPow; // = 5.0
uniform float uIntensity; // = 1.0

vec2 hash(vec2 p)  // replace this by something better
{
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(in vec2 p) {
  const float K1 = 0.366025404;  // (sqrt(3)-1)/2;
  const float K2 = 0.211324865;  // (3-sqrt(3))/6;

  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
  return dot(n, vec3(70.0));
}

vec4 transition(vec2 uv) {
  vec4 from = getFromColor(uv);
  vec4 to = getToColor(uv);
  vec4 outColor;
  float burn;
  burn = 0.5 + 0.5 * (0.299 * from.r + 0.587 * from.g + 0.114 * from.b);

  float show = burn - progress;
  if (show < 0.001) {
    outColor = to;
  } else {
    float factor = 1.0 - smoothstep(0.0, uLineWidth, show);
    vec3 burnColor = mix(uSpreadClr, uHotClr, factor);
    burnColor = pow(burnColor, vec3(uPow)) * uIntensity;
    vec3 finalRGB = mix(from.rgb, burnColor, factor * step(0.0001, progress));
    outColor = vec4(finalRGB * from.a, from.a);
  }
  return outColor;
}
`,author:"hjm1fb",license:"MIT",description:"The incoming image spreads over the outgoing one with a hot, glowing edge",tags:["dissolve","burn","glow"],params:{uLineWidth:{type:"float",default:.1},uSpreadClr:{type:"vec3",default:[1,0,0],color:!0,description:"Color of the spreading edge"},uHotClr:{type:"vec3",default:[.9,.9,.2],color:!0,description:"Color of the hottest part of the edge"},uPow:{type:"float",default:5},uIntensity:{type:"float",default:1}},textures:[],createdAt:"Fri, 2 Jun 2023 16:25:50 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"doorway",paramsTypes:{reflection:"float",perspective:"float",depth:"float"},defaultParams:{reflection:.4,perspective:.4,depth:3},glsl:`// Author: gre
// License: MIT
// Description: The outgoing image opens like double doors as the incoming one comes forward, with a floor reflection
// Tags: doors, 3d, reflection
// @param Strength of the reflection
uniform float reflection; // = 0.4
// @param Amount of perspective
uniform float perspective; // = 0.4
uniform float depth; // = 3

const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec2 project (vec2 p) {
  return p * vec2(1.0, -1.2) + vec2(0.0, -0.02);
}

vec4 bgColor (vec2 p, vec2 pto) {
  vec4 c = black;
  pto = project(pto);
  if (inBounds(pto)) {
    c += mix(black, getToColor(pto), reflection * mix(1.0, 0.0, pto.y));
  }
  return c;
}


vec4 transition (vec2 p) {
  vec2 pfr = vec2(-1.), pto = vec2(-1.);
  float middleSlit = 2.0 * abs(p.x-0.5) - progress;
  if (middleSlit > 0.0) {
    pfr = p + (p.x > 0.5 ? -1.0 : 1.0) * vec2(0.5*progress, 0.0);
    float d = 1.0/(1.0+perspective*progress*(1.0-middleSlit));
    pfr.y -= d/2.;
    pfr.y *= d;
    pfr.y += d/2.;
  }
  float size = mix(1.0, depth, 1.-progress);
  pto = (p + vec2(-0.5, -0.5)) * vec2(size, size) + vec2(0.5, 0.5);
  if (inBounds(pfr)) {
    return getFromColor(pfr);
  }
  else if (inBounds(pto)) {
    return getToColor(pto);
  }
  else {
    return bgColor(p, pto);
  }
}
`,author:"gre",license:"MIT",description:"The outgoing image opens like double doors as the incoming one comes forward, with a floor reflection",tags:["doors","3d","reflection"],params:{reflection:{type:"float",default:.4,description:"Strength of the reflection"},perspective:{type:"float",default:.4,description:"Amount of perspective"},depth:{type:"float",default:3}},textures:[],createdAt:"Sat, 20 May 2017 19:28:26 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"fade",paramsTypes:{},defaultParams:{},glsl:`// Author: gre
// License: MIT
// Description: A linear crossfade between the two images
// Tags: fade, blend

vec4 transition (vec2 uv) {
  return mix(
    getFromColor(uv),
    getToColor(uv),
    progress
  );
}
`,author:"gre",license:"MIT",description:"A linear crossfade between the two images",tags:["fade","blend"],params:{},textures:[],createdAt:"Sat, 20 May 2017 19:28:26 +0200",updatedAt:"Fri, 9 Oct 2026 22:46:55 +0200"},{name:"fadecolor",paramsTypes:{color:"vec3",colorPhase:"float"},defaultParams:{color:[0,0,0],colorPhase:.4},glsl:`// Author: gre
// License: MIT
// Description: A fade through a solid color, black by default
// Tags: fade, color
// @color Color to fade through
uniform vec3 color;// = vec3(0.0)
// @range(0, 1) How long the color shows in the middle
uniform float colorPhase; // = 0.4 ; // if 0.0, there is no black phase, if 0.9, the black phase is very important
vec4 transition (vec2 uv) {
  return mix(
    mix(vec4(color, 1.0), getFromColor(uv), smoothstep(1.0-colorPhase, 0.0, progress)),
    mix(vec4(color, 1.0), getToColor(uv), smoothstep(    colorPhase, 1.0, progress)),
    progress);
}
`,author:"gre",license:"MIT",description:"A fade through a solid color, black by default",tags:["fade","color"],params:{color:{type:"vec3",default:[0,0,0],color:!0,description:"Color to fade through"},colorPhase:{type:"float",default:.4,min:0,max:1,description:"How long the color shows in the middle"}},textures:[],createdAt:"Sat, 20 May 2017 19:28:26 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"fadegrayscale",paramsTypes:{intensity:"float"},defaultParams:{intensity:.3},glsl:`// Author: gre
// License: MIT
// Description: A crossfade through grayscale
// Tags: fade, grayscale, color

// @range(0, 1) How long the grayscale phase lasts
uniform float intensity; // = 0.3; // if 0.0, the image directly turn grayscale, if 0.9, the grayscale transition phase is very important
 
vec3 grayscale (vec3 color) {
  return vec3(0.2126*color.r + 0.7152*color.g + 0.0722*color.b);
}
 
vec4 transition (vec2 uv) {
  vec4 fc = getFromColor(uv);
  vec4 tc = getToColor(uv);
  return mix(
    mix(vec4(grayscale(fc.rgb), 1.0), fc, smoothstep(1.0-intensity, 0.0, progress)),
    mix(vec4(grayscale(tc.rgb), 1.0), tc, smoothstep(    intensity, 1.0, progress)),
    progress);
}
`,author:"gre",license:"MIT",description:"A crossfade through grayscale",tags:["fade","grayscale","color"],params:{intensity:{type:"float",default:.3,min:0,max:1,description:"How long the grayscale phase lasts"}},textures:[],createdAt:"Fri, 26 May 2017 09:52:33 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"flyeye",paramsTypes:{size:"float",zoom:"float",colorSeparation:"float"},defaultParams:{size:.04,zoom:50,colorSeparation:.3},glsl:`// Author: gre
// License: MIT
// Description: The image breaks into a fly's-eye grid of lenses with color separation
// Tags: lens, distort, chromatic
uniform float size; // = 0.04
uniform float zoom; // = 50.0
uniform float colorSeparation; // = 0.3

vec4 transition(vec2 p) {
  float inv = 1. - progress;
  vec2 disp = size*vec2(cos(zoom*p.x), sin(zoom*p.y));
  vec4 texTo = getToColor(p + inv*disp);
  vec4 texFrom = vec4(
    getFromColor(p + progress*disp*(1.0 - colorSeparation)).r,
    getFromColor(p + progress*disp).g,
    getFromColor(p + progress*disp*(1.0 + colorSeparation)).b,
    1.0);
  return texTo*progress + texFrom*inv;
}
`,author:"gre",license:"MIT",description:"The image breaks into a fly's-eye grid of lenses with color separation",tags:["lens","distort","chromatic"],params:{size:{type:"float",default:.04},zoom:{type:"float",default:50},colorSeparation:{type:"float",default:.3}},textures:[],createdAt:"Sat, 27 May 2017 11:34:46 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"fragment",paramsTypes:{},defaultParams:{},glsl:`// Author: lbl
// License: MIT
// Description: The outgoing image shatters into fragments that fly away
// Tags: shatter, fragments

#define POINTS 10

float random(vec2 par) {
    return fract(sin(dot(par.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 random2(vec2 par) {
    float rand = random(par);
    return vec2(rand, random(par + rand));
}

vec4 transition (vec2 uv) {
    if (progress <= 0.0) return getFromColor(uv);
    if (progress >= 1.0) return getToColor(uv);

    const float duration = 8.0;
    float time = progress * duration;
    vec2 point[POINTS];
    for (int i = 0; i < POINTS; i++) {
        point[i] = random2(vec2(float(i)));
    }

    vec4 col = getToColor(uv);

    for (int i = 0; i < POINTS; i++) {
        vec2 dir = normalize(random2(vec2(float(i), float(i) + 11.)));
        float v = (1.0 + random(dir) * 0.5) * 0.2;
        vec2 ofst = dir * clamp(time - 0.5, 0.0, duration) * v;
        vec2 U = uv - ofst;

        if (U.x < 0.0 || U.x > 1.0 || U.y < 0.0 || U.y > 1.0) continue;

        float dist_i = distance(U, point[i]);
        bool closest = true;
        for (int j = 0; j < POINTS; j++) {
            if (distance(U, point[j]) < dist_i) {
                closest = false;
                break;
            }
        }

        if (closest) {
            col = getFromColor(U);
            break;
        }
    }
    return col;
}
`,author:"lbl",license:"MIT",description:"The outgoing image shatters into fragments that fly away",tags:["shatter","fragments"],params:{},textures:[],createdAt:"Thu, 4 Jul 2024 15:10:28 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"heart",paramsTypes:{},defaultParams:{},glsl:`// Author: gre
// License: MIT
// Description: A heart shape grows from the center to reveal the incoming image
// Tags: shape, wipe, heart

float inHeart (vec2 p, vec2 center, float size) {
  if (size==0.0) return 0.0;
  vec2 o = (p-center)/(1.6*size);
  float a = o.x*o.x+o.y*o.y-0.3;
  return step(a*a*a, o.x*o.x*o.y*o.y*o.y);
}
vec4 transition (vec2 uv) {
  return mix(
    getFromColor(uv),
    getToColor(uv),
    inHeart(uv, vec2(0.5, 0.4), progress)
  );
}
`,author:"gre",license:"MIT",description:"A heart shape grows from the center to reveal the incoming image",tags:["shape","wipe","heart"],params:{},textures:[],createdAt:"Fri, 26 May 2017 12:22:53 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"hexagonalize",paramsTypes:{steps:"int",horizontalHexagons:"float"},defaultParams:{steps:50,horizontalHexagons:20},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: Both images turn into hexagons, crossfade, then sharpen again
// Tags: pixelate, hexagon, blend
// Hexagonal math from: http://www.redblobgames.com/grids/hexagons/

uniform int steps; // = 50
// @param Number of hexagons across
uniform float horizontalHexagons; // = 20

struct Hexagon {
  float q;
  float r;
  float s;
};

Hexagon createHexagon(float q, float r){
  Hexagon hex;
  hex.q = q;
  hex.r = r;
  hex.s = -q - r;
  return hex;
}

Hexagon roundHexagon(Hexagon hex){
  
  float q = floor(hex.q + 0.5);
  float r = floor(hex.r + 0.5);
  float s = floor(hex.s + 0.5);

  float deltaQ = abs(q - hex.q);
  float deltaR = abs(r - hex.r);
  float deltaS = abs(s - hex.s);

  if (deltaQ > deltaR && deltaQ > deltaS)
    q = -r - s;
  else if (deltaR > deltaS)
    r = -q - s;
  else
    s = -q - r;

  return createHexagon(q, r);
}

Hexagon hexagonFromPoint(vec2 point, float size) {
  
  point.y /= ratio;
  point = (point - 0.5) / size;
  
  float q = (sqrt(3.0) / 3.0) * point.x + (-1.0 / 3.0) * point.y;
  float r = 0.0 * point.x + 2.0 / 3.0 * point.y;

  Hexagon hex = createHexagon(q, r);
  return roundHexagon(hex);
  
}

vec2 pointFromHexagon(Hexagon hex, float size) {
  
  float x = (sqrt(3.0) * hex.q + (sqrt(3.0) / 2.0) * hex.r) * size + 0.5;
  float y = (0.0 * hex.q + (3.0 / 2.0) * hex.r) * size + 0.5;
  
  return vec2(x, y * ratio);
}

vec4 transition (vec2 uv) {
  
  float dist = 2.0 * min(progress, 1.0 - progress);
  dist = steps > 0 ? ceil(dist * float(steps)) / float(steps) : dist;
  
  float size = (sqrt(3.0) / 3.0) * dist / horizontalHexagons;
  
  vec2 point = dist > 0.0 ? pointFromHexagon(hexagonFromPoint(uv, size), size) : uv;

  return mix(getFromColor(point), getToColor(point), progress);
  
}
`,author:"Fernando Kuteken",license:"MIT",description:"Both images turn into hexagons, crossfade, then sharpen again",tags:["pixelate","hexagon","blend"],params:{steps:{type:"int",default:50},horizontalHexagons:{type:"float",default:20,description:"Number of hexagons across"}},textures:[],createdAt:"Tue, 30 May 2017 21:55:47 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"kaleidoscope",paramsTypes:{speed:"float",angle:"float",power:"float"},defaultParams:{speed:1,angle:1,power:1.5},glsl:`// Author: nwoeanhinnogaehr
// License: MIT
// Description: A crossfade through a spinning kaleidoscope
// Tags: kaleidoscope, distort, blend

uniform float speed; // = 1.0
uniform float angle; // = 1.0
uniform float power; // = 1.5

vec4 transition(vec2 uv) {
  vec2 p = uv.xy / vec2(1.0).xy;
  vec2 q = p;
  float t = pow(progress, power)*speed;
  p = p -0.5;
  for (int i = 0; i < 7; i++) {
    p = vec2(sin(t)*p.x + cos(t)*p.y, sin(t)*p.y - cos(t)*p.x);
    t += angle;
    p = abs(mod(p, 2.0) - 1.0);
  }
  abs(mod(p, 1.0));
  return mix(
    mix(getFromColor(q), getToColor(q), progress),
    mix(getFromColor(p), getToColor(p), progress), 1.0 - 2.0*abs(progress - 0.5));
}
`,author:"nwoeanhinnogaehr",license:"MIT",description:"A crossfade through a spinning kaleidoscope",tags:["kaleidoscope","distort","blend"],params:{speed:{type:"float",default:1},angle:{type:"float",default:1},power:{type:"float",default:1.5}},textures:[],createdAt:"Wed, 31 May 2017 21:48:26 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"luma",paramsTypes:{},defaultParams:{},glsl:`// Author: gre
// License: MIT
// Description: A wipe that follows the brightness of a grayscale mask (the luma texture)
// Tags: wipe, luma, mask

uniform sampler2D luma;

vec4 transition(vec2 uv) {
  return mix(
    getToColor(uv),
    getFromColor(uv),
    step(progress, texture2D(luma, uv).r)
  );
}
`,author:"gre",license:"MIT",description:"A wipe that follows the brightness of a grayscale mask (the luma texture)",tags:["wipe","luma","mask"],params:{},textures:["luma"],createdAt:"Fri, 26 May 2017 21:30:20 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"luminance_melt",paramsTypes:{direction:"bool",l_threshold:"float",above:"bool"},defaultParams:{direction:!0,l_threshold:.8,above:!1},glsl:`// Author: 0gust1
// License: MIT
// Description: The outgoing image melts away in noisy vertical streaks, depending on its brightness
// Tags: melt, noise, luma
//My own first transition — based on crosshatch code (from pthrasher), using  simplex noise formula (copied and pasted)
//-> cooler with high contrasted images (isolated dark subject on light background f.e.)
//TODO : try to rebase it on DoomTransition (from zeh)?
//optimizations :
//luminance (see http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color#answer-596241)
// Y = (R+R+B+G+G+G)/6
//or Y = (R+R+R+B+G+G+G+G)>>3 


//direction of movement :  0 : up, 1, down
// @param Direction of the melt (false: up, true: down)
uniform bool direction; // = true
//luminance threshold
// @range(0, 1) Luminance threshold
uniform float l_threshold; // = 0.8 
//does the movement takes effect above or below luminance threshold ?
// @param Melt the parts above the threshold instead of below
uniform bool above; // = false 


//Random function borrowed from everywhere
float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}


// Simplex noise :
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : MIT  
//               2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Simplex noise -- end

float luminance(vec4 color){
  //(0.299*R + 0.587*G + 0.114*B)
  return color.r*0.299+color.g*0.587+color.b*0.114;
}

vec4 transition(vec2 uv) {
  vec2 center = vec2(1.0, direction);
  vec2 p = uv.xy / vec2(1.0).xy;
  if (progress == 0.0) {
    return getFromColor(p);
  } else if (progress == 1.0) {
    return getToColor(p);
  } else {
    float x = progress;
    float dist = distance(center, p)- progress*exp(snoise(vec2(p.x, 0.0)));
    float r = x - rand(vec2(p.x, 0.1));
    float m;
    if(above){
     m = dist <= r && luminance(getFromColor(p))>l_threshold ? 1.0 : (progress*progress*progress);
    }
    else{
     m = dist <= r && luminance(getFromColor(p))<l_threshold ? 1.0 : (progress*progress*progress);  
    }
    return mix(getFromColor(p), getToColor(p), m);    
  }
}
`,author:"0gust1",license:"MIT",description:"The outgoing image melts away in noisy vertical streaks, depending on its brightness",tags:["melt","noise","luma"],params:{direction:{type:"bool",default:!0,description:"Direction of the melt (false: up, true: down)"},l_threshold:{type:"float",default:.8,min:0,max:1,description:"Luminance threshold"},above:{type:"bool",default:!1,description:"Melt the parts above the threshold instead of below"}},textures:[],createdAt:"Wed, 24 Jan 2018 19:02:32 +0100",updatedAt:"Sat, 10 Oct 2026 11:13:38 +0200"},{name:"morph",paramsTypes:{strength:"float"},defaultParams:{strength:.1},glsl:`// Author: paniq
// License: MIT
// Description: A crossfade in which each image is displaced by the other's colors, like a morph
// Tags: morph, distort, blend
// @param Strength of the displacement
uniform float strength; // = 0.1

vec4 transition(vec2 p) {
  vec4 ca = getFromColor(p);
  vec4 cb = getToColor(p);
  
  vec2 oa = (((ca.rg+ca.b)*0.5)*2.0-1.0);
  vec2 ob = (((cb.rg+cb.b)*0.5)*2.0-1.0);
  vec2 oc = mix(oa,ob,0.5)*strength;
  
  float w0 = progress;
  float w1 = 1.0-w0;
  return mix(getFromColor(p+oc*w0), getToColor(p-oc*w1), progress);
}
`,author:"paniq",license:"MIT",description:"A crossfade in which each image is displaced by the other's colors, like a morph",tags:["morph","distort","blend"],params:{strength:{type:"float",default:.1,description:"Strength of the displacement"}},textures:[],createdAt:"Thu, 10 Aug 2017 00:27:36 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"mosaic_transition",paramsTypes:{mosaicNum:"float"},defaultParams:{mosaicNum:10},glsl:`// Author: YueDev
// License: MIT
// Description: Both images break into mosaic blocks that blend, then sharpen into the incoming image
// Tags: mosaic, pixelate, blend

// @param Number of mosaic blocks
uniform float mosaicNum;// = 10.0

vec2 getMosaicUV(vec2 uv) {
  float mosaicWidth = 2.0 / mosaicNum * min(progress, 1.0 - progress);
  float mX = floor(uv.x / mosaicWidth) + 0.5;
  float mY = floor(uv.y / mosaicWidth) + 0.5;
  return vec2(mX * mosaicWidth, mY * mosaicWidth);
}

vec4 transition (vec2 uv) {
  vec2 mosaicUV = min(progress, 1.0 - progress) == 0.0 ? uv : getMosaicUV(uv);
  return mix(getFromColor(mosaicUV), getToColor(mosaicUV), progress * progress);
}
`,author:"YueDev",license:"MIT",description:"Both images break into mosaic blocks that blend, then sharpen into the incoming image",tags:["mosaic","pixelate","blend"],params:{mosaicNum:{type:"float",default:10,description:"Number of mosaic blocks"}},textures:[],createdAt:"Fri, 27 May 2022 19:14:24 +0800",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"multiply_blend",paramsTypes:{},defaultParams:{},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: A crossfade through the multiplied blend of both images
// Tags: blend, fade

vec4 blend(vec4 a, vec4 b) {
  return a * b;
}

vec4 transition (vec2 uv) {
  
  vec4 blended = blend(getFromColor(uv), getToColor(uv));
  
  if (progress < 0.5)
    return mix(getFromColor(uv), blended, 2.0 * progress);
  else
    return mix(blended, getToColor(uv), 2.0 * progress - 1.0);
}

`,author:"Fernando Kuteken",license:"MIT",description:"A crossfade through the multiplied blend of both images",tags:["blend","fade"],params:{},textures:[],createdAt:"Mon, 29 May 2017 17:13:58 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"old_tv_lost_signal",paramsTypes:{},defaultParams:{},glsl:`// Author: mernking (gitlab.com/Godswork)
// License: MIT
// Description: A crossfade with drifting tracking lines and tearing, like a TV losing its signal
// Tags: retro, glitch, scanlines

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec4 transition(vec2 uv) {

    float p = progress;
    float strength = sin(p * 3.14159265);

    vec2 tv = uv;

    vec4 fromColor = getFromColor(tv);
    vec4 toColor   = getToColor(tv);

    vec4 color = mix(fromColor, toColor, p);

    // horizontal tracking lines (key effect)
    float lineY = floor(tv.y * 120.0);

    float noise = hash(vec2(lineY, p * 20.0));

    float line = step(0.92, noise);

    // make lines drift during transition
    float drift =
        sin(tv.y * 30.0 + p * 10.0)
        * 0.02
        * strength;

    vec4 shiftedFrom = getFromColor(tv + vec2(drift, 0.0));
    vec4 shiftedTo   = getToColor(tv + vec2(drift, 0.0));

    vec4 lineColor = mix(shiftedFrom, shiftedTo, p);

    // apply tearing only on selected scanlines
    color = mix(color, lineColor, line * strength);

    // mild scanline darkening (CRT feel)
    float scan =
        sin(tv.y * 900.0) * 0.03;

    color.rgb -= scan * strength;

    return color;
}
`,author:"mernking (gitlab.com/Godswork)",license:"MIT",description:"A crossfade with drifting tracking lines and tearing, like a TV losing its signal",tags:["retro","glitch","scanlines"],params:{},textures:[],createdAt:"Mon, 22 Jun 2026 00:33:17 +0100",updatedAt:"Sat, 10 Oct 2026 11:13:38 +0200"},{name:"parametric_glitch",paramsTypes:{ampx:"float",ampy:"float"},defaultParams:{ampx:1,ampy:1},glsl:`// Author: Yoni Maltsman @friendlyspinach
// License: MIT
// Description: A crossfade with glitchy horizontal bands and color shifts
// Tags: glitch, blend



// @param Horizontal amplitude of the glitch
uniform float ampx; // =1.0
// @param Vertical amplitude of the glitch
uniform float ampy; //=1.0

vec4 transition (vec2 uv) {
  vec4 from = getFromColor(uv);
  vec4 to = getToColor(uv);
  float r = from.r;
  float g = from.g;
  float b = from.b;
  float sphere = r*r + g*g + b*b - 1.0; //3 to 1
  float spiralX = cos(sphere - uv.x/(progress + .01));
  float spiralY = sin(sphere - uv.y/(progress+.01));
  vec2 st = uv;
  st.x = fract(ampx*st.x*spiralX); //1 to 2
  st.y = fract(ampy*st.y*spiralY);
  vec2 diff = uv - st;
  from = getFromColor(uv + progress*diff);
  return mix(from, to, progress);
}
`,author:"Yoni Maltsman @friendlyspinach",license:"MIT",description:"A crossfade with glitchy horizontal bands and color shifts",tags:["glitch","blend"],params:{ampx:{type:"float",default:1,description:"Horizontal amplitude of the glitch"},ampy:{type:"float",default:1,description:"Vertical amplitude of the glitch"}},textures:[],createdAt:"Sat, 22 Jun 2024 13:22:34 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"perlin",paramsTypes:{scale:"float",smoothness:"float",seed:"float"},defaultParams:{scale:4,smoothness:.01,seed:12.9898},glsl:`// Author: Rich Harris
// License: MIT
// Description: The incoming image appears through blobs of Perlin noise
// Tags: noise, dissolve

// @param Scale of the noise; higher values make smaller blobs
uniform float scale; // = 4.0
// @param Softness of the blob edges
uniform float smoothness; // = 0.01

// @param Random seed
uniform float seed; // = 12.9898

// http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
float random(vec2 co)
{
    float a = seed;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec4 transition (vec2 uv) {
  vec4 from = getFromColor(uv);
  vec4 to = getToColor(uv);
  float n = noise(uv * scale);

  float p = mix(-smoothness, 1.0 + smoothness, progress);
  float lower = p - smoothness;
  float higher = p + smoothness;

  float q = smoothstep(lower, higher, n);

  return mix(
    from,
    to,
    1.0 - q
  );
}
`,author:"Rich Harris",license:"MIT",description:"The incoming image appears through blobs of Perlin noise",tags:["noise","dissolve"],params:{scale:{type:"float",default:4,description:"Scale of the noise; higher values make smaller blobs"},smoothness:{type:"float",default:.01,description:"Softness of the blob edges"},seed:{type:"float",default:12.9898,description:"Random seed"}},textures:[],createdAt:"Tue, 23 Jan 2018 21:35:10 -0500",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"pinwheel",paramsTypes:{speed:"float"},defaultParams:{speed:2},glsl:`// Author: Mr Speaker
// License: MIT
// Description: A spinning pinwheel reveals the incoming image
// Tags: pinwheel, radial, rotate

// @param Rotation speed
uniform float speed; // = 2.0

vec4 transition(vec2 uv) {
  
  vec2 p = uv.xy / vec2(1.0).xy;
  
  float circPos = atan(p.y - 0.5, p.x - 0.5) + progress * speed;
  float modPos = mod(circPos, 3.1415 / 4.);
  float signed = sign(progress - modPos);
  
  return mix(getToColor(p), getFromColor(p), step(signed, 0.5));
  
}
`,author:"Mr Speaker",license:"MIT",description:"A spinning pinwheel reveals the incoming image",tags:["pinwheel","radial","rotate"],params:{speed:{type:"float",default:2,description:"Rotation speed"}},textures:[],createdAt:"Tue, 30 May 2017 09:04:31 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"pixelize",paramsTypes:{squaresMin:"ivec2",steps:"int"},defaultParams:{squaresMin:[20,20],steps:50},glsl:`// Author: gre
// License: MIT
// Description: Both images pixelate, crossfade, then sharpen again
// Tags: pixelate, blend
// forked from https://gist.github.com/benraziel/c528607361d90a072e98

// minimum number of squares (when the effect is at its higher level)
// @param Number of squares at the strongest pixelation
uniform ivec2 squaresMin; // = ivec2(20)
// zero disable the stepping
// @param Number of pixelation steps; 0 for a continuous effect
uniform int steps; // = 50

vec4 transition(vec2 uv) {
  float d = min(progress, 1.0 - progress);
  float dist = steps>0 ? ceil(d * float(steps)) / float(steps) : d;
  vec2 squareSize = 2.0 * dist / vec2(squaresMin);
  vec2 p = dist>0.0 ? (floor(uv / squareSize) + 0.5) * squareSize : uv;
  return mix(getFromColor(p), getToColor(p), progress);
}
`,author:"gre",license:"MIT",description:"Both images pixelate, crossfade, then sharpen again",tags:["pixelate","blend"],params:{squaresMin:{type:"ivec2",default:[20,20],description:"Number of squares at the strongest pixelation"},steps:{type:"int",default:50,description:"Number of pixelation steps; 0 for a continuous effect"}},textures:[],createdAt:"Mon, 29 May 2017 11:16:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"polar_function",paramsTypes:{segments:"int"},defaultParams:{segments:5},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: A flower shape with several petals grows to reveal the incoming image
// Tags: shape, wipe, polar

#define PI 3.14159265359

// @param Number of petals
uniform int segments; // = 5

vec4 transition (vec2 uv) {
  
  float angle = atan(uv.y - 0.5, uv.x - 0.5) - 0.5 * PI;
  float normalized = (angle + 1.5 * PI) * (2.0 * PI);
  
  float radius = (cos(float(segments) * angle) + 4.0) / 4.0;
  float difference = length(uv - vec2(0.5, 0.5));
  
  if (difference > radius * progress)
    return getFromColor(uv);
  else
    return getToColor(uv);
}
`,author:"Fernando Kuteken",license:"MIT",description:"A flower shape with several petals grows to reveal the incoming image",tags:["shape","wipe","polar"],params:{segments:{type:"int",default:5,description:"Number of petals"}},textures:[],createdAt:"Sun, 28 May 2017 18:53:12 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"powerKaleido",paramsTypes:{scale:"float",z:"float",speed:"float"},defaultParams:{scale:2,z:1.5,speed:5},glsl:`// Name: Power Kaleido
// Author: Boundless
// License: MIT
// Description: The image folds into an animated kaleidoscope before revealing the incoming one
// Tags: kaleidoscope, distort
#define PI 3.14159265358979
const float rad = 120.; // change this value to get different mirror effects
const float deg = rad / 180. * PI;
uniform float scale; // = 2.0
uniform float z; // = 1.5
uniform float speed; // = 5.
vec2 refl(vec2 p,vec2 o,vec2 n)
{
	return 2.0*o+2.0*n*dot(p-o,n)-p;
}

vec2 rot(vec2 p, vec2 o, float a)
{
    float s = sin(a);
    float c = cos(a);
	return o + mat2(c, -s, s, c) * (p - o);
}

vec4 mainImage(vec2 uv)
{
  float dist = scale / 10.;
  vec2 uv0 = uv;
	uv -= 0.5;
  uv.x *= ratio;
  uv *= z;
  uv = rot(uv, vec2(0.0), progress*speed);
  // uv.x = fract(uv.x/l/3.0)*l*3.0;
	float theta = progress*6.+PI/.5;
	for(int iter = 0; iter < 10; iter++) {
    for(float i = 0.; i < 2. * PI; i+=deg) {
	    float ts = sign(asin(cos(i))) == 1.0 ? 1.0 : 0.0;
      if(((ts == 1.0) && (uv.y-dist*cos(i) > tan(i)*(uv.x+dist*+sin(i)))) || ((ts == 0.0) && (uv.y-dist*cos(i) < tan(i)*(uv.x+dist*+sin(i))))) {
        uv = refl(vec2(uv.x+sin(i)*dist*2.,uv.y-cos(i)*dist*2.), vec2(0.,0.), vec2(cos(i),sin(i)));
      }
    }
  }
  uv += 0.5;
  uv = rot(uv, vec2(0.5), progress*-speed);
  uv -= 0.5;
  uv.x /= ratio;
  uv += 0.5;
  uv = 2.*abs(uv/2.-floor(uv/2.+0.5));
  vec2 uvMix = mix(uv,uv0,cos(progress*PI*2.)/2.+0.5);
  vec4 color = mix(getFromColor(uvMix),getToColor(uvMix),cos((progress-1.)*PI)/2.+0.5);
	return color;
    
}
vec4 transition (vec2 uv) {
  vec4 color = mainImage(uv);
  return color;
}
`,author:"Boundless",license:"MIT",description:"The image folds into an animated kaleidoscope before revealing the incoming one",tags:["kaleidoscope","distort"],params:{scale:{type:"float",default:2},z:{type:"float",default:1.5},speed:{type:"float",default:5}},textures:[],createdAt:"Tue, 15 Mar 2022 07:18:34 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"randomNoisex",paramsTypes:{},defaultParams:{},glsl:`// Author: towrabbit
// License: MIT
// Description: The incoming image appears pixel by pixel in random noise
// Tags: dissolve, noise

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}
vec4 transition (vec2 uv) {
  vec4 leftSide = getFromColor(uv);
  vec4 rightSide = getToColor(uv);
  float uvz = floor(random(uv)+progress);
  return mix(leftSide,rightSide,uvz);
}
`,author:"towrabbit",license:"MIT",description:"The incoming image appears pixel by pixel in random noise",tags:["dissolve","noise"],params:{},textures:[],createdAt:"Wed, 28 Oct 2020 15:02:19 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"randomsquares",paramsTypes:{size:"ivec2",smoothness:"float"},defaultParams:{size:[10,10],smoothness:.5},glsl:`// Author: gre
// License: MIT
// Description: The incoming image appears in random squares
// Tags: squares, grid, dissolve

// @param Number of squares (columns, rows)
uniform ivec2 size; // = ivec2(10, 10)
// @param Softness of each square's switch
uniform float smoothness; // = 0.5
 
float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 transition(vec2 p) {
  float r = rand(floor(vec2(size) * p));
  float m = smoothstep(0.0, -smoothness, r - (progress * (1.0 + smoothness)));
  return mix(getFromColor(p), getToColor(p), m);
}
`,author:"gre",license:"MIT",description:"The incoming image appears in random squares",tags:["squares","grid","dissolve"],params:{size:{type:"ivec2",default:[10,10],description:"Number of squares (columns, rows)"},smoothness:{type:"float",default:.5,description:"Softness of each square's switch"}},textures:[],createdAt:"Sat, 27 May 2017 11:31:45 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"ripple",paramsTypes:{amplitude:"float",speed:"float"},defaultParams:{amplitude:100,speed:50},glsl:`// Author: gre
// License: MIT
// Description: Ripples spread from the center while crossfading
// Tags: ripple, wave, blend
// @param Frequency of the ripples
uniform float amplitude; // = 100.0
// @param Speed of the ripples
uniform float speed; // = 50.0

vec4 transition (vec2 uv) {
  vec2 dir = uv - vec2(.5);
  float dist = length(dir);
  vec2 offset = dir * (sin(progress * dist * amplitude - progress * speed) + .5) / 30. * progress;
  return mix(
    getFromColor(uv + offset),
    getToColor(uv),
    smoothstep(0.2, 1.0, progress)
  );
}
`,author:"gre",license:"MIT",description:"Ripples spread from the center while crossfading",tags:["ripple","wave","blend"],params:{amplitude:{type:"float",default:100,description:"Frequency of the ripples"},speed:{type:"float",default:50,description:"Speed of the ripples"}},textures:[],createdAt:"Fri, 26 May 2017 12:25:18 +0200",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"rotateTransition",paramsTypes:{},defaultParams:{},glsl:`// Author: haiyoucuv
// License: MIT
// Description: The images spin around the center while crossfading
// Tags: rotate, spin, blend

#define PI 3.1415926

vec2 rotate2D(in vec2 uv, in float angle){
  
  return uv * mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}
vec4 transition (vec2 uv) {
  
  vec2 p = fract(rotate2D(uv - 0.5, progress * PI * 2.0) + 0.5);

  return mix(
    getFromColor(p),
    getToColor(p),
    progress
  );
}
`,author:"haiyoucuv",license:"MIT",description:"The images spin around the center while crossfading",tags:["rotate","spin","blend"],params:{},textures:[],createdAt:"Thu, 25 Mar 2021 16:48:22 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"rotate_scale_fade",paramsTypes:{center:"vec2",rotations:"float",scale:"float",backColor:"vec4"},defaultParams:{center:[.5,.5],rotations:1,scale:8,backColor:[.15,.15,.15,1]},glsl:`// Author: Fernando Kuteken
// License: MIT
// Description: The outgoing image spins and zooms while fading to the incoming one, over a background color
// Tags: rotate, zoom, fade

#define PI 3.14159265359

// @param Center of the rotation
uniform vec2 center; // = vec2(0.5, 0.5)
// @param Number of turns
uniform float rotations; // = 1
// @param Maximum zoom
uniform float scale; // = 8
// @color Background color
uniform vec4 backColor; // = vec4(0.15, 0.15, 0.15, 1.0)

vec4 transition (vec2 uv) {
  
  vec2 difference = uv - center;
  vec2 dir = normalize(difference);
  float dist = length(difference);
  
  float angle = 2.0 * PI * rotations * progress;
  
  float c = cos(angle);
  float s = sin(angle);
  
  float currentScale = mix(scale, 1.0, 2.0 * abs(progress - 0.5));
  
  vec2 rotatedDir = vec2(dir.x  * c - dir.y * s, dir.x * s + dir.y * c);
  vec2 rotatedUv = center + rotatedDir * dist / currentScale;
  
  if (rotatedUv.x < 0.0 || rotatedUv.x > 1.0 ||
      rotatedUv.y < 0.0 || rotatedUv.y > 1.0)
    return backColor;
    
  return mix(getFromColor(rotatedUv), getToColor(rotatedUv), progress);
}
`,author:"Fernando Kuteken",license:"MIT",description:"The outgoing image spins and zooms while fading to the incoming one, over a background color",tags:["rotate","zoom","fade"],params:{center:{type:"vec2",default:[.5,.5],description:"Center of the rotation"},rotations:{type:"float",default:1,description:"Number of turns"},scale:{type:"float",default:8,description:"Maximum zoom"},backColor:{type:"vec4",default:[.15,.15,.15,1],color:!0,description:"Background color"}},textures:[],createdAt:"Mon, 29 May 2017 18:25:00 -0300",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"scale-in",paramsTypes:{},defaultParams:{},glsl:`// Author: haiyoucuv
// License: MIT
// Description: The incoming image scales in from the center while fading in
// Tags: zoom, fade

vec4 scale(in vec2 uv){
    uv = 0.5 + (uv - 0.5) * progress;
    return getToColor(uv);
}

vec4 transition (vec2 uv) {
  return mix(
    getFromColor(uv),
    scale(uv),
    progress
  );
}
`,author:"haiyoucuv",license:"MIT",description:"The incoming image scales in from the center while fading in",tags:["zoom","fade"],params:{},textures:[],createdAt:"Tue, 15 Mar 2022 20:21:46 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideInHorizontal",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The incoming image slides in as two halves moving horizontally in opposite directions
// Tags: slide, split, horizontal

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = reverse ? -1.0 : 1.0;
  vec2 toP = (uv.y > 0.5) ?
    vec2((uv.x - (progress * modifier)) + modifier, uv.y) :
    vec2((uv.x + (progress * modifier)) - modifier, uv.y);

  vec2 fromP = uv;

  return inBounds(toP) ? getToColor(toP) : getFromColor(fromP);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The incoming image slides in as two halves moving horizontally in opposite directions",tags:["slide","split","horizontal"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideInOutHorizontal",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The halves of both images slide horizontally in opposite directions, out and in at once
// Tags: slide, split, horizontal

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = (uv.y > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;
  vec2 fromP = vec2(uv.x + (progress * modifier), uv.y);
  vec2 toP = vec2((uv.x + (progress * modifier)) - modifier, uv.y);

  return inBounds(fromP) ? getFromColor(fromP) : getToColor(toP);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The halves of both images slide horizontally in opposite directions, out and in at once",tags:["slide","split","horizontal"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideInOutVertical",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The halves of both images slide vertically in opposite directions, out and in at once
// Tags: slide, split, vertical

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = (uv.x > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;
  vec2 fromP = vec2(uv.x, uv.y + (progress * modifier));
  vec2 toP = vec2(uv.x, (uv.y + (progress * modifier)) - modifier);

  return inBounds(fromP) ? getFromColor(fromP) : getToColor(toP);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The halves of both images slide vertically in opposite directions, out and in at once",tags:["slide","split","vertical"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideInVertical",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The incoming image slides in as two halves moving vertically in opposite directions
// Tags: slide, split, vertical

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = reverse ? -1.0 : 1.0;
  vec2 p = (uv.x > 0.5) ?
    vec2(uv.x, (uv.y - (progress * modifier)) + modifier) :
    vec2(uv.x, (uv.y + (progress * modifier)) - modifier);

  return inBounds(p) ? getToColor(p) : getFromColor(uv);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The incoming image slides in as two halves moving vertically in opposite directions",tags:["slide","split","vertical"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideOutHorizontal",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The outgoing image slides out as two halves moving horizontally in opposite directions
// Tags: slide, split, horizontal

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = (uv.y > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;
  vec2 p = vec2(uv.x + (progress * modifier), uv.y);

  return inBounds(p) ? getFromColor(p) : getToColor(uv);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The outgoing image slides out as two halves moving horizontally in opposite directions",tags:["slide","split","horizontal"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"splitSlideOutVertical",paramsTypes:{reverse:"bool"},defaultParams:{reverse:!1},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: The outgoing image slides out as two halves moving vertically in opposite directions
// Tags: slide, split, vertical

// @param Swap the directions of the halves
uniform bool reverse; // = false

const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);

bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}

vec4 transition (vec2 uv) {
  float modifier = (uv.x > 0.5 ? 1.0 : -1.0) * (reverse ? -1.0 : 1.0) ;
  vec2 p = vec2(uv.x, uv.y + (progress * modifier));

  return inBounds(p) ? getFromColor(p) : getToColor(uv);
}
`,author:"OllyOllyOlly",license:"MIT",description:"The outgoing image slides out as two halves moving vertically in opposite directions",tags:["slide","split","vertical"],params:{reverse:{type:"bool",default:!1,description:"Swap the directions of the halves"}},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"squareswire",paramsTypes:{squares:"ivec2",direction:"vec2",smoothness:"float"},defaultParams:{squares:[10,10],direction:[1,-.5],smoothness:1.6},glsl:`// Author: gre
// License: MIT
// Description: Squares grow along a diagonal sweep to reveal the incoming image
// Tags: squares, grid, wipe, directional
 
// @param Number of squares (columns, rows)
uniform ivec2 squares;// = ivec2(10,10)
// @param Direction of the sweep
uniform vec2 direction;// = vec2(1.0, -0.5)
// @param Softness of the sweep
uniform float smoothness; // = 1.6

const vec2 center = vec2(0.5, 0.5);
vec4 transition (vec2 p) {
  vec2 v = normalize(direction);
  v /= abs(v.x)+abs(v.y);
  float d = v.x * center.x + v.y * center.y;
  float offset = smoothness;
  float pr = smoothstep(-offset, 0.0, v.x * p.x + v.y * p.y - (d-0.5+progress*(1.+offset)));
  vec2 squarep = fract(p*vec2(squares));
  vec2 squaremin = vec2(pr/2.0);
  vec2 squaremax = vec2(1.0 - pr/2.0);
  float a = (1.0 - step(progress, 0.0)) * step(squaremin.x, squarep.x) * step(squaremin.y, squarep.y) * step(squarep.x, squaremax.x) * step(squarep.y, squaremax.y);
  return mix(getFromColor(p), getToColor(p), a);
}
`,author:"gre",license:"MIT",description:"Squares grow along a diagonal sweep to reveal the incoming image",tags:["squares","grid","wipe","directional"],params:{squares:{type:"ivec2",default:[10,10],description:"Number of squares (columns, rows)"},direction:{type:"vec2",default:[1,-.5],description:"Direction of the sweep"},smoothness:{type:"float",default:1.6,description:"Softness of the sweep"}},textures:[],createdAt:"Fri, 26 May 2017 12:48:21 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"squeeze",paramsTypes:{colorSeparation:"float"},defaultParams:{colorSeparation:.04},glsl:`// Author: gre
// License: MIT
// Description: The outgoing image is squeezed into a line with color separation, revealing the incoming one
// Tags: squeeze, chromatic, vertical
 
// @param Amount of color separation
uniform float colorSeparation; // = 0.04
 
vec4 transition (vec2 uv) {
  float y = 0.5 + (uv.y-0.5) / (1.0-progress);
  if (y < 0.0 || y > 1.0) {
     return getToColor(uv);
  }
  else {
    vec2 fp = vec2(uv.x, y);
    vec2 off = progress * vec2(0.0, colorSeparation);
    vec4 c = getFromColor(fp);
    vec4 cn = getFromColor(fp - off);
    vec4 cp = getFromColor(fp + off);
    return vec4(cn.r, c.g, cp.b, c.a);
  }
}
`,author:"gre",license:"MIT",description:"The outgoing image is squeezed into a line with color separation, revealing the incoming one",tags:["squeeze","chromatic","vertical"],params:{colorSeparation:{type:"float",default:.04,description:"Amount of color separation"}},textures:[],createdAt:"Fri, 26 May 2017 12:34:44 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"static_wipe",paramsTypes:{u_transitionUpToDown:"bool",u_max_static_span:"float"},defaultParams:{u_transitionUpToDown:!0,u_max_static_span:.5},glsl:`// Author: Ben Lucas
// License: MIT
// Description: A wipe from top to bottom with a band of TV static at its edge
// Tags: wipe, static, noise, vertical

#define PI 3.14159265359

float rnd (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(10,70)))*
        12345.5453123);
}

// @param Wipe from top to bottom; false wipes from bottom to top
uniform bool u_transitionUpToDown; // = true
// @param Maximum height of the static band
uniform float u_max_static_span; // = 0.5

vec4 transition (vec2 uv) {
  

  float span = u_max_static_span*pow(sin(PI*progress),0.5);
  
  float transitionEdge = u_transitionUpToDown ? 1.0-uv.y : uv.y;
  float mixRatio = 1.0 - step(progress, transitionEdge);

  vec4 transitionMix = mix(
    getFromColor(uv),
    getToColor(uv),
    mixRatio
  );
  
  float noiseEnvelope = smoothstep(progress-span, progress, transitionEdge) * (1.0 - smoothstep(progress, progress + span, transitionEdge));
  vec4 noise = vec4(vec3(rnd(uv*(1.0+progress))), 1.0);
  

  return mix(transitionMix, noise, noiseEnvelope);
}
`,author:"Ben Lucas",license:"MIT",description:"A wipe from top to bottom with a band of TV static at its edge",tags:["wipe","static","noise","vertical"],params:{u_transitionUpToDown:{type:"bool",default:!0,description:"Wipe from top to bottom; false wipes from bottom to top"},u_max_static_span:{type:"float",default:.5,description:"Maximum height of the static band"}},textures:[],createdAt:"Tue, 4 Apr 2023 03:29:01 -0400",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"swap",paramsTypes:{reflection:"float",perspective:"float",depth:"float"},defaultParams:{reflection:.4,perspective:.2,depth:3},glsl:`// Author: gre
// License: MIT
// Description: The two images swap places in 3D, with a floor reflection
// Tags: 3d, swap, reflection
// General parameters
// @param Strength of the reflection
uniform float reflection; // = 0.4
// @param Amount of perspective
uniform float perspective; // = 0.2
uniform float depth; // = 3.0
 
const vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
const vec2 boundMin = vec2(0.0, 0.0);
const vec2 boundMax = vec2(1.0, 1.0);
 
bool inBounds (vec2 p) {
  return all(lessThan(boundMin, p)) && all(lessThan(p, boundMax));
}
 
vec2 project (vec2 p) {
  return p * vec2(1.0, -1.2) + vec2(0.0, -0.02);
}
 
vec4 bgColor (vec2 p, vec2 pfr, vec2 pto) {
  vec4 c = black;
  pfr = project(pfr);
  if (inBounds(pfr)) {
    c += mix(black, getFromColor(pfr), reflection * mix(1.0, 0.0, pfr.y));
  }
  pto = project(pto);
  if (inBounds(pto)) {
    c += mix(black, getToColor(pto), reflection * mix(1.0, 0.0, pto.y));
  }
  return c;
}
 
vec4 transition(vec2 p) {
  vec2 pfr, pto = vec2(-1.);
 
  float size = mix(1.0, depth, progress);
  float persp = perspective * progress;
  pfr = (p + vec2(-0.0, -0.5)) * vec2(size/(1.0-perspective*progress), size/(1.0-size*persp*p.x)) + vec2(0.0, 0.5);
 
  size = mix(1.0, depth, 1.-progress);
  persp = perspective * (1.-progress);
  pto = (p + vec2(-1.0, -0.5)) * vec2(size/(1.0-perspective*(1.0-progress)), size/(1.0-size*persp*(0.5-p.x))) + vec2(1.0, 0.5);

  if (progress < 0.5) {
    if (inBounds(pfr)) {
      return getFromColor(pfr);
    }
    if (inBounds(pto)) {
      return getToColor(pto);
    }  
  }
  if (inBounds(pto)) {
    return getToColor(pto);
  }
  if (inBounds(pfr)) {
    return getFromColor(pfr);
  }
  return bgColor(p, pfr, pto);
}
`,author:"gre",license:"MIT",description:"The two images swap places in 3D, with a floor reflection",tags:["3d","swap","reflection"],params:{reflection:{type:"float",default:.4,description:"Strength of the reflection"},perspective:{type:"float",default:.2,description:"Amount of perspective"},depth:{type:"float",default:3}},textures:[],createdAt:"Sat, 27 May 2017 11:36:00 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"tangentMotionBlur",paramsTypes:{},defaultParams:{},glsl:`
// License: MIT
// Author: chenkai
// Description: The outgoing image is flung away along a curve with motion blur
// Tags: motion-blur, rotate, slide
// ported from https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/671116/

float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
 
// motion blur for texture from
vec4 motionBlurFrom(vec2 _st, vec2 speed) {
    vec2 texCoord = _st.xy / vec2(1.0).xy;
    vec3 color = vec3(0.0);
    float total = 0.0;
    float offset = rand(_st);
    for (float t = 0.0; t <= 20.0; t++) {
        float percent = (t + offset) / 20.0;
        float weight = 4.0 * (percent - percent * percent);
        vec2 newuv = texCoord + speed * percent;
        newuv = fract(newuv);
        color += getFromColor(newuv).rgb * weight;
        total += weight;
    }
    return vec4(color / total, 1.0);
}

// motion blur for texture to
vec4 motionBlurTo(vec2 _st, vec2 speed) {
    vec2 texCoord = _st.xy / vec2(1.0).xy;
    vec3 color = vec3(0.0);
    float total = 0.0;
    float offset = rand(_st);
    for (float t = 0.0; t <= 20.0; t++) {
        float percent = (t + offset) / 20.0;
        float weight = 4.0 * (percent - percent * percent);
        vec2 newuv = texCoord + speed * percent;
        newuv = fract(newuv);
        color += getToColor(newuv).rgb * weight;
        total += weight;
    }
    return vec4(color / total, 1.0);
}


// bezier in gpu
float A(float aA1, float aA2) {
    return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}
float B(float aA1, float aA2) {
    return 3.0 * aA2 - 6.0 * aA1;
}
float C(float aA1) {
    return 3.0 * aA1;
}
float GetSlope(float aT, float aA1, float aA2) {
    return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
}
float CalcBezier(float aT, float aA1, float aA2) {
    return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
}
float GetTForX(float aX, float mX1, float mX2) {
    // iteration to solve
    float aGuessT = aX;
    for (int i = 0; i < 4; ++i) {
        float currentSlope = GetSlope(aGuessT, mX1, mX2);
        if (currentSlope == 0.0) return aGuessT;
        float currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
}
float KeySpline(float aX, float mX1, float mY1, float mX2, float mY2) {
    if (mX1 == mY1 && mX2 == mY2) return aX; // linear
    return CalcBezier(GetTForX(aX, mX1, mX2), mY1, mY2); // x to t, t to y
}

// norm distribution
float normpdf(float x) {
    float d = x - .5;
    return exp(-20.*d*d);
}

vec2 rotateUv(vec2 uv, float angle, vec2 anchor, float zDirection) {
    uv = uv - anchor; // anchor to origin
    float s = sin(angle);
	float c = cos(angle);
	mat2 m = mat2(c, -s, s, c);
    uv = m * uv;
    uv += anchor; // anchor back
    return uv;
}



vec4 transition (vec2 uv) {
    
    vec2 myst = uv;
    float animationTime = progress; //getAnimationTime();
    float easingTime = KeySpline(animationTime, .68,.01,.17,.98);
    float blur = normpdf(easingTime);
    float r = 0.;
    float rotation = 180./180.*3.14159;
    if (easingTime <= .5) {
        r = rotation * easingTime;
    } else {
        r = -rotation + rotation * easingTime;
    }

    // rotation for current frame
    vec2 mystCurrent = myst;
    mystCurrent.y *= 1./ratio;
    mystCurrent = rotateUv(mystCurrent, r, vec2(1., 0.), -1.);
    mystCurrent.y *= ratio;
    
    // frame timeInterval by fps=30
    float timeInterval = 0.0167*2.0;
    if (easingTime <= .5) {
        r = rotation * (easingTime+timeInterval);
    } else {
        r = -rotation + rotation * (easingTime+timeInterval);
    }
    
    // rotation for next frame
    vec2 mystNext = myst;
    mystNext.y *= 1./ratio;
    mystNext = rotateUv(mystNext, r, vec2(1., 0.), -1.);
    mystNext.y *= ratio;
    
    // get speed at tagent direction
    vec2 speed  = (mystNext - mystCurrent) / timeInterval * blur * 0.5;
    if (easingTime <= .5) {
        return motionBlurFrom(mystCurrent, speed);
    } else {
        return motionBlurTo(mystCurrent, speed);
    }
}

`,author:"chenkai",license:"MIT",description:"The outgoing image is flung away along a curve with motion blur",tags:["motion-blur","rotate","slide"],params:{},textures:[],createdAt:"Wed, 25 Mar 2020 10:46:29 +0800",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"undulatingBurnOut",paramsTypes:{smoothness:"float",center:"vec2",color:"vec3"},defaultParams:{smoothness:.03,center:[.5,.5],color:[0,0,0]},glsl:`// License: MIT
// Author: pthrasher
// Description: A circle with a wavy edge burns out from the center to reveal the incoming image
// Tags: circle, burn, wipe
// adapted by gre from https://gist.github.com/pthrasher/8e6226b215548ba12734

// @param Softness of the edge
uniform float smoothness; // = 0.03
// @param Center of the circle
uniform vec2 center; // = vec2(0.5)
// @color Color of the burning edge
uniform vec3 color; // = vec3(0.0)

const float M_PI = 3.14159265358979323846;

float quadraticInOut(float t) {
  float p = 2.0 * t * t;
  return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

float getGradient(float r, float dist) {
  float d = r - dist;
  return mix(
    smoothstep(-smoothness, 0.0, r - dist * (1.0 + smoothness)),
    -1.0 - step(0.005, d),
    step(-0.005, d) * step(d, 0.01)
  );
}

float getWave(vec2 p){
  vec2 _p = p - center; // offset from center
  float rads = atan(_p.y, _p.x);
  float degs = degrees(rads) + 180.0;
  vec2 range = vec2(0.0, M_PI * 30.0);
  vec2 domain = vec2(0.0, 360.0);
  float ratio = (M_PI * 30.0) / 360.0;
  degs = degs * ratio;
  float x = progress;
  float magnitude = mix(0.02, 0.09, smoothstep(0.0, 1.0, x));
  float offset = mix(40.0, 30.0, smoothstep(0.0, 1.0, x));
  float ease_degs = quadraticInOut(sin(degs));
  float deg_wave_pos = (ease_degs * magnitude) * sin(x * offset);
  // The soft edge reaches \`smoothness\` beyond the radius and the burn band 0.005 inside it:
  // start the radius below both so nothing but the outgoing image shows at progress 0
  // (unchanged from progress 0.1 on).
  return x - max(smoothness, 0.01) * (1.0 - smoothstep(0.0, 0.1, x)) + deg_wave_pos;
}

vec4 transition(vec2 p) {
  float dist = distance(center, p);
  float m = getGradient(getWave(p), dist);
  vec4 cfrom = getFromColor(p);
  vec4 cto = getToColor(p);
  return mix(mix(cfrom, cto, m), mix(cfrom, vec4(color, 1.0), 0.75), step(m, -2.0));
}
`,author:"pthrasher",license:"MIT",description:"A circle with a wavy edge burns out from the center to reveal the incoming image",tags:["circle","burn","wipe"],params:{smoothness:{type:"float",default:.03,description:"Softness of the edge"},center:{type:"vec2",default:[.5,.5],description:"Center of the circle"},color:{type:"vec3",default:[0,0,0],color:!0,description:"Color of the burning edge"}},textures:[],createdAt:"Mon, 12 Jun 2017 10:23:37 +0800",updatedAt:"Sat, 10 Oct 2026 11:26:01 +0200"},{name:"wind",paramsTypes:{size:"float",reversed:"bool"},defaultParams:{size:.2,reversed:!1},glsl:`// Author: gre
// License: MIT
// Description: A ragged left-to-right wipe, as if the image was blown away by the wind
// Tags: wipe, horizontal, noise

// @range(0, 1) Width of the ragged edge
uniform float size; // = 0.2
// @param Wipe from right to left instead
uniform bool reversed; // = false

float rand (vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 transition (vec2 uv) {
  float x = reversed ? 1. - uv.x : uv.x;
  float r = rand(vec2(0, uv.y));
  float m = smoothstep(0.0, -size, x*(1.0-size) + size*r - (progress * (1.0 + size)));
  return mix(
    getFromColor(uv),
    getToColor(uv),
    m
  );
}
`,author:"gre",license:"MIT",description:"A ragged left-to-right wipe, as if the image was blown away by the wind",tags:["wipe","horizontal","noise"],params:{size:{type:"float",default:.2,min:0,max:1,description:"Width of the ragged edge"},reversed:{type:"bool",default:!1,description:"Wipe from right to left instead"}},textures:[],createdAt:"Fri, 26 May 2017 09:55:44 +0200",updatedAt:"Fri, 9 Oct 2026 22:46:55 +0200"},{name:"windowblinds",paramsTypes:{},defaultParams:{},glsl:`// Author: Fabien Benetou
// License: MIT
// Description: A crossfade through horizontal window blinds
// Tags: blinds, stripes, blend

vec4 transition (vec2 uv) {
  float t = progress;
  
  if (mod(floor(uv.y*100.*progress),2.)==0.)
    t*=2.-.5;
  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    mix(t, progress, smoothstep(0.8, 1.0, progress))
  );
}
`,author:"Fabien Benetou",license:"MIT",description:"A crossfade through horizontal window blinds",tags:["blinds","stripes","blend"],params:{},textures:[],createdAt:"Wed, 31 May 2017 14:11:48 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"windowslice",paramsTypes:{count:"float",smoothness:"float"},defaultParams:{count:10,smoothness:.5},glsl:`// Author: gre
// License: MIT
// Description: The incoming image appears through vertical slices that widen
// Tags: slices, stripes, wipe

// @param Number of slices
uniform float count; // = 10.0
// @param Softness of the slices' edges
uniform float smoothness; // = 0.5

vec4 transition (vec2 p) {
  float pr = smoothstep(-smoothness, 0.0, p.x - progress * (1.0 + smoothness));
  float s = step(pr, fract(count * p.x));
  return mix(getFromColor(p), getToColor(p), s);
}
`,author:"gre",license:"MIT",description:"The incoming image appears through vertical slices that widen",tags:["slices","stripes","wipe"],params:{count:{type:"float",default:10,description:"Number of slices"},smoothness:{type:"float",default:.5,description:"Softness of the slices' edges"}},textures:[],createdAt:"Wed, 28 Mar 2018 17:23:26 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"wipeDown",paramsTypes:{},defaultParams:{},glsl:`// Author: Jake Nelson
// License: MIT
// Description: A hard-edged wipe from top to bottom
// Tags: wipe, vertical

vec4 transition(vec2 uv) {
  vec2 p=uv.xy/vec2(1.0).xy;
  vec4 a=getFromColor(p);
  vec4 b=getToColor(p);
  return mix(a, b, step(1.0-p.y,progress));
}
`,author:"Jake Nelson",license:"MIT",description:"A hard-edged wipe from top to bottom",tags:["wipe","vertical"],params:{},textures:[],createdAt:"Wed, 1 Nov 2017 15:26:01 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"wipeLeft",paramsTypes:{},defaultParams:{},glsl:`// Author: Jake Nelson
// License: MIT
// Description: A hard-edged wipe from right to left
// Tags: wipe, horizontal

vec4 transition(vec2 uv) {
  vec2 p=uv.xy/vec2(1.0).xy;
  vec4 a=getFromColor(p);
  vec4 b=getToColor(p);
  return mix(a, b, step(1.0-p.x,progress));
}
`,author:"Jake Nelson",license:"MIT",description:"A hard-edged wipe from right to left",tags:["wipe","horizontal"],params:{},textures:[],createdAt:"Wed, 1 Nov 2017 15:26:28 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"wipeRight",paramsTypes:{},defaultParams:{},glsl:`// Author: Jake Nelson
// License: MIT
// Description: A hard-edged wipe from left to right
// Tags: wipe, horizontal

vec4 transition(vec2 uv) {
  vec2 p=uv.xy/vec2(1.0).xy;
  vec4 a=getFromColor(p);
  vec4 b=getToColor(p);
  return mix(a, b, step(0.0+p.x,progress));
}
`,author:"Jake Nelson",license:"MIT",description:"A hard-edged wipe from left to right",tags:["wipe","horizontal"],params:{},textures:[],createdAt:"Wed, 1 Nov 2017 15:27:02 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"wipeUp",paramsTypes:{},defaultParams:{},glsl:`// Author: Jake Nelson
// License: MIT
// Description: A hard-edged wipe from bottom to top
// Tags: wipe, vertical

vec4 transition(vec2 uv) {
  vec2 p=uv.xy/vec2(1.0).xy;
  vec4 a=getFromColor(p);
  vec4 b=getToColor(p);
  return mix(a, b, step(0.0+p.y,progress));
}
`,author:"Jake Nelson",license:"MIT",description:"A hard-edged wipe from bottom to top",tags:["wipe","vertical"],params:{},textures:[],createdAt:"Wed, 1 Nov 2017 15:24:36 -0500",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"},{name:"x_axis_translation",paramsTypes:{},defaultParams:{},glsl:`// Author: lizhongjian
// License: MIT
// Description: The outgoing image slides to the right, uncovering a crossfade to the incoming one
// Tags: slide, horizontal, blend

vec4 transition (vec2 uv) {
  vec2 newUV = uv;
  newUV.x -= progress;
  if(uv.x >= progress)
  {
    return getFromColor(newUV);
  }

  
  return mix(
    getFromColor(uv),
    getToColor(uv),
    progress
  );
}
`,author:"lizhongjian",license:"MIT",description:"The outgoing image slides to the right, uncovering a crossfade to the incoming one",tags:["slide","horizontal","blend"],params:{},textures:[],createdAt:"Tue, 4 Apr 2023 15:34:35 +0800",updatedAt:"Sat, 10 Oct 2026 10:11:31 +0200"},{name:"zoomInOut",paramsTypes:{},defaultParams:{},glsl:`// Author: OllyOllyOlly
// License: MIT
// Description: Zooms into the outgoing image until it blurs into a flat color, then out to the incoming one
// Tags: zoom, blur

vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * (1.0 - amount));
}

vec4 transition (vec2 uv) {
  float zoomFrom = smoothstep(0.0, 1.0, progress * 2.0);
  float zoomTo = smoothstep(0.0, 1.0, (1.0 - progress) * 2.0);
  float crossfade = smoothstep(0.4, 0.6, progress);
  return mix(
    getFromColor(zoom(uv, zoomFrom)),
    getToColor(zoom(uv, zoomTo)),
    crossfade
  );
}
`,author:"OllyOllyOlly",license:"MIT",description:"Zooms into the outgoing image until it blurs into a flat color, then out to the incoming one",tags:["zoom","blur"],params:{},textures:[],createdAt:"Wed, 1 Apr 2026 19:33:08 +0200",updatedAt:"Fri, 9 Oct 2026 23:10:29 +0200"}];const c=i(s),u=l({__proto__:null,default:c},[s]);export{u as i};
