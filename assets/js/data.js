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
      'Added bidirectional Splunk integration to a production Go log-monitoring agent — pulling logs from Splunk as a source and pushing detected incidents to a Splunk HEC endpoint with configurable TLS and non-blocking failure handling.',
      "Extended a multi-language log parser to recognize output from Rust's structured tracing crate, adding regex triggers and incident extraction with context capture for previously missed structured errors.",
      'Built a full-stack in-app contact form (React + FastAPI) that automatically creates confidential GitLab issues.',
    ],
    stack: ['Go', 'Splunk', 'Rust', 'React', 'FastAPI', 'GitLab'],
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
    role: 'Learning Assistant',
    company: 'Penn State — CMPSC 200',
    location: 'University Park, PA',
    period: "Jan '26 – May '26",
    points: [
      'Guided students in Programming for Engineers with MATLAB — algorithm development, control structures, and numerical methods — through structured instruction and problem-solving, while evaluating assessments and giving academic feedback.',
    ],
    stack: ['MATLAB', 'Numerical Methods', 'Teaching'],
  },
  {
    role: 'Application Engineer (Intern → Full-time)',
    company: 'IDFC First Bank',
    location: 'Bengaluru, India',
    period: "Feb '23 – Jul '25",
    points: [
      "Integrated CleverTap SDKs and tracking events across the bank's mobile and web apps to surface drop-off points, enabling targeted campaigns that drove a $6M revenue increase and a 10% rise in engagement.",
      'Architected a fault-tolerant Go microservice enabling autopay for utility bills on the Bharat Bill Payment System (BBPS), designed to handle 1,200 transactions per second with minimal latency.',
      'Developed an end-to-end anomaly-detection event portal (React, Go, MongoDB) with automated email alerts on configurable Airflow DAG schedules — hourly, daily, weekly, monthly.',
      'Revamped customer-acquisition journeys and payment flows in React (lazy loading, memoization, code-splitting), leading to a 12% increase in new customers onboarded.',
      'Drafted and standardized Confluence documentation for integrating CleverTap into new user journeys, ensuring consistent implementation across squads.',
      'Took part across the SDLC with peer code reviews and robust test cases to keep the codebase clean and maintainable.',
    ],
    stack: ['Go', 'React', 'MongoDB', 'Airflow', 'CleverTap', 'Confluence'],
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
      'A cascaded audio-visual deep learning system that detects violence in video — a lightweight audio CNN screens every clip, and a C3D video model only runs when needed. 96.53% mean accuracy across four benchmark datasets (Violent Flows, Movies, Hockey Fights, RLVS).',
    points: [
      'Preprocessing pipeline: lossless WAV extraction with FFmpeg, 16-frame 112×112 video chunks, serialized to NumPy memory maps to stream 15,648 chunks from disk.',
      'Audio branch: STFT spectrograms into a 7-layer CNN (7.8M params) with batch norm, dropout and L1/L2 regularization on a 938-sample training set.',
      'Video branch: transfer learning with frozen C3D (Sports-1M) features and a 4.7M-param dense head — vs. 9.6M for ConvLSTM and 7.4M for EfficientNet.',
      'Stratified shuffle-split cross-validation; per-dataset accuracy from 95.77% to 97.57%, surpassing state-of-the-art methods by up to 18.73%.',
      'Published and presented at IEEE ICAECIS 2023; 2nd Best Paper among 1,300+ papers from 30+ countries.',
    ],
    links: [{ label: 'Paper', url: 'https://doi.org/10.1109/ICAECIS58353.2023.10170034' }],
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
    title: 'Age & Gender Estimation in Videos',
    tags: ['ML', 'Computer Vision'],
    stack: ['Python', 'YOLOv10', 'VGG-Face', 'AgeNet'],
    summary:
      'Demographic insights from video: a two-stream heterogeneous neural network that estimates age and gender from detected faces, reaching 95.5% average accuracy with a smaller model.',
    points: [
      'Coarse-to-fine strategy with multi-stage prediction for age and gender estimation from facial images captured in videos.',
      'Pre-trained YOLOv10 face detection combined with VGG-Face and AgeNet alongside the core architecture for robustness.',
    ],
    links: [],
  },
  {
    title: 'Used Car Sales Potential Prediction',
    tags: ['ML', 'Data'],
    stack: ['Python', 'scikit-learn', 'XGBoost', 'Pandas'],
    summary:
      'Predictive model for the sales potential of used cars using an MLP and ensembles (XGBoost, Random Forest) with hyperparameter tuning — 93.2% accuracy.',
    points: [
      'StratifiedKFold cross-validation for robust evaluation and to prevent overfitting.',
      'Statistical hypothesis testing to confirm or refute commonly held claims and myths about used-car sales.',
    ],
    links: [],
  },
  {
    title: 'Pharmacy Management System',
    tags: ['Backend', 'Databases'],
    stack: ['Python', 'PostgreSQL', 'psycopg2', 'Tkinter'],
    summary:
      'Desktop app for inventory control, prescription tracking and billing, with role-based access and CRUD over patient, employee and medicine records.',
    points: [
      'psycopg2 integration with transaction management for data consistency.',
      'Real-time mapping of UI actions to database operations for reliable persistence.',
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
    tags: ['Web', 'Backend', 'Data'],
    stack: ['React', 'Go', 'MongoDB', 'Airflow'],
    summary:
      'End-to-end portal for tracking app events and flagging abnormal counts and unusual user interactions, with automated alerts on configurable Airflow DAG schedules.',
    links: [],
  },
];

