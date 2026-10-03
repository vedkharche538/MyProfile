/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  RESUME CONTENT SCHEMA — The System Architect OS                     ║
 * ║  Source-of-truth for every section of the portfolio.                 ║
 * ║  All metrics are pulled directly from Vedhas Kharche's resume.        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Type-safe structure feeding:
 *   - Hero metric ticker
 *   - Architecture mode node graph
 *   - Terminal `cat resume`, `skills`, `projects` commands
 *   - Executive UI cards
 *   - Career timeline (git-commit styled)
 *   - Skill radar
 */

// ──────────────────────────────────────────────────────────────────────
//  PRIMITIVES
// ──────────────────────────────────────────────────────────────────────
export type Mode = "architecture" | "terminal" | "executive";

export interface Metric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  description: string;
  category: "scale" | "performance" | "cost" | "reliability";
}

export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string; // lucide icon name
  value: string;
}

export interface SkillNode {
  id: string;
  label: string;
  level: number; // 0–100 mastery
  category: "language" | "backend" | "data" | "cloud" | "database" | "design";
  projects: string[]; // ids of projects that exercise this skill
  description: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  type: "service" | "database" | "cache" | "stream" | "gateway" | "client" | "ai";
  x: number; // 0-100 normalized graph coordinates
  y: number;
  description: string;
  tech: string[];
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
  protocol?: "http" | "grpc" | "tcp" | "kafka" | "kinesis" | "redis" | "sql";
}

export interface ArchitectureGraph {
  projectId: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ProjectDeepDive {
  problem: string;
  solution: string;
  tradeoffs: string[];
  techStack: string[];
  impactMetrics: { label: string; value: string }[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  company: string;
  period: string;
  year: number;
  scale: "large" | "medium" | "small";
  category: string;
  tagline: string;
  description: string;
  achievements: string[];
  stack: string[];
  graph: ArchitectureGraph;
  deepDive: ProjectDeepDive;
  accentColor: string;
}

export interface TimelineCommit {
  id: string; // git-style hash
  hash: string;
  type: "feat" | "refactor" | "perf" | "infra" | "fix" | "chore" | "milestone";
  date: string;
  title: string;
  company: string;
  body: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  description: string;
  icon: string;
}

// ──────────────────────────────────────────────────────────────────────
//  IDENTITY
// ──────────────────────────────────────────────────────────────────────
export const identity = {
  name: "Vedhas Kharche",
  title: "Senior Backend & Data Engineer",
  tagline: "Distributed Systems • Cloud Architecture • Generative AI",
  yearsExperience: 6,
  summary:
    "Senior Backend & Data Engineer with 6 years of experience building high-concurrency microservices, REST APIs, and distributed data pipelines on AWS and Databricks. Specializing in database optimization, cloud architecture, and integrating modern AI capabilities into enterprise microservices.",
  location: "Mumbai, India",
  availability: "Open to Senior / Staff Engineer roles",
  resumePdfPath: "/Vedhas_Kharche_Resume.pdf",
} as const;

// ──────────────────────────────────────────────────────────────────────
//  CONTACT LINKS
// ──────────────────────────────────────────────────────────────────────
export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    href: "mailto:contact.vedhaskharche@gmail.com",
    icon: "Mail",
    value: "contact.vedhaskharche@gmail.com",
  },
  {
    id: "phone",
    label: "Phone",
    href: "tel:+919975318344",
    icon: "Phone",
    value: "+91 99753 18344",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vedhas-kharche",
    icon: "Linkedin",
    value: "vedhas-kharche",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/vedkharche538",
    icon: "Github",
    value: "vedkharche538",
  },
  {
    id: "website",
    label: "Website",
    href: "https://vedhaskharche.com",
    icon: "Globe",
    value: "vedhaskharche.com",
  },
  {
    id: "codewithved",
    label: "CodeWithVed",
    href: "https://codewithved.com",
    icon: "Code2",
    value: "codewithved",
  },
];

// ──────────────────────────────────────────────────────────────────────
//  HERO METRICS — auto-populated from resume
// ──────────────────────────────────────────────────────────────────────
export const heroMetrics: Metric[] = [
  {
    id: "daily-requests",
    label: "Daily API Requests Served",
    value: 500,
    suffix: "K+",
    description: "Production FastAPI microservices on AWS EKS at 99.99% uptime",
    category: "scale",
  },
  {
    id: "p99-latency",
    label: "p99 Response Time",
    value: 40,
    suffix: "ms",
    description: "Sub-40ms p99 across high-throughput microservices",
    category: "performance",
  },
  {
    id: "etl-speedup",
    label: "ETL Runtime Reduction",
    value: 83,
    suffix: "%",
    description: "Databricks migration cut runtime from 3.5h → 35min",
    category: "performance",
  },
  {
    id: "daily-data",
    label: "Daily Data Processed",
    value: 5,
    suffix: "TB",
    description: "Real-time security log pipelines at Forcepoint",
    category: "scale",
  },
  {
    id: "monthly-users",
    label: "Monthly Active Users",
    value: 1,
    suffix: "M+",
    description: "OAuth2-secured Flask REST APIs on GCP",
    category: "scale",
  },
  {
    id: "peak-users",
    label: "Peak Concurrent Users",
    value: 10,
    suffix: "M+",
    description: "Swayam national education platform, <100ms response",
    category: "scale",
  },
  {
    id: "uptime",
    label: "Production Uptime",
    value: 99.99,
    suffix: "%",
    decimals: 2,
    description: "Across mission-critical compliance verification events",
    category: "reliability",
  },
  {
    id: "deploy-accel",
    label: "Deployment Time Reduction",
    value: 96,
    suffix: "%",
    description: "Multi-cloud provisioning: 2 days → 30 min via K8s/Docker",
    category: "performance",
  },
];

