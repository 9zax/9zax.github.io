<script>
  import { onMount, onDestroy } from "svelte";

  // Shader component type from shaders.com (e.g. "Aurora", "Plasma", "FlowingGradient")
  export let type = "Aurora";
  // Props forwarded to the shader component
  export let props = {};
  export let className = "";

  let canvas;
  let shader;

  onDestroy(() => {
    shader?.destroy();
    shader = null;
  });

  onMount(async () => {
    // Ambient animation is skipped entirely for reduced-motion users
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      const { createShader, isWebGPUSupported } = await import("shaders/js");
      if (!(await isWebGPUSupported())) return; // canvas stays transparent
      shader = await createShader(
        canvas,
        { components: [{ type, id: "bg", props }] },
        { onError: () => {} },
      );
    } catch {
      /* No WebGPU or init failed — leave the canvas transparent */
    }
  });
</script>

<canvas bind:this={canvas} class={className} aria-hidden="true"></canvas>
