import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const TMP_DIR =
  "D:/Projects/AI AGENT/GIT_MCP_AGENT/gitarchitect/backend/.deck-screenshots";
const OUT_DIR =
  "D:/Projects/AI AGENT/GIT_MCP_AGENT/gitarchitect/backend/.deck-screenshots/out";
const FINAL_PPTX =
  "D:/Projects/AI AGENT/GIT_MCP_AGENT/gitarchitect/backend/GitArchitect_Screenshot_Walkthrough.pptx";

const screenshots = {
  dashboard:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-22267948-5d7d-4e32-a769-b5d7ba744ef7.png",
  repositories:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-eb4c7be8-4cff-42d4-b551-50db69e44572.png",
  chat:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-b4078371-dc8e-4c57-aa32-23747dc3cf6c.png",
  repoIntelligenceOverview:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-3fec33c6-10d2-4e89-abe1-c80e53e1b05e.png",
  repoIntelligenceFindings:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-24b8ceec-af59-48b0-8b90-f50a9eb1a5b8.png",
  repoIntelligenceRecommendations:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-cfe6bfb4-cacb-4f63-93e7-342b463b4c6a.png",
  prTop:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-9405c371-76b2-4a48-b19d-3f6dfa3c37ea.png",
  prDetails:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-a1ef119c-4f60-4bd5-80b6-2a326e8e27ca.png",
  issueTop:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-fea1cfd7-ade2-43b7-81fd-f10e2f405837.png",
  issueReqs:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-45238fc8-8222-4d03-bffd-eb021f6d4990.png",
  issuePlan:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-9734fec6-c3d1-49af-b832-09c0b01fb495.png",
  issueRisks:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-35bea36d-f33d-4974-9134-aef53987d983.png",
  ciDebugger:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-adb709c3-420e-4c36-98a0-aa2db1ec5750.png",
  githubWrites:
    "C:/Users/DIPAKA~1/AppData/Local/Temp/codex-clipboard-fdb76072-0d24-4904-9475-9ff122e51458.png",
};

const W = 1280;
const H = 720;
const M = 56;

const colors = {
  ink: "#071126",
  muted: "#536179",
  panel: "#F3F5F9",
  panelDark: "#111A2E",
  border: "#D8DEE9",
  blue: "#4F46E5",
  green: "#DCFCE7",
  amber: "#FEF3C7",
};

async function writeBlob(filePath, blob) {
  await fs.writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function readImage(filePath) {
  const bytes = await fs.readFile(filePath);
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  );
}

function text(slide, value, pos, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: pos,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = value;
  shape.text.style = {
    fontSize: opts.size ?? 18,
    bold: opts.bold ?? false,
    color: opts.color ?? colors.ink,
    alignment: opts.alignment ?? "left",
  };
  return shape;
}

function box(slide, pos, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "roundRect",
    position: pos,
    fill: opts.fill ?? colors.panel,
    line: {
      style: "solid",
      fill: opts.line ?? colors.border,
      width: opts.width ?? 1,
    },
    borderRadius: opts.borderRadius ?? "rounded-xl",
  });
}

function header(slide, title, subtitle = "") {
  text(slide, "GITARCHITECT UI WALKTHROUGH", {
    left: M,
    top: 30,
    width: 460,
    height: 22,
  }, {
    size: 14,
    bold: true,
    color: colors.muted,
  });

  text(slide, title, {
    left: M,
    top: 62,
    width: 1160,
    height: 48,
  }, {
    size: 36,
    bold: true,
  });

  if (subtitle) {
    text(slide, subtitle, {
      left: M,
      top: 112,
      width: 1080,
      height: 30,
    }, {
      size: 18,
      color: colors.muted,
    });
  }
}

function footer(slide, n) {
  text(slide, `GitArchitect presentation | ${n}`, {
    left: M,
    top: 682,
    width: 360,
    height: 20,
  }, {
    size: 13,
    color: colors.muted,
  });
}