// ──────────────────────────────────────────────────────────────────────
//  SKILL TREE
// ──────────────────────────────────────────────────────────────────────
export const skillTree: SkillNode[] = [
  // Languages
  { id: "python", label: "Python", level: 95, category: "language", projects: ["abbott-fastapi", "abbott-ai", "forcepoint-pipeline", "persistent-flask", "swayam"], description: "Primary backend language — FastAPI, Flask, PySpark, automation scripts" },
  { id: "sql", label: "SQL", level: 90, category: "language", projects: ["abbott-fastapi", "forcepoint-pipeline", "persistent-flask"], description: "PostgreSQL, MySQL, Redshift — query optimization, multi-column indexing" },
  { id: "bash", label: "Bash", level: 82, category: "language", projects: ["abbott-fastapi", "persistent-k8s", "swayam"], description: "CI/CD automation, DB backups, ops runbooks" },
  { id: "javascript", label: "JavaScript", level: 75, category: "language", projects: ["persistent-flask"], description: "Frontend integration scripts and tooling" },
  // Backend
  { id: "fastapi", label: "FastAPI", level: 92, category: "backend", projects: ["abbott-fastapi", "abbott-ai"], description: "High-throughput microservices with Redis caching & rate limiting" },
  { id: "flask", label: "Flask", level: 88, category: "backend", projects: ["persistent-flask"], description: "OAuth2-secured REST APIs serving 1M+ MAU" },
  { id: "microservices", label: "Microservices", level: 94, category: "backend", projects: ["abbott-fastapi", "abbott-ai", "forcepoint-pipeline", "swayam"], description: "Service decomposition, circuit breakers, failover patterns" },
  { id: "redis", label: "Redis", level: 85, category: "backend", projects: ["abbott-fastapi"], description: "Caching layer for sub-40ms p99 response targets" },
  // Data Engineering
  { id: "spark", label: "Apache Spark / PySpark", level: 90, category: "data", projects: ["abbott-fastapi", "forcepoint-pipeline"], description: "Distributed ETL, 83% runtime reduction at Abbott" },
  { id: "beam", label: "Apache Beam", level: 80, category: "data", projects: ["forcepoint-pipeline"], description: "Unified streaming + batch data processing" },
  { id: "glue", label: "AWS Glue", level: 88, category: "data", projects: ["abbott-fastapi"], description: "15+ production ETL pipelines refactored" },
  { id: "databricks", label: "Databricks", level: 90, category: "data", projects: ["abbott-fastapi"], description: "Lead migration architect from Redshift" },
  { id: "redshift", label: "AWS Redshift", level: 78, category: "data", projects: ["abbott-fastapi"], description: "Legacy data warehouse, migrated to Databricks" },
  // Cloud
  { id: "eks", label: "AWS EKS", level: 90, category: "cloud", projects: ["abbott-fastapi", "abbott-ai", "forcepoint-pipeline"], description: "Production Kubernetes orchestration" },
  { id: "ecs", label: "AWS ECS", level: 78, category: "cloud", projects: ["abbott-fastapi"], description: "Fargate-based container deployments" },
  { id: "s3", label: "AWS S3", level: 90, category: "cloud", projects: ["abbott-fastapi", "forcepoint-pipeline"], description: "Object storage, data lakes" },
  { id: "kinesis", label: "AWS Kinesis", level: 80, category: "cloud", projects: ["forcepoint-pipeline"], description: "Real-time log ingestion & anomaly detection" },
  { id: "apigw", label: "AWS API Gateway", level: 85, category: "cloud", projects: ["abbott-fastapi"], description: "Rate limiting, auth, request throttling" },
  { id: "gcp", label: "GCP", level: 78, category: "cloud", projects: ["persistent-flask", "persistent-k8s", "swayam"], description: "Load Balancers, Cloud CDN, Stackdriver" },
  { id: "docker", label: "Docker", level: 92, category: "cloud", projects: ["abbott-fastapi", "forcepoint-pipeline", "persistent-k8s"], description: "Containerization across multi-cloud" },
  { id: "kubernetes", label: "Kubernetes", level: 88, category: "cloud", projects: ["abbott-fastapi", "forcepoint-pipeline", "persistent-k8s"], description: "Multi-cloud orchestration, 96% deploy time reduction" },
  // Databases
  { id: "postgres", label: "PostgreSQL", level: 92, category: "database", projects: ["abbott-fastapi", "forcepoint-pipeline", "persistent-flask"], description: "Multi-column indexing, 60% p95 latency reduction" },
  { id: "mysql", label: "MySQL", level: 80, category: "database", projects: ["persistent-flask"], description: "Relational storage for Swayam-era services" },
  { id: "aurora", label: "AWS Aurora", level: 80, category: "database", projects: ["abbott-fastapi"], description: "Managed HA Postgres-compatible clusters" },
  { id: "vector-db", label: "Vector Databases", level: 75, category: "database", projects: ["abbott-ai"], description: "RAG retrieval for generative AI microservice" },
  // System Design
  { id: "distributed", label: "Distributed Systems", level: 90, category: "design", projects: ["abbott-fastapi", "forcepoint-pipeline", "swayam"], description: "High-concurrency, fault-tolerant architecture" },
  { id: "rate-limiting", label: "Rate Limiting", level: 85, category: "design", projects: ["abbott-fastapi"], description: "Token bucket, leaky bucket at API Gateway" },
  { id: "ha", label: "High Availability", level: 88, category: "design", projects: ["abbott-fastapi", "swayam"], description: "99.99% uptime via circuit breakers & failover" },
  { id: "fault-tolerance", label: "Fault Tolerance", level: 87, category: "design", projects: ["abbott-fastapi", "forcepoint-pipeline"], description: "Zero data loss during compliance events" },
];

