<script>
  import { onMount, onDestroy } from "svelte";

  // Image sources to cycle through with GL Transitions
  export let images = [];
  // ms each GL transition takes
  export let duration = 1600;
  // ms to hold the current image before transitioning to the next
  export let interval = 4200;

  let canvas;
  let raf = 0;
  let disposeFns = [];

  onDestroy(() => {
    cancelAnimationFrame(raf);
    disposeFns.forEach((fn) => fn());
    disposeFns = [];
  });

  onMount(async () => {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: true,
    });
    // No WebGL: stay transparent so the plain <img> crossfade below stays visible
    if (!gl) return;

    const [glTransition, glTransitions] = await Promise.all([
      import("gl-transition"),
      import("gl-transitions"),
    ]);
    const createTransition = glTransition.default ?? glTransition;
    // The CJS transitions array can be nested under any export name after
    // bundling ({i:{default:{default:[...]}}}) — deep-search the module tree
    const findTransitions = (mod) => {
      const seen = new Set();
      const stack = [mod];
      while (stack.length) {
        const v = stack.pop();
        if (Array.isArray(v)) return v;
        if (v && typeof v === "object" && !seen.has(v)) {
          seen.add(v);
          for (const key of Object.keys(v)) stack.push(v[key]);
        }
      }
      return null;
    };
    const transitions = findTransitions(glTransitions);
    if (!Array.isArray(transitions) || !transitions.length) return;

    const loaded = await Promise.all(
      images.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          }),
      ),
    );
    if (loaded.some((img) => !img)) return;

    // Big triangle covering the canvas — gl-transition draws 3 vertices on it
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const makeTexture = (img) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return {
        shape: [img.width, img.height],
        bind: (unit) => {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          return unit;
        },
      };
    };
    const textures = loaded.map(makeTexture);

    const byName = (name) =>
      transitions.find((t) => t.name === name) || transitions[0];
    const picks = [
      "Fade",
      "CrossWarp",
      "Mosaic",
      "PolkaDotsCurtain",
      "GlitchMemories",
    ].map(byName);
    const fade = createTransition(gl, byName("Fade"));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // gl-transition assumes the caller owns the viewport
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let cur = 0;
    let trans = null;
    let pickIdx = 0;
    let cycleStart = performance.now();

    const loop = (now) => {
      if (now - cycleStart >= interval + duration) {
        cycleStart = now;
        cur = (cur + 1) % textures.length;
        trans?.dispose();
        trans = createTransition(gl, picks[pickIdx++ % picks.length]);
      }
      const elapsed = now - cycleStart;
      const w = canvas.width;
      const h = canvas.height;
      if (elapsed < interval || !trans) {
        // Hold phase: draw the current image via a 0-progress Fade
        fade.draw(0, textures[cur], textures[cur], w, h);
      } else {
        const progress = Math.min(1, (elapsed - interval) / duration);
        trans.draw(
          progress,
          textures[cur],
          textures[(cur + 1) % textures.length],
          w,
          h,
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    disposeFns.push(() => {
      ro.disconnect();
      fade.dispose();
      trans?.dispose();
      textures.length = 0;
      gl.deleteBuffer(buffer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    });
  });
</script>

<canvas
  bind:this={canvas}
  class="absolute inset-0 w-full h-full z-20 pointer-events-none"
  aria-hidden="true"
></canvas>
