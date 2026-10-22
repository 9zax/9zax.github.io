<script>
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import { translations } from "$lib/data/translations";
  import { page } from "$app/stores";

  // Reactive translation state
  let lang = "en";
  $: t = translations[lang];

  const parseUrl = (text) => {
    if (!text) return "";
    const urlRegex =
      /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    return text.replace(urlRegex, (url) => {
      let href = url;
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        href = "https://" + href;
      }
      const lastChar = href.slice(-1);
      let trailing = "";
      if ([".", ",", ")", "]"].includes(lastChar)) {
        href = href.slice(0, -1);
        url = url.slice(0, -1);
        trailing = lastChar;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-700 underline">${url}</a>${trailing}`;
    });
  };

  // We map the translation keys into the structured array format expected by the template
  $: experiences = [
    {
      company: t.experience.exp1_company,
      period: t.experience.exp1_period,
      projects: [
        {
          name: t.experience.exp1_p1_name,
          role: t.experience.role_senior_frontend,
          description: t.experience.exp1_p1_desc,
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
          name: t.experience.exp1_p2_name,
          role: t.experience.role_senior_frontend,
          description: t.experience.exp1_p2_desc,
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
          name: t.experience.exp1_p3_name,
          role: t.experience.role_fullstack,
          description: t.experience.exp1_p3_desc,
          technologies: [
            "Anthropic API (LLM)",
            "Shell",
            "GitHub Actions",
            "TypeScript",
          ],
        },
        {
          name: t.experience.exp1_p4_name,
          role: t.experience.role_fullstack,
          description: t.experience.exp1_p4_desc,
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
      company: t.experience.exp2_company,
      period: t.experience.exp2_period,
      projects: [
        {
          name: t.experience.exp2_p1_name,
          role: t.experience.role_frontend,
          description: t.experience.exp2_p1_desc,
          technologies: ["React", "Swift (IOS)", "Flutter"],
        },
        {
          name: t.experience.exp2_p2_name,
          role: t.experience.role_fullstack,
          description: t.experience.exp2_p2_desc,
          technologies: [
            "Vuejs",
            "NuxtJs",
            "Golang",
            "NodeJS",
            "PostgreSQL",
            "Redis",
            "Kubernetes",
          ],
        },
        {
          name: t.experience.exp2_p3_name,
          role: t.experience.role_fullstack,
          description: t.experience.exp2_p3_desc,
          technologies: ["SvelteKit", "Supabase", "AI (LLM)", "Tailwind CSS"],
        },
        {
          name: t.experience.exp2_p4_name,
          role: t.experience.role_frontend,
          description: t.experience.exp2_p4_desc,
          technologies: ["Svelte", "Manifest V3"],
        },
        {
          name: t.experience.exp2_p5_name,
          role: t.experience.role_fullstack,
          description: t.experience.exp2_p5_desc,
          technologies: ["Nuxt", "Vue", "Tailwind CSS"],
        },
      ],
    },
    {
      company: t.experience.exp3_company,
      period: t.experience.exp3_period,
      projects: [
        {
          name: t.experience.exp3_p1_name,
          role: t.experience.role_senior_lead,
          description: t.experience.exp3_p1_desc,
          technologies: [
            "SvelteKit",
            "NestJS",
            "PostgreSQL",
            "Prisma",
            "MongoDB",
            "Docker",
            "Nginx",
            "Kubernetes",
            "Jenkins",
            "GitLab CI",
            "Keycloak",
            "Proxmox",
          ],
          keyProjects: [
            t.experience.exp3_kp1,
            t.experience.exp3_kp2,
            t.experience.exp3_kp3,
            t.experience.exp3_kp4,
            t.experience.exp3_kp5,
          ],
        },
      ],
    },
    {
      company: t.experience.exp4_company,
      period: t.experience.exp4_period,
      projects: [
        {
          name: t.experience.exp4_p1_name,
          role: t.experience.role_frontend,
          description: t.experience.exp4_p1_desc,
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
      company: t.experience.exp5_company,
      period: t.experience.exp5_period,
      projects: [
        {
          name: t.experience.exp5_p1_name,
          role: t.experience.role_frontend,
          description: t.experience.exp5_p1_desc,
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
    ],
    backend: [
      "Node.js",
      "Express",
      "Fastify",
      "NestJS",
      "Prisma",
      "Go-gin",
      ".NET Core",
    ],
    database: ["MongoDB", "Firebase", "PostgreSQL", "SQLite", "MySQL"],
    devops: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitLab CI",
      "GitHub Actions",
      "Nginx",
      "Cloudflare",
    ],
  };

  $: education = {
    degree: t.education.degree,
    university: t.education.university,
  };

  $: contact = {
    address: t.contact.address,
    phone: "+6692-947-9535", // Keep hardcoded as it doesn't change
    email: "nakarin.weerasak@gmail.com",
    github: "github.com/9zax",
    gitlab: "gitlab.com/9zax",
    linkedin: "linkedin.com/in/9zax",
    medium: "medium.com/@ctzcz",
  };

  // Replace default texts with translated texts
  $: textContactMethod = lang === "th" ? "ช่องทางการติดต่อ" : "Contact Method";
  $: textDetails = lang === "th" ? "รายละเอียด" : "Details";
  $: textEmail = t.contact.email || "Email";
  $: textPhone = t.contact.phone || "Phone";
  $: textLocation = t.contact.location || "Location";

  // Fixed A4 sheet — visually scaled to fit small screens (zoom), untouched in print
  let sheet;
  const fitSheet = () => {
    if (!sheet) return;
    const base = sheet.offsetWidth || 794; // 210mm ≈ 794px
    const scale = Math.min(1, (window.innerWidth - 16) / base);
    sheet.style.zoom = scale < 0.99 ? String(scale) : "";
  };

  onMount(() => {
    // Read the language parameter from the URL, default to 'en'
    const urlLang = $page.url.searchParams.get("lang");
    if (urlLang === "th") {
      lang = "th";
    }

    fitSheet();
    window.addEventListener("resize", fitSheet);

    // Let fonts settle before opening the print dialog (Save as PDF)
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    Promise.all([
      fontsReady,
      new Promise((r) => setTimeout(r, 1200)),
    ]).then(() => setTimeout(() => window.print(), 300));

    return () => window.removeEventListener("resize", fitSheet);
  });
</script>

<svelte:head>
  <title>Nakarin Weerasak | CV</title>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Sarabun:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div
  class="print-container min-h-screen text-zinc-900 {lang === 'th'
    ? "font-['Sarabun']"
    : "font-['Inter']"}"
>
  <!-- Screen-only helper bar -->
  <div
    class="no-print fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-zinc-900/95 backdrop-blur text-white text-xs sm:text-sm font-medium pl-4 pr-2 py-2 rounded-full shadow-2xl border border-zinc-700"
  >
    <span class="px-1 whitespace-nowrap"
      >{lang === "th"
        ? "CV ขนาด A4 — บันทึกเป็น PDF ผ่านหน้าต่างปริ้น"
        : "A4 CV — use the print dialog to save as PDF"}</span
    >
    <button
      class="px-4 py-1.5 bg-white text-zinc-900 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
      on:click={() => window.print()}
    >
      {lang === "th" ? "บันทึก PDF" : "Save PDF"}
    </button>
  </div>

  <div class="pdf-page bg-white" bind:this={sheet}>
    <!-- Header -->
    <header
      class="border-b-2 border-[#1e3a8a] pb-6 mb-8 flex justify-between items-end"
    >
      <div>
        <h4
          class="text-3xl font-['Outfit'] font-bold text-zinc-900 leading-tight mb-2 tracking-tight"
        >
          Nakarin Weerasak
        </h4>
        <div class="text-xl text-[#1e3a8a] font-medium tracking-wide">
          {t.footer.role}
        </div>
        <p class="text-zinc-600 font-medium text-sm mt-3 leading-relaxed">
          {t.hero.subtitle}
        </p>
      </div>
      <div class="flex gap-6 items-center">
        <div
          class="text-right text-[10px] text-zinc-600 flex flex-col gap-0.5 font-['Inter']"
        >
          <div>{contact.email}</div>
          <div>{contact.phone}</div>
          <div>{contact.address}</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://9zax.github.io/"
            alt="Portfolio QR"
            class="w-16 h-16 border border-zinc-200 p-0.5 rounded"
          />
          <span
            class="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter"
            >Portfolio</span
          >
        </div>
      </div>
    </header>

    <!-- Professional Summary -->
    <section class="mb-6">
      <h3
        class="text-lg font-['Outfit'] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider border-b-2 border-[#1e3a8a] pb-1"
      >
        {t.about.title}
      </h3>
      <p class="text-zinc-800 text-sm leading-relaxed mb-2 text-justify">
        {t.about.p1}
      </p>
      <p class="text-zinc-800 text-sm leading-relaxed text-justify">
        {t.about.p2}
      </p>
    </section>

    <!-- Experience -->
    <section class="mb-6">
      <h3
        class="text-lg font-['Outfit'] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider border-b-2 border-[#1e3a8a] pb-1"
      >
        {t.experience.title}
      </h3>
      <table class="w-full text-sm border-collapse border border-zinc-300">
        <thead class="bg-blue-50 text-[#1e3a8a]">
          <tr>
            <th class="border border-zinc-300 p-2 text-left w-6/12 md:w-1/4"
              >{lang === "th" ? "บริษัท & ระยะเวลา" : "Company & Period"}</th
            >
            <th class="border border-zinc-300 p-2 text-left"
              >{lang === "th" ? "รายละเอียดโปรเจกต์" : "Project Details"}</th
            >
          </tr>
        </thead>
        <tbody>
          {#each experiences as exp}
            {#each exp.projects as project, i}
              <tr>
                {#if i === 0}
                  <td
                    class="border border-zinc-300 p-3 align-top"
                    rowspan={exp.projects.length}
                  >
                    <div class="font-bold text-zinc-900">{exp.company}</div>
                    <div class="text-xs text-[#1e3a8a] mt-1 font-semibold">
                      {exp.period}
                    </div>
                  </td>
                {/if}
                <td class="border border-zinc-300 p-3">
                  <div class="font-bold text-zinc-900 text-sm mb-0.5">
                    {project.name}
                  </div>
                  <div
                    class="text-[11px] font-semibold text-zinc-600 mb-2 uppercase tracking-wide"
                  >
                    {project.role}
                  </div>
                  <p class="text-xs text-zinc-700 mb-2 leading-relaxed">
                    {@html parseUrl(project.description)}
                  </p>
                  {#if project.keyProjects && project.keyProjects.length > 0}
                    <ul
                      class="list-disc list-outside ml-4 mb-2 text-xs text-zinc-700 space-y-1"
                    >
                      {#each project.keyProjects as kp}
                        <li>{kp}</li>
                      {/each}
                    </ul>
                  {/if}
                  <div class="flex flex-wrap gap-1 mt-2">
                    {#each project.technologies as tech}
                      <span
                        class="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 text-[10px] rounded border border-zinc-200"
                        >{tech}</span
                      >
                    {/each}
                  </div>
                </td>
              </tr>
            {/each}
          {/each}
        </tbody>
      </table>
    </section>

    <!-- Core Skills -->
    <section class="mb-6">
      <h3
        class="text-lg font-['Outfit'] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider border-b-2 border-[#1e3a8a] pb-1"
      >
        {t.skills.title}
      </h3>
      <table class="w-full text-sm border-collapse border border-zinc-300">
        <thead class="bg-blue-50 text-[#1e3a8a]">
          <tr>
            <th class="border border-zinc-300 p-2 text-left w-[25%]"
              >Category</th
            >
            <th class="border border-zinc-300 p-2 text-left"
              >{t.skills.title}</th
            >
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{t.skills.ai}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium"
              >{skills.ai.join(", ")}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{t.skills.language}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium"
              >{skills.language.join(", ")}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top bg-zinc-50"
              >{t.skills.frontend}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium bg-zinc-50"
              >{skills.frontend.join(", ")}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{t.skills.backend}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium"
              >{skills.backend.join(", ")}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top bg-zinc-50"
              >{t.skills.database}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium bg-zinc-50"
              >{skills.database.join(", ")}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{t.skills.devops}</td
            >
            <td
              class="border border-zinc-300 p-3 text-xs text-zinc-700 leading-relaxed font-medium"
              >{skills.devops.join(", ")}</td
            >
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Education -->
    <section class="mb-6 print:break-before-page">
      <h3
        class="text-lg font-['Outfit'] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider border-b-2 border-[#1e3a8a] pb-1"
      >
        {t.education.title}
      </h3>
      <table class="w-full text-sm border-collapse border border-zinc-300">
        <thead class="bg-blue-50 text-[#1e3a8a]">
          <tr>
            <th class="border border-zinc-300 p-2 text-left w-[25%]">Degree</th>
            <th class="border border-zinc-300 p-2 text-left">Institution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
            >
              {education.degree}
            </td>
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
            >
              {education.university}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Contact Information -->
    <section class="mb-6 page-break-avoid">
      <h3
        class="text-lg font-['Outfit'] font-bold text-[#1e3a8a] mb-3 uppercase tracking-wider border-b-2 border-[#1e3a8a] pb-1"
      >
        {t.contact.title}
      </h3>
      <table class="w-full text-sm border-collapse border border-zinc-300">
        <thead class="bg-blue-50 text-[#1e3a8a]">
          <tr>
            <th class="border border-zinc-300 p-2 text-left w-[25%]"
              >{textContactMethod}</th
            >
            <th class="border border-zinc-300 p-2 text-left">{textDetails}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{textEmail}</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
              >{contact.email}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{textPhone}</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
              >{contact.phone}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >{textLocation}</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
              >{contact.address}</td
            >
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >GitHub</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
            >
              <a
                href="https://{contact.github}"
                target="_blank"
                class="text-blue-700 hover:underline">{contact.github}</a
              >
            </td>
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >GitLab</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
            >
              <a
                href="https://{contact.gitlab}"
                target="_blank"
                class="text-blue-700 hover:underline">{contact.gitlab}</a
              >
            </td>
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >LinkedIn</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
            >
              <a
                href="https://{contact.linkedin}"
                target="_blank"
                class="text-blue-700 hover:underline">{contact.linkedin}</a
              >
            </td>
          </tr>
          <tr>
            <td
              class="border border-zinc-300 p-3 font-bold text-zinc-900 align-top"
              >Medium</td
            >
            <td
              class="border border-zinc-300 p-3 font-medium text-xs text-zinc-700 align-top"
            >
              <a
                href="https://{contact.medium}"
                target="_blank"
                class="text-blue-700 hover:underline">{contact.medium}</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</div>

<style>
  /* Neutral backdrop on screen; the sheet itself is always fixed A4 */
  :global(body) {
    background-color: #e4e4e7 !important;
  }

  /* Fixed A4 sheet — same geometry on screen and in print, never responsive */
  .pdf-page {
    width: 210mm;
    min-height: 297mm;
    padding: 15mm;
    box-sizing: border-box;
    background: white;
  }

  @media screen {
    .pdf-page {
      margin: 1.5rem auto 5rem;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.25);
      border-radius: 2px;
    }
  }

  /* Print Optimization */
  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }
    :global(body) {
      background-color: white !important;
      margin: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    /* Hide the navbar from the parent layout if it leaks */
    :global(#main-nav) {
      display: none !important;
    }
    .no-print {
      display: none !important;
    }
    .pdf-page {
      zoom: 1 !important;
      margin: 0;
      box-shadow: none;
      border-radius: 0;
      min-height: auto;
    }
    .pdf-page :global(tr) {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .page-break-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
</style>
