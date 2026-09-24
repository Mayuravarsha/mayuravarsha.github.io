/*
 * Site content lives here so it's easy to update without touching layout code.
 *
 * To add a project, copy one of the objects in PROJECTS and edit it:
 *   title    - project name
 *   period   - optional, e.g. "2023"
 *   tags     - categories used by the filter buttons (e.g. "ML", "Systems", "Web")
 *   stack    - technologies shown as chips
 *   summary  - one or two sentences shown on the card
 *   points   - optional bullet list shown when the card is expanded
 *   badge    - optional highlight label (e.g. "Award")
 *   links    - optional list of { label, url } (GitHub, paper, demo, ...)
 *   featured - optional; featured cards span wider on large screens
 */

const EXPERIENCE = [
  {
    role: 'AI Engineer Intern',
    company: 'Canyontechs AI',
    location: 'San Ramon, CA (Remote)',
    period: "Jun '26 – Aug '26",
    points: [
      'Added bidirectional Splunk integration to a production Go log-monitoring agent — pulling logs from Splunk as a source and pushing detected incidents to a Splunk HEC endpoint with TLS and non-blocking failure handling.',
      "Extended a multi-language log parser to recognize output from Rust's structured tracing crate, adding regex triggers and incident extraction with context capture for previously missed structured errors.",
    ],
    stack: ['Go', 'Splunk', 'Rust', 'TLS'],
  },
  {
    role: 'Graduate Teaching Assistant',
    company: 'Penn State — CMPSC 360',
    location: 'University Park, PA',
    period: "Aug '26 – May '27",
    points: ['Teaching assistant for Discrete Mathematics for computer science undergraduates.'],
    stack: ['Discrete Math', 'Teaching'],
  },
  {
    role: 'Application Engineer',
    company: 'IDFC First Bank',
    location: 'Bengaluru, India',
    period: "Feb '23 – Jul '25",
    points: [
      "Integrated CleverTap SDKs and tracking events across the bank's mobile and web apps to surface drop-off points, enabling targeted campaigns that drove a $6M revenue increase and a 10% rise in engagement.",
      'Built a Go API enabling autopay for utility bills, compatible with the Bharat Bill Payment System (BBPS).',
      'Developed an end-to-end anomaly-detection event portal (React, Go, MongoDB) with automated email alerts on configurable Airflow DAG schedules — hourly, daily, weekly, monthly.',
    ],
    stack: ['Go', 'React', 'MongoDB', 'Airflow', 'CleverTap'],
  },
];

const PROJECTS = [
  {
    title: 'Violent Content Detection in Videos',
    period: '2023',
    featured: true,
    badge: '2nd Best Paper · IEEE ICAECIS',
    tags: ['ML', 'Computer Vision', 'Research'],
    stack: ['Python', 'TensorFlow/Keras', 'OpenCV', 'NumPy', 'FFmpeg'],
    summary:
      'A cascaded audio-visual deep learning system that detects violence in video — a lightweight audio CNN short-circuits, and a C3D video model only runs when needed. 96.53% mean accuracy across four benchmark datasets.',
    points: [
      'Preprocessing pipeline: lossless WAV extraction with FFmpeg, 16-frame 112×112 video chunks, serialized to NumPy memory maps to stream 15,648 chunks from disk.',
      'Audio branch: STFT spectrograms into a 7-layer CNN (7.8M params) with batch norm, dropout and L1/L2 regularization.',
      'Video branch: transfer learning with frozen C3D (Sports-1M) features and a 4.7M-param dense head — 51% fewer trainable params than ConvLSTM, 36% fewer than EfficientNet.',
      'Published and presented at IEEE ICAECIS 2023; 2nd Best Paper among 1,300+ papers from 30+ countries.',
    ],
    links: [],
  },
  {
    title: 'Distributed Ride-Matching Service',
    tags: ['Systems', 'Backend'],
    stack: ['Python', 'Flask', 'RabbitMQ', 'MongoDB', 'Docker'],
    summary:
      'A containerized ride-hailing backend where a Flask producer fans each request out to a matching work queue and a persistence queue, decoupling match latency from request handling.',
    points: [
      'Horizontally scaled matching workers and a MongoDB writer, correlated by a shared request ID.',
      'At-least-once delivery via persistent messages, post-work acknowledgements, and prefetch=1 so in-flight rides are requeued if a worker dies.',
    ],
    links: [],
  },
  {
    title: 'Splunk Integration for a Log-Monitoring Agent',
    period: '2026',
    tags: ['Systems', 'Backend'],
    stack: ['Go', 'Splunk HEC', 'TLS'],
    summary:
      'Bidirectional Splunk support for a production Go agent: ingest logs from Splunk and ship detected incidents back over HEC with TLS and non-blocking failure handling.',
    links: [],
  },
  {
    title: 'Event Anomaly-Detection Portal',
    period: '2024',
    tags: ['Web', 'Backend', 'Data'],
    stack: ['React', 'Go', 'MongoDB', 'Airflow'],
    summary:
      'End-to-end portal for tracking app events and flagging abnormal counts and unusual user interactions, with automated alerts on configurable Airflow DAG schedules.',
    links: [],
  },
];

const SKILLS = [
  { group: 'Languages', icon: '⌨', items: ['Python', 'C', 'C++', 'Java', 'Go', 'Rust', 'JavaScript', 'SQL', 'MATLAB'] },
  { group: 'ML / Data', icon: '◈', items: ['PyTorch', 'TensorFlow/Keras', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas', 'Spark', 'Airflow'] },
  { group: 'Infrastructure', icon: '⧉', items: ['Docker', 'Kubernetes', 'AWS', 'Kafka', 'RabbitMQ', 'Redis', 'Elasticsearch', 'Grafana', 'Jaeger', 'Splunk', 'Git', 'Unix'] },
  { group: 'Databases', icon: '⛁', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'] },
];

const TYPED_WORDS = ['intelligent systems', 'computer vision models', 'reliable backends', 'data pipelines'];
