<script>
  import { base } from "$app/paths";
  import Logo from "$lib/components/Logo.svelte";
  import GLProfile from "$lib/components/GLProfile.svelte";
  import ShaderBackground from "$lib/components/ShaderBackground.svelte";
  import { onMount } from "svelte";
  import { t, locale, toggleLocale } from "$lib/stores/i18n.js";

  let mounted = false;
  let scrollY = 0;

  const profileImages = [
    `${base}/profile-1.png`,
    `${base}/profile-2.png`,
    `${base}/profile-3.png`,
  ];
  let currentImageIndex = 0;

  onMount(() => {
    mounted = true;
    const interval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % profileImages.length;
    }, 4000);

    return () => clearInterval(interval);
  });

  const parseUrl = (text) => {
    if (!text) return "";
    const urlRegex =
      /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    return text.replace(urlRegex, (url) => {
      let href = url;
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        href = "https://" + href;
      }
      // Clean up common trailing punctuation from URL parsing
      const lastChar = href.slice(-1);
      let trailing = "";
      if ([".", ",", ")", "]"].includes(lastChar)) {
        href = href.slice(0, -1);
        url = url.slice(0, -1);
        trailing = lastChar;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-white hover:text-zinc-300 underline underline-offset-2 transition-colors relative z-10">${url}</a>${trailing}`;
    });
  };

  $: experiences = [
    {
      company: $t("experience.exp1_company"),
      period: $t("experience.exp1_period"),
      projects: [
        {
          name: $t("experience.exp1_p1_name"),
          role: "Senior Frontend Developer",
          description: $t("experience.exp1_p1_desc"),
          technologies: [
            "React",
            "TypeScript",
            "Tailwind CSS v4",
            "Node.js",
            "Prisma",
            "PostgreSQL",
            "Vitest",
          ],
        },
        {
          name: $t("experience.exp1_p2_name"),
          role: "Senior Frontend Developer",
          description: $t("experience.exp1_p2_desc"),
          technologies: [
            "React",
            "Tailwind CSS",
            "Storybook",
            "Design Tokens",
            "GitHub Actions",
            "GitHub Packages",
          ],
        },
        {
          name: $t("experience.exp1_p3_name"),
          role: "Full Stack",
          description: $t("experience.exp1_p3_desc"),
          technologies: [
            "Anthropic API (LLM)",
            "Shell",
            "GitHub Actions",
            "TypeScript",
          ],
        },
        {
          name: $t("experience.exp1_p4_name"),
          role: "Full Stack",
          description: $t("experience.exp1_p4_desc"),
          technologies: [
            "Chrome MV3",
            "OpenAI Realtime API",
            "WebSocket Relay",
            "Gemini API",
            "Google TTS",
            "Tauri",
            "Typhoon ASR",
          ],
        },
      ],
    },
    {
      company: $t("experience.exp2_company"),
      period: $t("experience.exp2_period"),
      projects: [
        {
          name: $t("experience.exp2_p1_name"),
          role: "Frontend",
          description: $t("experience.exp2_p1_desc"),
          technologies: ["React", "Swift (IOS)", "Flutter"],
        },
        {
          name: $t("experience.exp2_p2_name"),
          role: "Full Stack",
          description: $t("experience.exp2_p2_desc"),
          technologies: [
            "Vue",
            "Nuxt",
            "Strapi (CMS)",
            "Go",
            "GitLab CI/CD",
            "Kubernetes",
            "ArgoCD",
            "Airflow",
            "Superset",
          ],
        },
        {
          name: $t("experience.exp2_p3_name"),
          role: "Full Stack",
          description: $t("experience.exp2_p3_desc"),
          technologies: ["SvelteKit", "Supabase", "AI (LLM)", "Tailwind CSS"],
        },
        {
          name: $t("experience.exp2_p4_name"),
          role: "Frontend",
          description: $t("experience.exp2_p4_desc"),
          technologies: ["Svelte", "Manifest V3"],
        },
        {
          name: $t("experience.exp2_p5_name"),
          role: "Full Stack",
          description: $t("experience.exp2_p5_desc"),
          technologies: ["Strapi (CMS)", "Nuxt", "Vue", "Tailwind CSS"],
        },
      ],
    },
    {
      company: $t("experience.exp3_company"),
      period: $t("experience.exp3_period"),
      projects: [
        {
          name: $t("experience.exp3_p1_name"),
          role: "Senior Programmer & Technical Lead",
          description: $t("experience.exp3_p1_desc"),
          technologies: [
            "SvelteKit",
            "NestJS",
            "PostgreSQL",
            "Prisma",
            "MongoDB",
            "MS SQL",
            "Docker",
            "Nginx",
            "Kubernetes",
            "Jenkins",
            "GitLab CI",
            "Keycloak",
            "Proxmox",
            "PowerDNS",
          ],
          keyProjects: [
            $t("experience.exp3_kp1"),
            $t("experience.exp3_kp2"),
            $t("experience.exp3_kp3"),
            $t("experience.exp3_kp4"),
            $t("experience.exp3_kp5"),
          ],
        },
      ],
    },
    {
      company: $t("experience.exp4_company"),
      period: $t("experience.exp4_period"),
      projects: [
        {
          name: $t("experience.exp4_p1_name"),
          role: "Frontend",
          description: $t("experience.exp4_p1_desc"),
          technologies: [
            "Angular 6",
            "Redux",
            "Bootstrap 4",
            "HapiJS",
            "NodeJS",
          ],
        },
      ],
    },
    {
      company: $t("experience.exp5_company"),
      period: $t("experience.exp5_period"),
      projects: [
        {
          name: $t("experience.exp5_p1_name"),
          role: "Frontend",
          description: $t("experience.exp5_p1_desc"),
          technologies: ["PHR", "Python", "C# .Net Core"],
        },
      ],
    },
  ];

  const skills = {
    ai: [
      "AI-assisted development (Claude Code)",
      "Agentic workflows (hooks, skills, subagents)",
      "Anthropic API (Claude)",
      "OpenAI Realtime API (STT)",
      "Thai ASR & speaker diarization (Typhoon)",
    ],
    language: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Go",
      "Java",
      "C#",
      "Swift",
      "Kotlin",
      "Dart",
    ],
    frontend: [
      "HTML/CSS",
      "Tailwind CSS",
      "React",
      "Svelte",
      "Vue",
      "NuxtJs",
      "Angular",
      "Quasar Framework",
    ],
    backend: [
      "Node.js",
      "Express",
      "Fastify",
      "NestJS",
      "Strapi",
      "Prisma",
      "Go-gin",
      ".NET Core",
      "SvelteKit",
    ],
    database: [
      "MongoDB",
      "Firebase",
      "PostgreSQL",
      "Supabase",
      "SQLite",
      "MySQL",
      "MS SQL",
    ],
    mobile: ["Flutter", "iOS Native", "Android Native", "React Native"],
    devops: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "GitHub Packages",
      "ArgoCD",
      "Nginx",
      "Apache",
      "Kong",
      "Cloudflare",
      "PowerDNS",
      "Proxmox",
    ],
    other: [
      "Storybook",
      "Chrome Extension (MV3)",
      "Wails",
      "Tauri",
      "Jest",
      "Vitest",
      "Selenium",
      "Cypress",
      "Playwright",
      "JMeter",
      "K6",
      "JWT",
      "OAuth",
      "Keycloak",
    ],
  };

  const education = {
    degree: "B.S. Computer Science",
    university: "Udon Thani Rajabhat University",
  };

  const contact = {
    address: "Bueng Kan, Thailand",
    phone: "+6692-947-9535",
    email: "nakarin.weerasak@gmail.com",
    github: "github.com/9zax",
    linkedin: "linkedin.com/in/9zax",
    medium: "medium.com/@ctzcz",
  };