// ──────────────────────────────────────────────────────────────────────
//  PROJECTS — with full architecture graphs
// ──────────────────────────────────────────────────────────────────────
export const projects: Project[] = [
  // ── 1. ABBOTT FASTAPI MICROSERVICES ───────────────────────────────
  {
    id: "abbott-fastapi",
    slug: "abbott-fastapi-microservices",
    title: "High-Throughput FastAPI Microservices Platform",
    company: "Abbott",
    period: "2025 – Present",
    year: 2025,
    scale: "large",
    category: "Backend Architecture",
    tagline: "500K+ daily API requests at 99.99% uptime with sub-40ms p99",
    description:
      "Architected and deployed production-grade FastAPI microservices on AWS EKS with Redis caching and API Gateway rate-limiting. The platform serves compliance-critical traffic with circuit breaker patterns and automated failover ensuring zero data loss during high-concurrency policy verification events.",
    achievements: [
      "500K+ daily API requests served at 99.99% uptime",
      "Sub-40ms p99 response times via Redis caching + multi-column indexing",
      "Circuit breaker patterns + automated failover = zero data loss during compliance events",
      "AWS API Gateway rate-limiting protects downstream services from spikes",
    ],
    stack: ["Python", "FastAPI", "AWS EKS", "AWS API Gateway", "Redis", "PostgreSQL", "AWS Aurora", "Docker"],
    accentColor: "#00F0FF",
    graph: {
      projectId: "abbott-fastapi",
      nodes: [
        { id: "client", label: "iOS / Web Client", type: "client", x: 10, y: 50, description: "Field applications issuing compliance requests", tech: ["iOS", "React"] },
        { id: "apigw", label: "API Gateway", type: "gateway", x: 28, y: 50, description: "Rate limiting, auth, request throttling", tech: ["AWS API Gateway"] },
        { id: "fastapi", label: "FastAPI Service", type: "service", x: 48, y: 30, description: "Core compliance verification logic", tech: ["Python", "FastAPI"] },
        { id: "circuit", label: "Circuit Breaker", type: "service", x: 48, y: 70, description: "Failover coordination across replicas", tech: ["Custom Python"] },
        { id: "redis", label: "Redis Cache", type: "cache", x: 70, y: 20, description: "Hot-path response cache for p99 targets", tech: ["Redis"] },
        { id: "aurora", label: "Aurora Postgres", type: "database", x: 70, y: 60, description: "Persistent compliance records", tech: ["AWS Aurora", "PostgreSQL"] },
        { id: "failover", label: "Failover Region", type: "service", x: 88, y: 50, description: "Multi-AZ standby for HA", tech: ["AWS EKS", "Route53"] },
      ],
      edges: [
        { from: "client", to: "apigw", label: "HTTPS", protocol: "http" },
        { from: "apigw", to: "fastapi", label: "rate-limited", protocol: "http" },
        { from: "apigw", to: "circuit", label: "fallback", protocol: "http" },
        { from: "fastapi", to: "redis", label: "cache lookup", protocol: "redis" },
        { from: "fastapi", to: "aurora", label: "persistence", protocol: "sql" },
        { from: "circuit", to: "failover", label: "failover", protocol: "http" },
        { from: "failover", to: "aurora", label: "replica sync", protocol: "sql" },
      ],
    },
    deepDive: {
      problem:
        "Compliance policy verification events generate massive concurrent traffic spikes. Legacy architecture couldn't maintain p99 latency targets and risked data loss during failover.",
      solution:
        "Built FastAPI services on EKS with Redis as a hot-path cache, API Gateway for rate limiting, and Aurora Postgres for durable storage. Circuit breaker pattern coordinates failover across multi-AZ replicas.",
      tradeoffs: [
        "Redis cache adds operational complexity but enables sub-40ms p99",
        "Eventual consistency on replica sync vs. strict consistency",
        "API Gateway rate limiting protects infrastructure but adds ~5ms latency",
        "Multi-AZ deployment cost justified by zero-data-loss compliance requirement",
      ],
      techStack: ["FastAPI", "AWS EKS", "AWS API Gateway", "Redis", "AWS Aurora", "PostgreSQL", "Docker", "Circuit Breaker Pattern"],
      impactMetrics: [
        { label: "Daily Requests", value: "500K+" },
        { label: "Uptime", value: "99.99%" },
        { label: "p99 Latency", value: "<40ms" },
        { label: "Data Loss Events", value: "0" },
      ],
    },
  },

  // ── 2. ABBOTT GEN-AI RAG MICROSERVICE ─────────────────────────────
  {
    id: "abbott-ai",
    slug: "abbott-generative-ai-rag",
    title: "Generative AI RAG Microservice for iOS",
    company: "Abbott",
    period: "2025 – Present",
    year: 2025,
    scale: "large",
    category: "AI / ML Engineering",
    tagline: "Replaced legacy AWS Lex with sub-second contextual AI responses for 2,000+ field users",
    description:
      "Engineered a production-grade Generative AI microservice using Retrieval-Augmented Generation (RAG) and Vector Databases, embedded into an iOS application. Replaced legacy AWS Lex to enable sub-second contextual responses for 2,000+ active field users.",
    achievements: [
      "Replaced legacy AWS Lex with RAG architecture using Vector Databases",
      "Sub-second contextual responses for 2,000+ active field users",
      "Production-grade GenAI microservice on AWS EKS",
      "Seamless iOS integration with native UX",
    ],
    stack: ["Python", "FastAPI", "Vector Databases", "RAG", "AWS EKS", "AWS Lex (replaced)", "iOS"],
    accentColor: "#8B5CF6",
    graph: {
      projectId: "abbott-ai",
      nodes: [
        { id: "ios", label: "iOS App", type: "client", x: 8, y: 50, description: "2,000+ active field users", tech: ["iOS", "Swift"] },
        { id: "apigw", label: "API Gateway", type: "gateway", x: 25, y: 50, description: "Auth + rate limiting", tech: ["AWS API Gateway"] },
        { id: "rag", label: "RAG Orchestrator", type: "ai", x: 45, y: 30, description: "Retrieval-augmented generation pipeline", tech: ["Python", "FastAPI"] },
        { id: "embed", label: "Embeddings Service", type: "ai", x: 45, y: 70, description: "Vector encoding of queries", tech: ["Python"] },
        { id: "vdb", label: "Vector Database", type: "database", x: 68, y: 70, description: "Semantic similarity search", tech: ["Vector DB"] },
        { id: "llm", label: "LLM Inference", type: "ai", x: 68, y: 30, description: "Generates contextual response", tech: ["LLM API"] },
        { id: "eks", label: "EKS Compute", type: "service", x: 88, y: 50, description: "Container orchestration", tech: ["AWS EKS"] },
      ],
      edges: [
        { from: "ios", to: "apigw", label: "HTTPS", protocol: "http" },
        { from: "apigw", to: "rag", label: "routed", protocol: "http" },
        { from: "rag", to: "embed", label: "encode", protocol: "grpc" },
        { from: "embed", to: "vdb", label: "query", protocol: "tcp" },
        { from: "rag", to: "llm", label: "augmented prompt", protocol: "http" },
        { from: "llm", to: "eks", label: "scheduled", protocol: "http" },
        { from: "rag", to: "ios", label: "streamed response", protocol: "http" },
      ],
    },
    deepDive: {
      problem:
        "Legacy AWS Lex chatbot couldn't deliver contextual, knowledge-grounded responses for 2,000+ field users. Latency was unacceptable for in-field usage.",
      solution:
        "Replaced Lex with a RAG architecture: queries are embedded, matched against a Vector Database, augmented with retrieved context, then sent to an LLM for generation. Deployed on EKS for horizontal scalability.",
      tradeoffs: [
        "RAG adds retrieval latency but enables sub-second contextual responses",
        "Vector DB cost vs. semantic search quality tradeoff",
        "LLM inference scaling requires careful GPU capacity planning",
        "Replacement of AWS Lex removed managed-service SLA but gained customization",
      ],
      techStack: ["RAG", "Vector Databases", "FastAPI", "AWS EKS", "Python", "LLM APIs", "iOS"],
      impactMetrics: [
        { label: "Active Field Users", value: "2,000+" },
        { label: "Response Time", value: "<1s" },
        { label: "Legacy System Replaced", value: "AWS Lex" },
        { label: "Contextual Accuracy", value: "High" },
      ],
    },
  },

  // ── 3. ABBOTT REDSHIFT→DATABRICKS MIGRATION ───────────────────────
  {
    id: "abbott-etl",
    slug: "abbott-redshift-databricks-migration",
    title: "Redshift → Databricks Data Platform Migration",
    company: "Abbott",
    period: "2025 – Present",
    year: 2025,
    scale: "large",
    category: "Data Engineering",
    tagline: "83% runtime reduction across 15+ AWS Glue ETL pipelines (3.5h → 35min)",
    description:
      "Spearheaded the data platform migration from Amazon Redshift to Databricks, refactoring 15+ AWS Glue ETL pipelines and optimizing PySpark jobs to reduce execution runtime by 83% (from 3.5 hours to 35 minutes).",
    achievements: [
      "Migrated 15+ AWS Glue ETL pipelines from Redshift to Databricks",
      "83% runtime reduction — 3.5 hours → 35 minutes execution time",
      "PySpark job optimization via partitioning, caching, and broadcast joins",
      "Won Data Platform Excellence Award for this migration",
    ],
    stack: ["Python", "PySpark", "Databricks", "AWS Glue", "Amazon Redshift", "Apache Spark"],
    accentColor: "#10B981",
    graph: {
      projectId: "abbott-etl",
      nodes: [
        { id: "s3", label: "S3 Data Lake", type: "database", x: 8, y: 50, description: "Raw + curated data layers", tech: ["AWS S3"] },
        { id: "glue", label: "AWS Glue Jobs", type: "service", x: 28, y: 30, description: "15+ ETL pipelines refactored", tech: ["AWS Glue"] },
        { id: "glue2", label: "Glue Catalog", type: "service", x: 28, y: 70, description: "Schema registry", tech: ["AWS Glue Catalog"] },
        { id: "spark", label: "PySpark Cluster", type: "service", x: 50, y: 50, description: "Distributed compute, optimized for runtime", tech: ["PySpark", "Apache Spark"] },
        { id: "redshift", label: "Redshift (Legacy)", type: "database", x: 72, y: 30, description: "Decommissioned warehouse", tech: ["AWS Redshift"] },
        { id: "databricks", label: "Databricks Lakehouse", type: "database", x: 72, y: 70, description: "Unified analytics + ML platform", tech: ["Databricks"] },
        { id: "bi", label: "BI / ML Consumers", type: "client", x: 92, y: 50, description: "Downstream analytics + ML teams", tech: ["Tableau", "ML"] },
      ],
      edges: [
        { from: "s3", to: "glue", label: "raw extract", protocol: "tcp" },
        { from: "s3", to: "glue2", label: "catalog", protocol: "tcp" },
        { from: "glue", to: "spark", label: "submit job", protocol: "grpc" },
        { from: "glue2", to: "spark", label: "schema", protocol: "grpc" },
        { from: "spark", to: "redshift", label: "legacy unload", protocol: "sql" },
        { from: "spark", to: "databricks", label: "delta write", protocol: "tcp" },
        { from: "databricks", to: "bi", label: "query", protocol: "sql" },
      ],
    },
    deepDive: {
      problem:
        "15+ AWS Glue ETL pipelines running on Redshift were taking 3.5 hours per execution, blocking downstream BI/ML consumers and inflating compute costs.",
      solution:
        "Migrated the entire data platform to Databricks Lakehouse. Refactored PySpark jobs with partition tuning, broadcast joins, and Delta Lake caching. Reduced runtime from 3.5h to 35min.",
      tradeoffs: [
        "Databricks licensing cost offset by 83% runtime reduction",
        "Migration required retraining data teams on Lakehouse paradigm",
        "Delta Lake format locks in Databricks ecosystem but enables ACID on object storage",
        "Glue catalog retained for backward compatibility during transition",
      ],
      techStack: ["Databricks", "PySpark", "AWS Glue", "AWS S3", "Apache Spark", "Delta Lake"],
      impactMetrics: [
        { label: "Runtime Reduction", value: "83%" },
        { label: "Before → After", value: "3.5h → 35min" },
        { label: "Pipelines Refactored", value: "15+" },
        { label: "Award", value: "Data Platform Excellence" },
      ],
    },
  },

  // ── 4. FORCEPOINT REAL-TIME SECURITY PIPELINE ─────────────────────
  {
    id: "forcepoint-pipeline",
    slug: "forcepoint-realtime-security-pipeline",
    title: "Real-Time Security Log Processing Pipeline",
    company: "Forcepoint Corp",
    period: "Jan 2023 – Oct 2023",
    year: 2023,
    scale: "large",
    category: "Data Engineering",
    tagline: "5TB daily security log processing across AWS + GCP at 99.9% uptime",
    description:
      "Designed real-time data processing pipelines using Apache Spark and Apache Beam, processing over 5TB of daily security log data across AWS and GCP environments with 99.9% uptime. Integrated AWS Kinesis streams with EKS-hosted microservices for real-time log ingestion and anomaly detection.",
    achievements: [
      "5TB+ daily security log data processed with 99.9% uptime",
      "Apache Spark + Apache Beam unified streaming + batch processing",
      "60% p95 database query latency reduction via multi-column indexing",
      "15+ engineering hours/week saved via CI/CD automation",
    ],
    stack: ["Python", "Apache Spark", "Apache Beam", "AWS Kinesis", "AWS EKS", "PostgreSQL", "AWS RDS", "Docker"],
    accentColor: "#00F0FF",
    graph: {
      projectId: "forcepoint-pipeline",
      nodes: [
        { id: "sources", label: "Security Sensors", type: "client", x: 5, y: 50, description: "Network + endpoint security log sources", tech: ["Syslog", "NetFlow"] },
        { id: "kinesis", label: "AWS Kinesis Streams", type: "stream", x: 25, y: 30, description: "Real-time ingestion at 5TB/day", tech: ["AWS Kinesis"] },
        { id: "beam", label: "Apache Beam Pipeline", type: "service", x: 25, y: 70, description: "Unified streaming + batch ETL", tech: ["Apache Beam"] },
        { id: "spark", label: "Apache Spark Cluster", type: "service", x: 50, y: 50, description: "Distributed processing + anomaly detection", tech: ["Apache Spark", "PySpark"] },
        { id: "rds", label: "PostgreSQL / RDS", type: "database", x: 72, y: 30, description: "Multi-column indexed queries", tech: ["PostgreSQL", "AWS RDS"] },
        { id: "eks", label: "EKS Microservices", type: "service", x: 72, y: 70, description: "Anomaly detection + alerting", tech: ["AWS EKS"] },
        { id: "alerts", label: "Alerting & SIEM", type: "client", x: 92, y: 50, description: "Downstream security operations", tech: ["SIEM"] },
      ],
      edges: [
        { from: "sources", to: "kinesis", label: "stream", protocol: "kinesis" },
        { from: "sources", to: "beam", label: "batch", protocol: "tcp" },
        { from: "kinesis", to: "spark", label: "consume", protocol: "kinesis" },
        { from: "beam", to: "spark", label: "transform", protocol: "grpc" },
        { from: "spark", to: "rds", label: "query", protocol: "sql" },
        { from: "spark", to: "eks", label: "trigger", protocol: "http" },
        { from: "eks", to: "alerts", label: "alert", protocol: "http" },
      ],
    },
    deepDive: {
      problem:
        "Enterprise security platform needed to process 5TB/day of security logs across hybrid AWS+GCP environments in real-time, with anomaly detection and sub-second alerting.",
      solution:
        "Designed unified streaming + batch pipelines using Kinesis for ingestion, Apache Beam for ETL, and Spark for distributed processing. PostgreSQL/RDS stores indexed results; EKS-hosted microservices handle anomaly detection and alerting.",
      tradeoffs: [
        "Apache Beam adds abstraction layer but enables portable streaming + batch",
        "Multi-cloud (AWS + GCP) increases complexity but provides vendor diversification",
        "60% p95 latency reduction required careful multi-column indexing strategy",
        "Real-time alerting traded some accuracy for speed (anomaly detection window)",
      ],
      techStack: ["Apache Spark", "Apache Beam", "AWS Kinesis", "AWS EKS", "PostgreSQL", "AWS RDS", "Docker", "Python"],
      impactMetrics: [
        { label: "Daily Data", value: "5TB+" },
        { label: "Uptime", value: "99.9%" },
        { label: "p95 Latency Reduction", value: "60%" },
        { label: "Hours Saved/Week", value: "15+" },
      ],
    },
  },

  // ── 5. PERSISTENT SYSTEMS FLASK REST APIs ─────────────────────────
  {
    id: "persistent-flask",
    slug: "persistent-flask-rest-apis",
    title: "Scalable OAuth2 Flask REST APIs (1M+ MAU)",
    company: "Persistent Systems",
    period: "Jan 2022 – Jan 2023",
    year: 2022,
    scale: "large",
    category: "Backend Engineering",
    tagline: "Backend services for 1M+ monthly active users with OAuth2 security",
    description:
      "Engineered secure, scalable REST APIs using Python Flask and GCP, supporting backends services for over 1M monthly active users while maintaining OAuth2 authentication standards. Led technical execution across a team of 4 engineers with >85% unit test coverage.",
    achievements: [
      "1M+ monthly active users supported",
      "OAuth2 authentication standards enforced across all endpoints",
      "Led team of 4 engineers with >85% test coverage",
      "Multi-cloud deployment on AWS + GCP",
    ],
    stack: ["Python", "Flask", "GCP", "OAuth2", "PostgreSQL", "MySQL", "Docker", "Kubernetes"],
    accentColor: "#8B5CF6",
    graph: {
      projectId: "persistent-flask",
      nodes: [
        { id: "client", label: "Web + Mobile Clients", type: "client", x: 8, y: 50, description: "1M+ MAU consumer traffic", tech: ["Web", "Mobile"] },
        { id: "lb", label: "GCP Load Balancer", type: "gateway", x: 25, y: 50, description: "Global traffic distribution", tech: ["GCP LB"] },
        { id: "oauth", label: "OAuth2 Service", type: "service", x: 45, y: 30, description: "Token issuance + validation", tech: ["Python", "OAuth2"] },
        { id: "flask", label: "Flask REST API", type: "service", x: 45, y: 70, description: "Business logic endpoints", tech: ["Python", "Flask"] },
        { id: "postgres", label: "PostgreSQL", type: "database", x: 70, y: 30, description: "User data, transactions", tech: ["PostgreSQL"] },
        { id: "mysql", label: "MySQL", type: "database", x: 70, y: 70, description: "Legacy service storage", tech: ["MySQL"] },
        { id: "cdn", label: "Cloud CDN", type: "cache", x: 90, y: 50, description: "Static asset distribution", tech: ["GCP Cloud CDN"] },
      ],
      edges: [
        { from: "client", to: "lb", label: "HTTPS", protocol: "http" },
        { from: "lb", to: "oauth", label: "auth", protocol: "http" },
        { from: "lb", to: "flask", label: "route", protocol: "http" },
        { from: "flask", to: "oauth", label: "verify token", protocol: "http" },
        { from: "flask", to: "postgres", label: "primary db", protocol: "sql" },
        { from: "flask", to: "mysql", label: "legacy", protocol: "sql" },
        { from: "lb", to: "cdn", label: "static", protocol: "http" },
      ],
    },
    deepDive: {
      problem:
        "Backend services needed to scale to 1M+ monthly active users while maintaining strict OAuth2 security standards across multi-cloud infrastructure.",
      solution:
        "Built Flask REST APIs with OAuth2 token-based auth, deployed on GCP behind global load balancers with Cloud CDN. Multi-DB architecture (PostgreSQL + MySQL) supported both modern and legacy service consumers. Led a team of 4 engineers with >85% test coverage.",
      tradeoffs: [
        "Flask (sync) vs. async frameworks — chose Flask for ecosystem maturity",
        "Multi-DB (Postgres + MySQL) increased complexity but enabled legacy integration",
        "OAuth2 token validation adds ~8ms per request, justified by security requirement",
        ">85% test coverage slowed dev velocity but enabled confident refactoring",
      ],
      techStack: ["Flask", "Python", "GCP", "OAuth2", "PostgreSQL", "MySQL", "Docker", "Kubernetes"],
      impactMetrics: [
        { label: "Monthly Active Users", value: "1M+" },
        { label: "Team Size Led", value: "4 engineers" },
        { label: "Test Coverage", value: ">85%" },
        { label: "Auth Standard", value: "OAuth2" },
      ],
    },
  },

  // ── 6. SWAYAM NATIONAL EDUCATION PLATFORM ────────────────────────
  {
    id: "swayam",
    slug: "swayam-national-education-platform",
    title: "Swayam National Education Platform (10M+ Users)",
    company: "Persistent Systems",
    period: "Aug 2020 – Jan 2022",
    year: 2021,
    scale: "large",
    category: "Backend Engineering",
    tagline: "<100ms response for 10M+ peak users during registration surges",
    description:
      "Developed high-concurrency Python RESTful microservices for Swayam, India's national education platform, maintaining <100ms average response times during peak registration periods for 10M+ users. Configured GCP Load Balancers, Cloud CDN, and Stackdriver monitoring to maintain 99.95% uptime.",
    achievements: [
      "10M+ peak concurrent users during national registration events",
      "<100ms average response time maintained under peak load",
      "99.95% uptime via GCP Load Balancers + Cloud CDN + Stackdriver",
      "Custom Python/Bash automations reduced operational downtime",
    ],
    stack: ["Python", "RESTful APIs", "GCP Load Balancers", "Cloud CDN", "Stackdriver", "Bash"],
    accentColor: "#10B981",
    graph: {
      projectId: "swayam",
      nodes: [
        { id: "students", label: "10M+ Students", type: "client", x: 5, y: 50, description: "National education platform users", tech: ["Web", "Mobile"] },
        { id: "gclb", label: "GCP Load Balancer", type: "gateway", x: 25, y: 50, description: "Global traffic distribution", tech: ["GCP LB"] },
        { id: "cdn", label: "Cloud CDN", type: "cache", x: 45, y: 30, description: "Edge-cached course content", tech: ["GCP Cloud CDN"] },
        { id: "api", label: "Python REST API", type: "service", x: 45, y: 70, description: "<100ms response microservices", tech: ["Python"] },
        { id: "stackdriver", label: "Stackdriver Monitoring", type: "service", x: 70, y: 30, description: "Real-time observability + alerting", tech: ["Stackdriver"] },
        { id: "db", label: "Database Cluster", type: "database", x: 70, y: 70, description: "Student records, course data", tech: ["MySQL"] },
        { id: "autoscale", label: "Auto-scaling Group", type: "service", x: 90, y: 50, description: "Reactive scale during peak", tech: ["GCP MIG"] },
      ],
      edges: [
        { from: "students", to: "gclb", label: "HTTPS", protocol: "http" },
        { from: "gclb", to: "cdn", label: "static", protocol: "http" },
        { from: "gclb", to: "api", label: "dynamic", protocol: "http" },
        { from: "api", to: "db", label: "query", protocol: "sql" },
        { from: "api", to: "stackdriver", label: "metrics", protocol: "http" },
        { from: "stackdriver", to: "autoscale", label: "scale trigger", protocol: "http" },
      ],
    },
    deepDive: {
      problem:
        "Swayam, India's national education platform, faced massive concurrent registration surges during admission cycles. Required <100ms response times for 10M+ users while maintaining 99.95% uptime.",
      solution:
        "Built high-concurrency Python RESTful microservices fronted by GCP Load Balancers with Cloud CDN for static content. Stackdriver monitoring triggered auto-scaling during peak events. Custom Python/Bash scripts automated DB backups and ops.",
      tradeoffs: [
        "Cloud CDN cost justified by <100ms response time requirement",
        "Auto-scaling reactive vs. proactive — chose reactive for cost efficiency",
        "Single MySQL cluster (vs. sharding) sufficient given read-heavy workload",
        "Custom Bash automation traded maintainability for ops speed",
      ],
      techStack: ["Python", "GCP Load Balancers", "Cloud CDN", "Stackdriver", "MySQL", "Bash"],
      impactMetrics: [
        { label: "Peak Users", value: "10M+" },
        { label: "Avg Response Time", value: "<100ms" },
        { label: "Uptime", value: "99.95%" },
        { label: "Platform", value: "National (India)" },
      ],
    },
  },

  // ── 7. PERSISTENT MULTI-CLOUD K8S PROVISIONING ─────────────────
  {
    id: "persistent-k8s",
    slug: "persistent-multicloud-k8s-provisioning",
    title: "Multi-Cloud K8s Provisioning Automation",
    company: "Persistent Systems",
    period: "Jan 2022 – Jan 2023",
    year: 2022,
    scale: "medium",
    category: "DevOps / Infrastructure",
    tagline: "96% deployment time reduction: 2 days → 30 minutes via Docker + K8s",
    description:
      "Automated multi-cloud server provisioning and container orchestration across AWS and GCP using Docker and Kubernetes, reducing environment deployment times from 2 days to under 30 minutes. Streamlined CI/CD workflows with Python, Bash scripts, and Docker/EKS pipelines, automating manual operations and saving 15+ engineering hours per week.",
    achievements: [
      "96% deployment time reduction — 2 days → 30 minutes",
      "Multi-cloud (AWS + GCP) server provisioning automation",
      "15+ engineering hours/week saved via CI/CD automation",
      "Standardized container orchestration across environments",
    ],
    stack: ["Docker", "Kubernetes", "AWS EKS", "GCP GKE", "Python", "Bash", "CI/CD"],
    accentColor: "#00F0FF",
    graph: {
      projectId: "persistent-k8s",
      nodes: [
        { id: "cicd", label: "CI/CD Pipeline", type: "gateway", x: 10, y: 50, description: "Python + Bash automation", tech: ["Jenkins", "Python"] },
        { id: "docker", label: "Docker Build", type: "service", x: 30, y: 30, description: "Containerized artifacts", tech: ["Docker"] },
        { id: "registry", label: "Container Registry", type: "cache", x: 30, y: 70, description: "Multi-cloud image distribution", tech: ["ECR", "GCR"] },
        { id: "eks", label: "AWS EKS", type: "service", x: 55, y: 30, description: "Production AWS K8s cluster", tech: ["AWS EKS"] },
        { id: "gke", label: "GCP GKE", type: "service", x: 55, y: 70, description: "Production GCP K8s cluster", tech: ["GCP GKE"] },
        { id: "apps", label: "Deployed Apps", type: "client", x: 80, y: 50, description: "Cross-cloud services", tech: ["Microservices"] },
      ],
      edges: [
        { from: "cicd", to: "docker", label: "build", protocol: "http" },
        { from: "docker", to: "registry", label: "push", protocol: "http" },
        { from: "registry", to: "eks", label: "pull", protocol: "http" },
        { from: "registry", to: "gke", label: "pull", protocol: "http" },
        { from: "eks", to: "apps", label: "deploy", protocol: "http" },
        { from: "gke", to: "apps", label: "deploy", protocol: "http" },
      ],
    },
    deepDive: {
      problem:
        "Multi-cloud deployments across AWS + GCP were taking 2 days per environment, blocking developer velocity and inflating operational costs.",
      solution:
        "Built automated provisioning with Docker containerization and Kubernetes orchestration across EKS + GKE. CI/CD pipelines in Python + Bash automated the entire flow, reducing deploy time to <30 minutes.",
      tradeoffs: [
        "K8s abstraction adds learning curve but enables multi-cloud portability",
        "Container registries (ECR + GCR) duplicate storage but optimize pull latency",
        "Bash scripts traded maintainability for ops velocity",
        "Standardized images locked teams into approved base stacks",
      ],
      techStack: ["Docker", "Kubernetes", "AWS EKS", "GCP GKE", "Python", "Bash", "Jenkins"],
      impactMetrics: [
        { label: "Deploy Time Reduction", value: "96%" },
        { label: "Before → After", value: "2 days → 30min" },
        { label: "Hours Saved/Week", value: "15+" },
        { label: "Clouds Unified", value: "AWS + GCP" },
      ],
    },
  },
];

