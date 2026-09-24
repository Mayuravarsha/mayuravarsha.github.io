/*
 * All site content lives here so it can be updated without touching layout code.
 *
 * CASE_STUDIES - the large, in-depth project write-ups at the top of the page.
 *   kicker     - small label above the title, e.g. "Research · 2023"
 *   badge      - optional highlight ribbon
 *   pitch      - one or two sentences on what it is
 *   problem    - why it was worth building
 *   approach   - list of { head, body } steps
 *   results    - list of { value, label } big numbers, or omit and use `guarantees`
 *   guarantees - list of short strings shown as a checklist
 *   diagram    - key into DIAGRAMS (assets/js/diagrams.js), optional
 *   stack, links ({ label, url })
 *
 * PROJECTS - smaller cards under "More projects". Copy an entry to add one:
 *   { title, kicker, summary, stack: [], links: [] }
 */

const CASE_STUDIES = [
  {
    id: 'violence-detection',
    kicker: 'Research · Deep learning · 2023',
    title: 'Spotting violence in video by listening first',
    badge: '2nd Best Paper, 2023 IEEE ICAECIS',
    pitch:
      'A two-stage audio-visual classifier that flags violent video clips. A small audio CNN screens every clip, and a much heavier 3D-convolutional video model only runs on the clips the audio model lets through.',
    problem:
      'Running a spatiotemporal video network on every clip is expensive, and many violent scenes can already be recognized from their sound alone. The goal was to keep accuracy high without paying the cost of the video model on every clip.',
    approach: [
      {
        head: 'Data pipeline that fits in memory',
        body: 'FFmpeg extracts lossless WAV audio from MP4 and AVI files. Video is cut into 16-frame chunks resized to 112×112. Both are stored as NumPy memory maps, so training streams 15,648 chunks from disk instead of holding them in RAM.',
      },
      {
        head: 'Audio model',
        body: 'Waveforms are converted to STFT spectrograms and fed to a 7-layer CNN (7,849,249 parameters). Every convolutional block uses batch norm, dropout and L1/L2 regularization, because the training set has only 938 samples.',
      },
      {
        head: 'Video model',
        body: 'Transfer learning with C3D pretrained on Sports-1M, kept frozen as a spatiotemporal feature extractor. Only a 4.7M-parameter dense head is trained: 51% fewer trainable parameters than ConvLSTM (9.6M) and 36% fewer than EfficientNet (7.4M), at comparable accuracy.',
      },
      {
        head: 'Cascade + evaluation',
        body: 'Inference stops early as soon as the audio model predicts violence, so the C3D forward pass only runs on clips the audio model marks as non-violent. Evaluated with stratified shuffle-split cross-validation on four benchmarks: Violent Flows, Movies, Hockey Fights and RLVS.',
      },
    ],
    results: [
      { value: '96.53%', label: 'mean accuracy across 4 benchmark datasets' },
      { value: '4.7M', label: 'trainable params in the video head (vs 9.6M for ConvLSTM)' },
      { value: '2nd', label: 'Best Paper out of 1,300+ papers at the 2023 IEEE ICAECIS' },
    ],
    diagram: 'violence',
    stack: ['Python', 'TensorFlow / Keras', 'OpenCV', 'NumPy', 'FFmpeg'],
    links: [
      { label: 'Paper on IEEE Xplore', url: 'https://doi.org/10.1109/ICAECIS58353.2023.10170034' },
      { label: 'Publication details', url: '#research' },
    ],
  },
  {
    id: 'ride-matching',
    kicker: 'Distributed systems',
    title: 'A ride-matching backend where no request is lost',
    pitch:
      'A containerized ride-hailing backend. Matching and persistence run on separate RabbitMQ queues, so slow database writes never delay a match, and a crashed worker never drops a ride.',
    problem:
      'If a ride-hailing backend matches and stores requests in the same synchronous request path, every slow database write adds latency to matching. And if a worker dies partway through a match, that rider silently waits forever.',
    approach: [
      {
        head: 'Fan-out on publish',
        body: 'A Flask producer publishes every ride request to two queues: a work queue consumed by horizontally scaled matching workers, and a persistence queue consumed by a MongoDB writer. A shared request ID ties the two paths together.',
      },
      {
        head: 'At-least-once delivery',
        body: 'Messages are persistent, and workers only acknowledge a message after the work is done. Each worker has a prefetch limit of one message, so if a worker dies mid-match, RabbitMQ requeues that ride to another worker.',
      },
    ],
    guarantees: [
      'Match latency is decoupled from database writes',
      'Matching workers scale horizontally',
      'In-flight rides survive worker crashes',
      'Fully containerized with Docker',
    ],
    diagram: 'rides',
    stack: ['Python', 'Flask', 'RabbitMQ', 'MongoDB', 'Docker'],
    links: [],
  },
];