const PUBLICATIONS = [
  {
    authors: 'R. KS, M. P, Y. S. Kanchan, P. MR, and R. Ravish',
    title: 'Detection of Violent Content in Videos using Audio Visual Features',
    venue:
      '2023 International Conference on Advances in Electronics, Communication, Computing and Intelligent Information Systems (ICAECIS), Bangalore, India, pp. 600–605',
    doi: '10.1109/ICAECIS58353.2023.10170034',
    note: '2nd Best Paper Award',
  },
];

const AWARDS = [
  { icon: '🏆', title: '2nd Best Paper Award', detail: 'IEEE ICAECIS 2023 — among 1,300+ papers from authors in 30+ countries.' },
  { icon: '🎓', title: 'MRD Scholarship ×4', detail: 'PES University, 2019–2023 — 40% tuition for ranking in the top 20% of a 1,000+ student cohort.' },
  { icon: '💯', title: 'GRE Quant 170 / 170', detail: 'Perfect score in Quantitative Reasoning.' },
  { icon: '📈', title: 'CAT 99.68 percentile', detail: 'Data Interpretation & Logical Reasoning (98.79 percentile in Quantitative Ability) among 300,000+ candidates.' },
  { icon: '🥇', title: '5 Gold & 2 Bronze', detail: 'SilverZone and SOF International Mathematics Olympiads (school level).' },
];

const SKILLS = [
  { group: 'Languages', icon: '⌨', items: ['Python', 'C', 'C++', 'Java', 'Go', 'Rust', 'JavaScript', 'SQL', 'MATLAB', 'R', 'HTML/CSS'] },
  { group: 'ML / Data', icon: '◈', items: ['PyTorch', 'TensorFlow/Keras', 'scikit-learn', 'XGBoost', 'OpenCV', 'NumPy', 'Pandas', 'SciPy', 'statsmodels', 'Matplotlib', 'Spark', 'Airflow'] },
  { group: 'LLMs / NLP', icon: '✦', items: ['LangChain', 'RAG', 'Fine-tuning (LoRA/QLoRA)', 'BERT', 'Tokenization', 'Prompt Engineering'] },
  { group: 'Web / Backend', icon: '⟨⟩', items: ['React', 'Node.js', 'FastAPI', 'Flask', 'Django', 'Gin', 'Tkinter'] },
  { group: 'Infrastructure', icon: '⧉', items: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Kafka', 'RabbitMQ', 'Redis', 'Elasticsearch', 'Kibana', 'Grafana', 'Jaeger', 'Splunk', 'GoCD', 'Git', 'Linux/Unix'] },
  { group: 'Databases', icon: '⛁', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'] },
];

const TYPED_WORDS = ['intelligent systems', 'computer vision models', 'reliable backends', 'data pipelines'];