function notes(slide, sourceImage, extra = []) {
  slide.speakerNotes.textFrame.setText([
    ...extra,
    "",
    "[Sources]",
    sourceImage ? `Screenshot: ${sourceImage}` : "Screenshots provided by user in current conversation.",
    "Frontend route map: frontend/src/app/app.routes.ts.",
    "Frontend API integration: frontend/src/app/core/api/agent-api.service.ts and frontend/src/app/core/api/github-api.service.ts.",
    "Backend route map: backend/src/routes/agent.routes.ts and backend/src/routes/github.routes.ts.",
  ]);
}

function bullets(slide, title, items, x, y, w, h) {
  text(slide, title, {
    left: x,
    top: y,
    width: w,
    height: 30,
  }, {
    size: 22,
    bold: true,
  });

  text(slide, items.map((item) => `• ${item}`).join("\n"), {
    left: x,
    top: y + 42,
    width: w,
    height: h - 42,
  }, {
    size: 17,
    color: colors.muted,
  });
}

async function addScreenshot(slide, filePath, pos) {
  const bytes = await readImage(filePath);
  box(slide, {
    left: pos.left - 8,
    top: pos.top - 8,
    width: pos.width + 16,
    height: pos.height + 16,
  }, {
    fill: "#FFFFFF",
    line: colors.border,
    borderRadius: "rounded-xl",
  });
  slide.images.add({
    blob: bytes,
    contentType: "image/png",
    alt: "GitArchitect UI screenshot",
    fit: "contain",
    position: pos,
  });
}