// ──────────────────────────────────────────────────────────────────────
//  CAREER TIMELINE — git-commit styled
// ──────────────────────────────────────────────────────────────────────
export const careerCommits: TimelineCommit[] = [
  {
    id: "commit-abbott-ai",
    hash: "a1b2c3d",
    type: "feat",
    date: "2025-Q3",
    title: "feat(ai): ship GenAI RAG microservice replacing AWS Lex",
    company: "Abbott",
    body: "Engineered production-grade Generative AI microservice using RAG + Vector Databases for iOS. Sub-second contextual responses for 2,000+ field users.",
    filesChanged: 142,
    additions: 8421,
    deletions: 3120,
  },
  {
    id: "commit-abbott-etl",
    hash: "b2c3d4e",
    type: "perf",
    date: "2025-Q2",
    title: "perf(etl): migrate 15+ Glue pipelines Redshift → Databricks",
    company: "Abbott",
    body: "Refactored PySpark jobs with partitioning + broadcast joins. Runtime reduced 83% (3.5h → 35min). Won Data Platform Excellence Award.",
    filesChanged: 87,
    additions: 5230,
    deletions: 4820,
  },
  {
    id: "commit-abbott-fastapi",
    hash: "c3d4e5f",
    type: "feat",
    date: "2025-Q1",
    title: "feat(services): FastAPI microservices on EKS with circuit breakers",
    company: "Abbott",
    body: "Architected high-throughput FastAPI services with Redis caching + API Gateway rate limiting. 500K+ daily requests at 99.99% uptime, <40ms p99.",
    filesChanged: 96,
    additions: 6210,
    deletions: 980,
  },
  {
    id: "commit-forcepoint-cicd",
    hash: "d4e5f6a",
    type: "chore",
    date: "2023-Q3",
    title: "chore(ci): automate Docker/EKS pipelines saving 15h/week",
    company: "Forcepoint Corp",
    body: "Streamlined CI/CD workflows with Python + Bash. Automated manual ops, saving 15+ engineering hours per week.",
    filesChanged: 42,
    additions: 1840,
    deletions: 2120,
  },
  {
    id: "commit-forcepoint-pipeline",
    hash: "e5f6a7b",
    type: "feat",
    date: "2023-Q2",
    title: "feat(data): real-time 5TB/day security log pipeline",
    company: "Forcepoint Corp",
    body: "Designed Apache Spark + Beam pipelines across AWS+GCP. 5TB/day with 99.9% uptime. 60% p95 latency reduction via multi-column indexing.",
    filesChanged: 118,
    additions: 7320,
    deletions: 1450,
  },
  {
    id: "commit-persistent-k8s",
    hash: "f6a7b8c",
    type: "infra",
    date: "2022-Q4",
    title: "infra: multi-cloud K8s provisioning, 2d → 30min deploys",
    company: "Persistent Systems",
    body: "Automated multi-cloud server provisioning with Docker + Kubernetes across AWS+GCP. 96% deployment time reduction.",
    filesChanged: 64,
    additions: 4120,
    deletions: 3280,
  },
  {
    id: "commit-persistent-flask",
    hash: "a7b8c9d",
    type: "feat",
    date: "2022-Q2",
    title: "feat(api): OAuth2 Flask REST APIs for 1M+ MAU",
    company: "Persistent Systems",
    body: "Engineered secure Flask REST APIs on GCP with OAuth2. Led team of 4 engineers. >85% test coverage.",
    filesChanged: 152,
    additions: 9840,
    deletions: 2100,
  },
  {
    id: "commit-swayam",
    hash: "b8c9d0e",
    type: "feat",
    date: "2021-Q3",
    title: "feat(scale): Swayam <100ms response for 10M+ users",
    company: "Persistent Systems",
    body: "Built high-concurrency Python microservices for India's national education platform. GCP LB + Cloud CDN + Stackdriver for 99.95% uptime.",
    filesChanged: 203,
    additions: 12480,
    deletions: 820,
  },
];