</script>

<svelte:window bind:scrollY />

<svelte:head>
  <title>Nakarin Weerasak | Software Engineer</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<main
  id="cv-content"
  class="min-h-screen bg-[#000000] text-[#A1A1AA] font-['Inter'] selection:bg-zinc-800/50 selection:text-white overflow-x-hidden relative"
>
  <!-- Minimalist Background Grid -->
  <div
    class="fixed inset-0 z-0 pointer-events-none"
    style="background-image: radial-gradient(rgba(255, 255, 255, 0-[0].1) 1px, transparent 1px); background-size: 32px 32px; opacity: 0.3;"
  ></div>

  <!-- Subtle top glow -->
  <div
    class="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white opacity-[0.02] blur-[150px] pointer-events-none z-0 rounded-full"
  ></div>

  <div class="relative z-10">
    <!-- Ultra-clean Header -->
    <header
      id="main-nav"
      class="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md transition-all {scrollY >
      20
        ? 'border-b border-zinc-800/50 py-4'
        : 'py-6'}"
    >
      <div class="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a
          href="/"
          class="text-xl font-['Outfit'] font-semibold text-white tracking-tight no-underline hover:opacity-80 transition-opacity"
        >
          Nakarin.
        </a>
        <div class="flex items-center gap-6">
          <nav class="hidden md:flex items-center gap-6">
            <a
              href="#about"
              class="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >{$t("nav.about")}</a
            >
            <a
              href="#experience"
              class="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >{$t("nav.experience")}</a
            >
            <a
              href="#skills"
              class="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >{$t("nav.skills")}</a
            >
            <a
              href="#contact"
              class="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >{$t("nav.contact")}</a
            >
          </nav>

          <div
            class="flex items-center gap-3 border-l border-zinc-800/50 pl-6 ml-2"
          >
            <!-- PDF Download Link (Passing Locale) -->
            <a
              href="{base}/pdf?lang={$locale}"
              target="_blank"
              class="group flex items-center justify-center w-14 h-9 rounded-full bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-500/30 hover:bg-zinc-800/50 transition-all duration-300"
              aria-label="Download CV as PDF"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-zinc-400 group-hover:text-white transition-colors"
                ><path d="M6 9V2h12v7"></path><path
                  d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                ></path><rect x="6" y="14" width="12" height="8"></rect></svg
              >
            </a>

            <!-- Language Toggle Button -->
            <button
              on:click={toggleLocale}
              class="group relative flex items-center justify-center w-14 h-9 rounded-full bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-500/30 hover:bg-zinc-800/50 transition-all duration-300 overflow-hidden"
              aria-label="Toggle language"
            >
              <div
                class="absolute inset-x-0 top-0 h-full flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform"
                style="transform: translateY({$locale === 'en'
                  ? '0'
                  : '-100%'})"
              >
                <span
                  class="h-full w-full shrink-0 flex items-center justify-center text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors"
                  >EN</span
                >
                <span
                  class="h-full w-full shrink-0 flex items-center justify-center text-sm font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors"
                  >TH</span
                >
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Refined Hero Section -->
    <section
      class="min-h-screen flex flex-col justify-center pt-32 pb-12 px-6 max-w-6xl mx-auto relative"
    >
      <!-- Aurora shader backdrop (shaders.com, WebGPU — transparent without it) -->
      <div
        class="absolute inset-0 overflow-hidden pointer-events-none"
        style="mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9) 45%, transparent 95%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9) 45%, transparent 95%);"
      >
        <ShaderBackground
          type="Aurora"
          className="w-full h-full opacity-35"
          props={{
            colorA: "#6d28d9",
            colorB: "#059669",
            colorC: "#1d4ed8",
            intensity: 30,
            speed: 3,
            curtainCount: 3,
            height: 90,
            rayDensity: 12,
          }}
        />
      </div>

      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <!-- Text Content -->
        <div
          class="lg:col-span-7 {mounted
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'} transition-all duration-1000 ease-out z-10"
        >
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/30 mb-8 backdrop-blur-sm"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
            ></span>
            <span class="text-xs font-medium text-zinc-300"
              >Open to new opportunities</span
            >
          </div>

          <h1
            class="text-5xl md:text-7xl lg:text-[5.5rem] font-['Outfit'] font-semibold leading-[1.1] text-white tracking-tight mb-6"
          >
            Software Engineer <br />
            <span class="text-zinc-500">{$t("hero.subtitle")}</span>
          </h1>

          <p
            class="text-lg text-zinc-400 mb-10 max-w-xl font-light leading-relaxed"
          >
            {$t("about.p1")}
          </p>

          <div class="flex items-center gap-5">
            <a
              href="#experience"
              class="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors text-sm"
            >
              {$t("hero.viewWork")}
            </a>
            <a
              href="#contact"
              class="px-6 py-3 border border-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-900 transition-colors text-sm"
            >
              {$t("hero.getInTouch")}
            </a>
          </div>
        </div>

        <!-- Profile Image Bento Card -->
        <div
          class="lg:col-span-5 {mounted
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'} transition-all duration-1000 delay-300 ease-out"
        >
          <div
            class="relative w-full aspect-square md:aspect-4/3 lg:aspect-square rounded-3xl border border-zinc-800/80 bg-zinc-900/20 group"
          >
            <div
              class="absolute inset-1.5 bg-[#0A101D] rounded-[2.8rem] z-0 overflow-hidden"
            >
              {#each profileImages as src, i}
                <img
                  {src}
                  alt="Nakarin Weerasak"
                  class="absolute inset-0 w-full h-full object-cover grayscale-30 group-hover:grayscale-0 transition-opacity duration-1000 {i ===
                  currentImageIndex
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-105 z-0'}"
                />
              {/each}
              <!-- GL Transitions slideshow (WebGL) over the fallback crossfade -->
              <GLProfile images={profileImages} />
            </div>
            <!-- Tech floating badges -->
            <div
              class="absolute -top-4 -left-4 z-20 bg-[#0A101D] border border-zinc-800 rounded-2xl w-14 h-14 flex items-center justify-center shadow-xl backdrop-blur-md transform -rotate-12 group-hover:-rotate-6 transition-all duration-300"
            >
              <svg
                class="w-7 h-7 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div
              class="absolute -bottom-4 -right-2 z-20 bg-[#0A101D] border border-zinc-800 rounded-2xl w-14 h-14 flex items-center justify-center shadow-xl backdrop-blur-md transform rotate-12 group-hover:rotate-6 transition-all duration-300"
            >
              <svg
                class="w-7 h-7 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div
              class="absolute top-1/2 -right-6 z-20 bg-[#0A101D] border border-zinc-800 rounded-2xl w-14 h-14 flex items-center justify-center shadow-xl backdrop-blur-md transform rotate-6 group-hover:translate-x-2 transition-all duration-300 md:flex"
            >
              <svg
                class="w-7 h-7 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Section (About & Quick Stats) -->
    <section id="about" class="py-24 px-6 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Main About Bento -->
        <div
          class="md:col-span-2 rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-8 md:p-12 hover:border-zinc-700 transition-colors group"
        >
          <h2 class="text-2xl font-['Outfit'] font-semibold text-white mb-6">
            {$t("about.title")}
          </h2>
          <p
            class="text-zinc-400 text-lg leading-relaxed font-light mb-6 group-hover:text-zinc-300 transition-colors"
          >
            {$t("about.p1")}
          </p>
          <p
            class="text-zinc-400 text-lg leading-relaxed font-light group-hover:text-zinc-300 transition-colors"
          >
            {$t("about.p2")}
          </p>
        </div>

        <!-- Metric Bentos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-auto">
          <div
            class="bg-zinc-900/40 rounded-3xl p-6 border border-zinc-800/80 hover:bg-zinc-800/80 hover:border-slate-500/30 transition-all flex flex-col justify-center items-center h-full"
          >
            <span
              class="block text-4xl font-['Outfit'] font-extrabold text-white mb-1"
              >{new Date().getFullYear() - 2018}+</span
            >
            <span
              class="text-zinc-500 font-medium text-sm tracking-wide uppercase"
              >{$t("about.yearsExp")}</span
            >
          </div>
          <div
            class="bg-zinc-900/40 rounded-3xl p-6 border border-zinc-800/80 hover:bg-zinc-800/80 hover:border-slate-500/30 transition-all flex flex-col justify-center items-center h-full"
          >
            <span
              class="block text-4xl font-['Outfit'] font-extrabold text-white mb-1"
              >15+</span
            >
            <span
              class="text-zinc-500 font-medium text-sm tracking-wide uppercase"
              >{$t("about.projectsCompleted")}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Experience Section -->
    <section
      id="experience"
      class="py-24 px-6 max-w-6xl mx-auto border-t border-zinc-900"
    >
      <div class="flex flex-col md:flex-row gap-12 md:gap-24">
        <!-- Sticky specific -->
        <div class="w-full md:w-1/4">
          <h2
            class="text-sm font-semibold text-zinc-500 uppercase tracking-widest sticky top-32"
          >
            {$t("experience.title")}
          </h2>
        </div>

        <div class="w-full md:w-3/4 space-y-16">
          {#each experiences as exp, idx}
            <div class="group relative">
              <div
                class="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2"
              >
                <h3 class="text-2xl font-['Outfit'] font-semibold text-white">
                  {$t(`experience.exp${idx + 1}_company`) || exp.company}
                </h3>
                <span class="text-zinc-500 font-mono text-sm"
                  >{$t(`experience.exp${idx + 1}_period`) || exp.period}</span
                >
              </div>

              <div class="space-y-10">
                {#each exp.projects as project, pIdx}
                  <div>
                    <h4 class="text-lg font-medium text-zinc-200 mb-1">
                      {$t(`experience.exp${idx + 1}_p${pIdx + 1}_name`) ||
                        project.name}
                    </h4>
                    <p class="text-sm text-zinc-500 mb-4">
                      {project.role === "Frontend"
                        ? $t("experience.role_frontend")
                        : project.role === "Full Stack"
                          ? $t("experience.role_fullstack")
                          : project.role === "Senior Frontend Developer"
                            ? $t("experience.role_senior_frontend")
                            : project.role ===
                                "Senior Programmer & Technical Lead"
                              ? $t("experience.role_senior_lead")
                              : project.role}
                    </p>
                    <p
                      class="text-zinc-400 font-light leading-relaxed text-sm mb-5 max-w-2xl whitespace-pre-line"
                    >
                      {@html parseUrl(
                        $t(`experience.exp${idx + 1}_p${pIdx + 1}_desc`) ||
                          project.description,
                      )}
                    </p>

                    {#if project.keyProjects}
                      <ul class="space-y-3 mb-6">
                        {#each project.keyProjects as keyProject, kpIdx}
                          <li
                            class="text-zinc-400 text-sm font-light flex items-start leading-relaxed"
                          >
                            <span class="text-zinc-700 mr-3 mt-1">-</span>
                            <span
                              >{$t(`experience.exp${idx + 1}_kp${kpIdx + 1}`) ||
                                keyProject}</span
                            >
                          </li>
                        {/each}
                      </ul>
                    {/if}

                    <div class="flex flex-wrap gap-2">
                      {#each project.technologies as tech}
                        <span
                          class="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-mono tracking-wide"
                          >{tech}</span
                        >
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Skills Bento Grid -->
    <section
      id="skills"
      class="py-24 px-6 max-w-6xl mx-auto border-t border-zinc-900"
    >
      <div class="flex flex-col md:flex-row gap-12 md:gap-24 mb-12">
        <div class="w-full md:w-1/4">
          <h2
            class="text-sm font-semibold text-zinc-500 uppercase tracking-widest sticky top-32"
          >
            {$t("skills.title")}
          </h2>
        </div>
        <div class="w-full md:w-3/4">
          <p class="text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
            A comprehensive, adaptable toolset optimized for building end-to-end
            full-stack architectures.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each Object.entries(skills) as [category, items]}
          <div
            class="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 hover:bg-zinc-900/40 transition-colors"
          >
            <h3
              class="text-lg font-['Outfit'] font-semibold mb-6 text-white capitalize"
            >
              {$t("skills." + category) || category}
            </h3>
            <ul class="space-y-3">
              {#each items as skill}
                <li
                  class="text-zinc-400 font-light text-sm flex items-center group cursor-default"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-zinc-800 mr-3 group-hover:bg-white transition-colors"
                  ></span>
                  {skill}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </section>

    <!-- Education Section -->
    <section id="education" class="py-24 px-6 relative">
      <div class="max-w-3xl mx-auto">
        <div
          class="bg-linear-to-br from-blue-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 border border-white/10 text-center relative overflow-hidden group"
        >
          <!-- decorative blur in background of the card -->
          <div
            class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"
          ></div>

          <h2
            class="text-2xl font-['Outfit'] font-bold text-blue-400 mb-8 uppercase tracking-widest text-sm"
          >
            {$t("education.title")}
          </h2>

          <div class="relative z-10">
            <h3
              class="text-3xl md:text-4xl font-['Outfit'] font-extrabold text-white mb-4 leading-tight"
            >
              {$t("education.degree")}
            </h3>
            <p class="text-xl text-slate-400">{$t("education.university")}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact & Footer -->
    <section id="contact" class="pt-24 pb-12 px-6">
      <div class="max-w-5xl mx-auto">
        <h2
          class="text-4xl md:text-5xl font-['Outfit'] font-bold mb-16 text-center text-white relative"
        >
          {$t("contact.title")}
          <div
            class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-linear-to-r from-blue-500 to-purple-500 rounded-full"
          ></div>
        </h2>

        <div
          class="flex flex-wrap justify-center gap-4 mb-24 max-w-5xl mx-auto"
        >
          <a
            href="mailto:{contact.email}"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium"
              >{$t("contact.email")}</span
            >
            <span class="text-white font-semibold text-sm break-all"
              >{contact.email}</span
            >
          </a>
          <a
            href="tel:{contact.phone}"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium"
              >{$t("contact.phone")}</span
            >
            <span class="text-white font-semibold">{contact.phone}</span>
          </a>
          <div
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 transition-all group"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium"
              >{$t("contact.location")}</span
            >
            <span class="text-white font-semibold text-sm"
              >{$t("contact.address")}</span
            >
          </div>
          <a
            href="https://{contact.linkedin}"
            target="_blank"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium">LinkedIn</span
            >
            <span class="text-white font-semibold text-sm">/in/9zax</span>
          </a>
          <a
            href="https://{contact.gitlab}"
            target="_blank"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 015.48 2h.022a.42.42 0 01.4.26l2.44 7.51h7.33l2.44-7.51A.42.42 0 0118.5 2h.022a.42.42 0 01.4.26l2.44 7.51 1.22 3.78a.84.84 0 01-.3.94Z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium">GitLab</span>
            <span class="text-white font-semibold text-sm">9zax</span>
          </a>
          <a
            href="https://{contact.medium}"
            target="_blank"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium">Medium</span>
            <span class="text-white font-semibold text-sm">@ctzcz</span>
          </a>
          <a
            href="https://{contact.github}"
            target="_blank"
            class="flex-[1_1_250px] max-w-[320px] bg-zinc-900/30 backdrop-blur-xl rounded-4xl p-8 border border-zinc-800/80 flex flex-col items-center text-center hover:bg-zinc-800/50 hover:border-slate-500/30 hover:-translate-y-2 transition-all group no-underline"
          >
            <div
              class="w-14 h-14 rounded-full bg-slate-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
            >
              <svg
                class="w-6 h-6 text-slate-300 group-hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </div>
            <span class="text-slate-400 text-sm mb-2 font-medium">GitHub</span>
            <span class="text-white font-semibold text-sm">9zax</span>
          </a>
        </div>

        <!-- Footer -->
        <footer
          class="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-600"
        >
          <div
            class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <span class="text-sm font-semibold text-white tracking-widest"
              >NAKARIN W.</span
            >
          </div>
          <p class="font-medium inline-block flex gap-1">
            {$t("footer.rights")}
            <span class="hidden md:inline">Built with SvelteKit.</span>
          </p>
        </footer>
      </div>
    </section>
  </div>
</main>