const PROJECTS = [
  {
    title: 'Age & gender estimation in video',
    kicker: 'Computer vision',
    summary:
      'Estimates age and gender for demographic insights from faces in video. YOLOv10 detects faces, and a two-stream heterogeneous network refines its predictions coarse-to-fine over several stages, with VGG-Face and AgeNet added for robustness. It reached 95.5% average accuracy with a smaller model.',
    stack: ['Python', 'YOLOv10', 'VGG-Face', 'AgeNet'],
    links: [],
  },
];

const PUBLICATIONS = [
  {
    title: 'Detection of Violent Content in Videos using Audio Visual Features',
    authors: ['R. KS', 'M. P', 'Y. S. Kanchan', 'P. MR', 'R. Ravish'],
    me: 'M. P',
    conference:
      '2023 International Conference on Advances in Electronics, Communication, Computing and Intelligent Information Systems (ICAECIS)',
    place: 'Bengaluru, India',
    publisher: 'IEEE',
    pages: '600–605',
    year: 2023,
    doi: '10.1109/ICAECIS58353.2023.10170034',
    award: '2nd Best Paper Award, out of 1,300+ papers from authors in 30+ countries',
    role: 'Co-author and presenter. Built the data pipeline and the audio and video models, and designed the cascaded inference.',
    caseStudy: '#violence-detection',
  },
];

const EXPERIENCE = [
  {
    company: 'Canyontechs AI',
    role: 'AI Engineer Intern',
    period: 'Jun – Aug 2026',
    location: 'San Ramon, CA · Remote',
    intro: 'Worked on a production log-monitoring agent written in Go that detects incidents in application logs.',
    highlights: [
      {
        tag: 'Splunk',
        text: 'Added two-way Splunk support: the agent can pull logs from Splunk as a source and push detected incidents to a Splunk HTTP Event Collector (HEC) endpoint, with configurable TLS and non-blocking failure handling.',
      },
      {
        tag: 'Rust',
        text: "Taught the multi-language log parser the output format of Rust's structured tracing crate, with regex triggers and context capture for structured errors it used to miss.",
      },
      {
        tag: 'Full-stack',
        text: 'Built an in-app contact form (React + FastAPI) that automatically opens confidential GitLab issues.',
      },
    ],
  },
  {
    company: 'IDFC First Bank',
    role: 'Application Engineer (joined as an intern)',
    period: 'Feb 2023 – Jul 2025',
    location: 'Bengaluru, India',
    intro: 'Built customer-facing features and internal tooling for the bank’s mobile and web apps.',
    highlights: [
      {
        tag: '$6M',
        text: 'Integrated CleverTap analytics across the mobile and web apps to find where users dropped off. The targeted campaigns that followed brought in $6M in additional revenue and a 10% rise in engagement.',
      },
      {
        tag: 'Payments',
        text: 'Architected a fault-tolerant Go microservice for utility-bill autopay on India’s Bharat Bill Payment System (BBPS), designed to handle 1,200 transactions per second.',
      },
      {
        tag: 'Monitoring',
        text: 'Built an anomaly-detection portal (React, Go, MongoDB) with Airflow-scheduled email alerts (hourly, daily, weekly or monthly) for abnormal event counts and unusual user behavior.',
      },
      {
        tag: '+12%',
        text: 'Rebuilt customer-acquisition and payment flows in React, which led to a 12% increase in new customers onboarded.',
      },
    ],
  },
  {
    company: 'Penn State University',
    role: 'Teaching',
    period: 'Jan 2026 – May 2027',
    location: 'University Park, PA',
    intro: '',
    highlights: [
      { tag: 'GTA', text: 'Graduate Teaching Assistant, CMPSC 360: Discrete Mathematics (Aug 2026 – May 2027).' },
      { tag: 'LA', text: 'Learning Assistant, CMPSC 200: Programming for Engineers with MATLAB (Jan – May 2026).' },
    ],
  },
];

const TOOLBOX = [
  { group: 'Languages', items: ['Python', 'Go', 'C++', 'Rust', 'Java', 'JavaScript', 'SQL'] },
  { group: 'Machine learning', items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas'] },
  { group: 'Systems', items: ['Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'Redis', 'Airflow', 'Splunk', 'AWS', 'GCP'] },
  { group: 'Web & data', items: ['React', 'FastAPI', 'Flask', 'PostgreSQL', 'MongoDB', 'Elasticsearch'] },
];

const TYPED_WORDS = ['models that see and hear', 'systems that don’t drop messages', 'data pipelines', 'backends that scale'];