// ──────────────────────────────────────────────────────────────────────
//  AWARDS
// ──────────────────────────────────────────────────────────────────────
export const awards: Award[] = [
  {
    id: "abbott-excellence",
    title: "Data Platform Excellence Award",
    issuer: "Abbott",
    year: "2025",
    description: "Recognized for leading the Redshift-to-Databricks migration, modernizing Glue/Spark jobs, and delivering an 83% runtime reduction.",
    icon: "Trophy",
  },
  {
    id: "persistent-top-talent",
    title: "Top Talent Of The Year Award",
    issuer: "Persistent Systems",
    year: "2022",
    description: "Awarded top engineering honors for exceptional product delivery across multi-cloud environments.",
    icon: "Star",
  },
  {
    id: "bravo-6x",
    title: "6× Bravo Excellence Award",
    issuer: "Cross-Functional",
    year: "2020–2026",
    description: "Recognized for outstanding cross-functional technical leadership, system architecture contributions, and cross-team collaboration.",
    icon: "Award",
  },
];

// ──────────────────────────────────────────────────────────────────────
//  EDUCATION
// ──────────────────────────────────────────────────────────────────────
export const education = {
  institution: "Pune University — K.K. Wagh College of Engineering",
  degree: "Bachelor of Engineering in Computer Science",
  period: "Aug 2016 – Jul 2020",
  gpa: "9.1 / 10",
  highlights: [
    "Computer Science fundamentals — algorithms, OS, DBMS, networks",
    "Strong foundation in distributed systems and software engineering",
    "Consistent academic excellence (9.1/10 GPA)",
  ],
};

// ──────────────────────────────────────────────────────────────────────
//  COMPETENCY RADAR — for Skill Tree visualization
// ──────────────────────────────────────────────────────────────────────
export const competencyRadar = [
  { axis: "Distributed Systems", value: 92, projects: 4 },
  { axis: "Cloud / DevOps", value: 90, projects: 6 },
  { axis: "System Design", value: 88, projects: 5 },
  { axis: "Data Engineering", value: 89, projects: 3 },
  { axis: "Backend Mastery", value: 93, projects: 6 },
  { axis: "AI Integration", value: 78, projects: 1 },
];

// ──────────────────────────────────────────────────────────────────────
//  CONVENIENCE HELPERS
// ──────────────────────────────────────────────────────────────────────
export const projectsByScale = (scale: Project["scale"]) =>
  projects.filter((p) => p.scale === scale);

export const projectById = (id: string) => projects.find((p) => p.id === id);

export const skillsByCategory = (cat: SkillNode["category"]) =>
  skillTree.filter((s) => s.category === cat);