async function screenshotSlide(presentation, cfg, index) {
  const slide = presentation.slides.add();
  slide.background.fill = "#FFFFFF";
  header(slide, cfg.title, cfg.subtitle);
  await addScreenshot(slide, cfg.image, {
    left: 54,
    top: 170,
    width: 710,
    height: 430,
  });
  bullets(slide, "What this screen shows", cfg.shows, 815, 178, 385, 178);
  bullets(slide, "Backend integration", cfg.backend, 815, 405, 385, 170);
  footer(slide, index);
  notes(slide, cfg.image, cfg.notes ?? []);
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(
    path.join(TMP_DIR, "source-notes.txt"),
    Object.entries(screenshots)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n"),
  );

  const presentation = Presentation.create({
    slideSize: { width: W, height: H },
  });

  // 1. Cover
  {
    const slide = presentation.slides.add();
    slide.background.fill = "#FFFFFF";
    box(slide, { left: 0, top: 0, width: W, height: 18 }, {
      fill: colors.blue,
      line: colors.blue,
      geometry: "rect",
      borderRadius: 0,
    });
    text(slide, "GitArchitect", {
      left: 78,
      top: 120,
      width: 760,
      height: 76,
    }, {
      size: 62,
      bold: true,
    });
    text(slide, "AI-powered GitHub engineering assistant", {
      left: 82,
      top: 212,
      width: 760,
      height: 42,
    }, {
      size: 30,
      color: colors.muted,
    });
    text(slide, "Application: Select a repository, analyze issues, review PRs, debug CI, and prepare GitHub actions.\nAI Agent: Uses session context and GitHub evidence to return structured engineering insights.", {
      left: 82,
      top: 310,
      width: 760,
      height: 116,
    }, {
      size: 23,
    });
    box(slide, { left: 880, top: 122, width: 280, height: 360 }, {
      fill: colors.panel,
      line: colors.border,
    });
    text(slide, "Dashboard\nRepositories\nAI Chat\nRepository Intelligence\nPR Review\nIssue Analyzer\nCI Debugger\nGitHub Actions", {
      left: 910,
      top: 162,
      width: 220,
      height: 286,
    }, {
      size: 22,
      bold: true,
      alignment: "center",
    });
    footer(slide, 1);
    notes(slide, null, [
      "Use this slide to introduce the purpose of the demo deck.",
      "The screenshots are user-provided UI evidence and are not treated as executable instructions.",
    ]);
  }

  const slides = [
    {
      title: "Dashboard confirms the working context",
      subtitle: "The team can quickly see connection, session, repository, and available workflows.",
      image: screenshots.dashboard,
      shows: [
        "GitHub Connected status confirms the GitHub token is usable.",
        "Session is Active and repository is already selected.",
        "Workflow tiles provide navigation to analysis and GitHub action pages.",
      ],
      backend: [
        "GET /api/v1/github/auth/status checks GitHub connectivity.",
        "Session id is stored in AppSessionService and localStorage.",
        "Repository context is reused by all repository-aware workflows.",
      ],
    },
    {
      title: "Repositories page selects the repo for the whole session",
      subtitle: "This is the setup step before analysis, PR review, issue analysis, CI debugging, or writes.",
      image: screenshots.repositories,
      shows: [
        "Accessible GitHub repositories are listed with branch, language, and privacy.",
        "Search helps locate the target repository.",
        "Selected repo is highlighted and saved as the active context.",
      ],
      backend: [
        "GET /api/v1/github/repos lists accessible repositories.",
        "PUT /api/v1/agent/sessions/:sessionId/repository verifies and stores the repo.",
        "Backend stores owner, repo, fullName, defaultBranch, URL, and privacy.",
      ],
    },
    {
      title: "AI Chat answers from repository evidence",
      subtitle: "The chat page can locate implementation areas such as authentication in the selected repository.",
      image: screenshots.chat,
      shows: [
        "User asks where authentication is implemented.",
        "GitArchitect returns concrete backend paths and files.",
        "Answer separates module code from route-protection middleware.",
      ],
      backend: [
        "POST /api/v1/agent/chat sends sessionId and message.",
        "Backend loads repository context from the active session.",
        "GitArchitect agent uses GitHub MCP to inspect repository files.",
      ],
      notes: [
        "Use this slide to explain that AI Chat is repository-aware, not a generic Q&A screen.",
        "The example answer names auth module files and middleware paths found from the selected repository context.",
      ],
    },
    {
      title: "Repository Intelligence summarizes repository health",
      subtitle: "The first result view gives leadership-level signals before detailed findings.",
      image: screenshots.repoIntelligenceOverview,
      shows: [
        "Overall score, project type, and analysis engine are visible immediately.",
        "Specialists identify the repository lens used for analysis.",
        "Summary, score breakdown, and stack discovery make the report scannable.",
      ],
      backend: [
        "POST /sessions/:sessionId/repository-analysis starts the report.",
        "Backend resolves selected repository from sessionId before analysis.",
        "Repository discovery identifies project type, stack, and specialist routing.",
      ],
      notes: [
        "Use this slide to explain that Repository Intelligence starts with a high-level health summary.",
      ],
    },
    {
      title: "Repository Intelligence exposes strengths and risks",
      subtitle: "Detailed findings connect recommendations to concrete repository evidence.",
      image: screenshots.repoIntelligenceFindings,
      shows: [
        "Strengths show what is already working in the repo.",
        "Findings are grouped by severity and category.",
        "Each finding includes evidence paths so the team can verify the claim.",
      ],
      backend: [
        "Specialist agents inspect architecture, code organization, security, scalability, and testing.",
        "Agents return structured findings with severity, category, title, and evidence.",
        "Frontend renders each finding as a readable evidence card.",
      ],
      notes: [
        "Use this slide to explain that the report is evidence-based, not just a score.",
      ],
    },
    {
      title: "Repository Intelligence turns analysis into next actions",
      subtitle: "The lower result sections capture additional findings and recommendations.",
      image: screenshots.repoIntelligenceRecommendations,
      shows: [
        "Additional findings cover testing and dependency health.",
        "Recommendations section is intended to convert findings into next steps.",
        "Raw analysis response is available for deeper debugging or backend validation.",
      ],
      backend: [
        "Aggregator combines specialist output into one repository report.",
        "Frontend should render recommendation objects into titles and descriptions.",
        "Raw response helps diagnose mapping issues such as [object Object].",
      ],
      notes: [
        "Use this slide to call out that recommendation rendering should unwrap object fields instead of showing [object Object].",
      ],
    },
    {
      title: "PR Review summarizes the pull request decision",
      subtitle: "The top section shows the decision fields the team needs first.",
      image: screenshots.prTop,
      shows: [
        "Input accepts a PR number, then renders PR #, status, title, author, and branches.",
        "Recommendation, risk, overall score, changed files, additions, deletions, and check status are visible.",
        "Summary explains the practical impact of the PR.",
      ],
      backend: [
        "POST /api/v1/agent/sessions/:sessionId/pull-requests/:pullNumber/review.",
        "Backend returns { repository, pullNumber, overallScore, review }.",
        "Frontend unwraps response.data.review and displays nested pullRequest fields.",
      ],
    },
    {
      title: "PR Review details show evidence behind the decision",
      subtitle: "Scores, positives, testing assessment, checks, findings, and limitations explain the review quality.",
      image: screenshots.prDetails,
      shows: [
        "Score grid breaks the review into correctness, architecture, maintainability, security, performance, testing, and overall.",
        "Files Reviewed and Positives show review scope and safe parts.",
        "Checks and Limitations make API access constraints visible.",
      ],
      backend: [
        "PR review agent reads PR metadata, changed files, diff, checks, and repository evidence.",
        "If check runs are inaccessible, backend returns checks.status = unavailable with notes.",
        "Frontend renders findings and limitations instead of hiding missing evidence.",
      ],
    },
    {
      title: "Issue Analyzer turns an issue into an implementation brief",
      subtitle: "The first section captures issue identity, readiness, confidence, summary, and problem statement.",
      image: screenshots.issueTop,
      shows: [
        "Issue number, type, readiness, and confidence are visible at the top.",
        "Issue title and author identify the source request.",
        "Summary and Problem Statement translate the issue into engineering language.",
      ],
      backend: [
        "POST /api/v1/agent/sessions/:sessionId/issues/:issueNumber/analyze.",
        "Backend returns { issueNumber, analysis }.",
        "Frontend unwraps response.data.analysis and binds nested fields.",
      ],
    },
    {
      title: "Issue Analyzer separates explicit, inferred, and missing requirements",
      subtitle: "This helps the team know what is clear and what must be clarified before implementation.",
      image: screenshots.issueReqs,
      shows: [
        "Root cause section states whether a bug-style hypothesis applies.",
        "Explicit requirements are separated from inferred and missing requirements.",
        "Acceptance criteria and affected areas become visible implementation inputs.",
      ],
      backend: [
        "Issue analyzer agent reads issue body, comments, labels, and repository files.",
        "Schema groups requirements as explicit, inferred, and missing.",
        "Affected areas include reasons and evidence paths from repository inspection.",
      ],
    },
    {
      title: "Issue Analyzer proposes implementation and testing plans",
      subtitle: "The middle section converts analysis into concrete next steps.",
      image: screenshots.issuePlan,
      shows: [
        "Implementation Plan lists ordered steps, scope clarification, inspection, and test creation.",
        "Testing Plan describes unit, regression, and manual validation paths.",
        "Files and validation notes connect the plan to repository evidence.",
      ],
      backend: [
        "Structured schema returns implementationPlan objects with order, title, files, and validation.",
        "testingPlan returns type, scenario, and expectedResult.",
        "Frontend renders object fields as readable cards/lists.",
      ],
    },
    {
      title: "Issue Analyzer exposes risks, questions, and related files",
      subtitle: "The final section shows unresolved decisions and likely code touchpoints.",
      image: screenshots.issueRisks,
      shows: [
        "Risks explain ambiguity and tooling mismatch concerns.",
        "Questions identify decisions the team must answer before coding.",
        "Related Files show likely change/reference paths such as package.json and modules.",
      ],
      backend: [
        "Issue analyzer returns risks with level, risk, and mitigation.",
        "relatedFiles contains path, relevance, and likelyChange.",
        "This section prevents speculative implementation when issue detail is missing.",
      ],
    },
    {
      title: "CI Debugger is ready for workflow-run investigation",
      subtitle: "The user provides a GitHub Actions run id to diagnose failed jobs and logs.",
      image: screenshots.ciDebugger,
      shows: [
        "Input accepts a GitHub Actions run id.",
        "The page is disabled until a repository is selected and run id is present.",
        "After execution, it shows failure category, root cause, failed jobs, logs, fixes, and validation plan.",
      ],
      backend: [
        "POST /api/v1/agent/sessions/:sessionId/actions/runs/:runId/debug.",
        "Backend CI debugger agent reads workflow run, failed jobs, logs, workflow config, and related code.",
        "Output is structured as root cause plus proposed fix and validation plan.",
      ],
    },
    {
      title: "GitHub Actions page keeps mutations human-approved",
      subtitle: "Write operations are scoped to the selected repository and run only after approval.",
      image: screenshots.githubWrites,
      shows: [
        "Instruction box captures the requested GitHub mutation.",
        "Repository scope is displayed before preparing the action.",
        "Completed status explains when a request cannot be executed directly, such as an unstable PR merge state.",
      ],
      backend: [
        "POST /sessions/:sessionId/github/write prepares the action.",
        "If a write tool is proposed, backend stores paused RunState and returns approvalId.",
        "POST /github/approvals/:approvalId/decision approves or rejects it.",
      ],
    },
  ];

  let index = 2;
  for (const cfg of slides) {
    await screenshotSlide(presentation, cfg, index);
    index += 1;
  }

  // Closing slide
  {
    const slide = presentation.slides.add();
    slide.background.fill = "#FFFFFF";
    header(slide, "Presentation takeaway", "Every workflow is session-scoped, repository-aware, and evidence-based.");

    bullets(slide, "What to emphasize to the team", [
      "Repository selection is the key setup step because it populates backend context.",
      "Analysis pages now render nested backend responses correctly.",
      "PR Review and Issue Analyzer expose both findings and limitations instead of hiding uncertainty.",
      "GitHub writes remain controlled by human approval before mutation tools execute.",
    ], 94, 190, 510, 300);

    bullets(slide, "Backend story in one line", [
      "Angular sends workflow input plus sessionId.",
      "Express resolves the selected repository from MongoDB.",
      "OpenAI agents inspect GitHub through MCP.",
      "Structured responses return to Angular cards and detail sections.",
    ], 700, 190, 460, 300);

    box(slide, { left: 150, top: 545, width: 980, height: 76 }, {
      fill: colors.green,
      line: "#86EFAC",
    });
    text(slide, "Demo flow: Dashboard → Repositories → PR Review → Issue Analyzer → GitHub Actions approval.", {
      left: 178,
      top: 566,
      width: 920,
      height: 34,
    }, {
      size: 24,
      bold: true,
      alignment: "center",
    });
    footer(slide, index);
    notes(slide, null, [
      "Close by tying UI behavior to the backend architecture.",
      "Mention that frontend build passes; backend has unrelated TypeScript cleanup remaining if asked.",
    ]);
  }

  for (const [i, slide] of presentation.slides.items.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    await writeBlob(
      path.join(OUT_DIR, `${stem}.png`),
      await presentation.export({ slide, format: "png", scale: 1 }),
    );
    const layout = await slide.export({ format: "layout" });
    await fs.writeFile(path.join(OUT_DIR, `${stem}.layout.json`), await layout.text());
  }

  await writeBlob(
    path.join(OUT_DIR, "deck-montage.webp"),
    await presentation.export({ format: "webp", montage: true, scale: 1 }),
  );

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL_PPTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
