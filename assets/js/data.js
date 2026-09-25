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
 *
 * Writing style for all text: short plain sentences, no em dashes, colons or semicolons.
 */

const CASE_STUDIES = [
  {
    id: 'violence-detection',
    kicker: 'Research · Deep learning · 2023',
    title: 'Detection of Violent Content in Videos using Audio Visual Features',
    badge: '2nd Best Paper Award at the 2023 IEEE ICAECIS',
    pitch:
      'A two stage audio visual model that flags violent video clips. A small audio CNN checks every clip first and a much heavier 3D convolutional video model runs only when the audio model does not find violence.',
    problem:
      'Running a video network on every single clip is expensive. Many violent scenes can be recognised from their sound alone. So the idea was to keep accuracy high without running the costly video model on every clip.',
    approach: [
      {
        head: 'Data pipeline that fits in memory',
        body: 'FFmpeg extracts lossless WAV audio from the MP4 and AVI files. The video is cut into 16 frame chunks resized to 112×112. Both are saved as NumPy memory maps so training streams all 15,648 chunks from disk instead of keeping them in RAM.',
      },
      {
        head: 'Audio model',
        body: 'The audio is converted into STFT spectrograms and passed to a 7 layer CNN with 7,849,249 parameters. Every convolution block uses batch normalisation, dropout and L1/L2 regularisation because the training set has only 938 samples.',
      },
      {
        head: 'Video model',
        body: 'C3D pretrained on Sports-1M is used as a frozen feature extractor. Only a dense head with 4.7M parameters is trained. That is 51% fewer trainable parameters than ConvLSTM (9.6M) and 36% fewer than EfficientNet (7.4M) with similar accuracy.',
      },
      {
        head: 'Cascade and evaluation',
        body: 'If the audio model predicts violence the pipeline stops there. The C3D model runs only on clips that the audio model marks as non violent. The whole system was tested with stratified shuffle split cross validation on four benchmark datasets. These are Violent Flows, Movies, Hockey Fights and RLVS.',
      },
    ],
    results: [
      { value: '96.53%', label: 'average accuracy across 4 benchmark datasets' },
      { value: '4.7M', label: 'trainable parameters in the video head compared to 9.6M for ConvLSTM' },
      { value: '2nd', label: 'Best Paper out of 1,300+ papers at the 2023 IEEE ICAECIS' },
    ],
    diagram: 'violence',
    stack: ['Python', 'TensorFlow / Keras', 'OpenCV', 'NumPy', 'FFmpeg'],
    links: [
      { label: 'Read the paper on IEEE Xplore', url: 'https://doi.org/10.1109/ICAECIS58353.2023.10170034' },
      { label: 'Publication details', url: '#research' },
      { label: 'View code on GitHub', url: 'https://github.com/Mayuravarsha/CAPSTONE' },
    ],
  },
  {
    id: 'ride-matching',
    kicker: 'Distributed systems',
    title: 'A ride matching backend that never loses a request',
    pitch:
      'A containerised ride hailing backend. Matching and saving to the database run on separate RabbitMQ queues. So a slow database write never delays a match and a crashed worker never drops a ride.',
    problem:
      'When a backend matches rides and saves them in the same request, every slow database write adds delay to matching. And if a worker crashes in the middle of a match that rider is left waiting with no reply.',
    approach: [
      {
        head: 'Publish to two queues',
        body: 'A Flask producer sends every ride request to two queues. The work queue feeds matching workers that can be scaled out horizontally. The persistence queue feeds a MongoDB writer. Both paths share the same request ID so they can be matched later.',
      },
      {
        head: 'At least once delivery',
        body: 'All messages are persistent and a worker sends the acknowledgement only after the work is complete. Each worker takes just one message at a time (prefetch of 1). So if a worker dies in the middle RabbitMQ gives that ride to another worker.',
      },
    ],
    guarantees: [
      'Matching speed is not affected by database writes',
      'Matching workers scale horizontally',
      'Rides in progress survive worker crashes',
      'Fully containerised with Docker',
    ],
    diagram: 'rides',
    stack: ['Python', 'Flask', 'RabbitMQ', 'MongoDB', 'Docker'],
    links: [],
  },
];

const PROJECTS = [
  {
    title: 'Age and gender estimation in videos',
    kicker: 'Computer vision',
    summary:
      'Estimates age and gender from faces in videos to get demographic insights. YOLOv10 finds the faces and a two stream network refines the prediction in multiple stages from coarse to fine. VGG-Face and AgeNet were added to make it more robust. It reached 95.5% average accuracy with a smaller model.',
    stack: ['Python', 'YOLOv10', 'VGG-Face', 'AgeNet'],
    links: [],
  },
  {
    title: 'Customer onboarding and payment flows',
    kicker: 'Front end · IDFC First Bank',
    summary:
      'Rebuilt the customer acquisition journeys and payment screens of the bank in React. Made new screens and components and connected them to backend APIs. New customers onboarded went up by 12%.',
    stack: ['React', 'JavaScript', 'REST APIs'],
    links: [],
  },
  {
    title: 'Event anomaly detection portal',
    kicker: 'Full stack · IDFC First Bank',
    summary:
      'A portal to track app events and catch unusual user behaviour. Airflow DAGs send email alerts when event counts look abnormal. Teams can set the schedule to hourly, daily, weekly or monthly.',
    stack: ['React', 'Go', 'MongoDB', 'Airflow'],
    links: [],
  },
  {
    title: 'Splunk connector for a log monitoring agent',
    kicker: 'Backend · CanyonTechs AI',
    summary:
      'Two way Splunk support for a production agent written in Go. The agent can read logs from Splunk and send the incidents it detects back to the Splunk HTTP Event Collector. TLS is configurable and failures never block the agent.',
    stack: ['Go', 'Splunk HEC', 'TLS'],
    links: [],
  },
  {
    title: 'Used car price prediction',
    kicker: 'Machine learning',
    summary:
      'Predicts the asking price of a used car from 426k Craigslist listings. Removing placeholder prices and re-posted cars mattered as much as the model choice. LightGBM with native categorical features reached R² 0.85 on log price with a 13% median error. That beats ridge regression, random forest and a make and year baseline.',
    stack: ['Python', 'LightGBM', 'scikit-learn', 'Pandas'],
    links: [{ label: 'View code', url: 'https://github.com/Mayuravarsha/Data-Analytics' }],
  },
  {
    title: 'Pharmacy management system',
    kicker: 'Desktop app · Databases',
    summary:
      'A Tkinter app for a chain of pharmacies on PostgreSQL. Billing runs in a PL/pgSQL function that locks the stock row so two tills can never sell the same last units. Employees and admins log in with their own database roles and column level grants hide salaries. 21 tests run against a real database.',
    stack: ['Python', 'PostgreSQL', 'PL/pgSQL', 'Tkinter'],
    links: [{ label: 'View code', url: 'https://github.com/Mayuravarsha/Pharmacy-management-system' }],
  },
  {
    title: 'Night vision enhancement with IR and visible fusion',
    kicker: 'Computer vision',
    summary:
      'Fuses thermal and low light camera images with a wavelet transform and gives the result natural daytime colours. A SIFT search finds the most similar daylight photo and its colour statistics are transferred in Lab space. Built in MATLAB with a tested Python port. On 23 TNO scenes the fused images have about twice the edge detail of the visible frames.',
    stack: ['MATLAB', 'Python', 'OpenCV', 'PyWavelets'],
    links: [{ label: 'View code', url: 'https://github.com/Mayuravarsha/IPCV' }],
  },
  {
    title: 'Wordle with an information theory solver',
    kicker: 'Algorithms',
    summary:
      'A terminal Wordle game with hard mode and a helper for the daily puzzle. The solver picks the guess that is expected to give the most information. All 11 million guess and answer patterns are precomputed with NumPy. It solves every word in its list in 3.23 guesses on average.',
    stack: ['Python', 'NumPy'],
    links: [{ label: 'View code', url: 'https://github.com/Mayuravarsha/Wordle' }],
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
    pages: '600-605',
    year: 2023,
    doi: '10.1109/ICAECIS58353.2023.10170034',
    award: '2nd Best Paper Award out of 1,300+ papers from authors in 30+ countries',
    role: 'Co-author and presenter. I built the data pipeline and the audio and video models and designed the cascaded inference.',
    caseStudy: '#violence-detection',
  },
];

const EXPERIENCE = [
  {
    company: 'CanyonTechs AI',
    role: 'AI Engineer Intern',
    period: 'Jun 2026 - Aug 2026',
    location: 'San Ramon, CA · Remote',
    intro: 'Worked on a production log monitoring agent written in Go that finds incidents in application logs.',
    highlights: [
      {
        tag: 'Splunk',
        text: 'Added two way Splunk support so the agent can pull logs from Splunk and push the incidents it finds to a Splunk HTTP Event Collector with configurable TLS.',
      },
      {
        tag: 'Rust',
        text: "Extended the log parser to understand the output of Rust's tracing crate so it now catches structured errors it used to miss.",
      },
      {
        tag: 'Full stack',
        text: 'Built an in-app contact form with React and FastAPI that automatically opens confidential GitLab issues.',
      },
    ],
  },
  {
    company: 'Penn State University',
    role: 'Graduate Teaching Assistant',
    period: 'Aug 2026 - May 2027',
    location: 'University Park, PA',
    intro: 'Teaching assistant for CMPSC 360 (Discrete Mathematics).',
    highlights: [],
  },
  {
    company: 'Penn State University',
    role: 'Learning Assistant',
    period: 'Jan 2026 - May 2026',
    location: 'University Park, PA',
    intro: 'Learning Assistant for CMPSC 200 (Programming for Engineers with MATLAB).',
    highlights: [
      {
        tag: 'MATLAB',
        text: 'Helped students with algorithm development, control structures and numerical methods in MATLAB through guided problem solving. Also evaluated assessments and gave feedback.',
      },
    ],
  },
  {
    company: 'IDFC First Bank',
    role: 'Application Engineer',
    period: 'Jul 2023 - Jul 2025',
    location: 'Bengaluru, India',
    intro: 'Built customer facing features and internal tools for the mobile and web apps of the bank.',
    highlights: [
      {
        tag: '$6M',
        text: 'Integrated CleverTap analytics across the mobile and web apps to find where users drop off. The targeted campaigns that followed brought in $6M of extra revenue and 10% higher engagement.',
      },
      {
        tag: 'Payments',
        text: 'Built a fault tolerant Go microservice for utility bill autopay on the Bharat Bill Payment System (BBPS). It was designed to handle 1,200 transactions per second.',
      },
      {
        tag: 'Monitoring',
        text: 'Built an anomaly detection portal with React, Go and MongoDB with scheduled email alerts using Airflow.',
      },
    ],
  },
  {
    company: 'IDFC First Bank',
    role: 'Application Engineer Intern',
    period: 'Feb 2023 - Jun 2023',
    location: 'Bengaluru, India',
    intro: 'Worked on the customer acquisition and payment journeys of the bank.',
    highlights: [
      {
        tag: 'Front end',
        text: 'Rebuilt customer onboarding and payment flows in React. New customers onboarded went up by 12% in the following quarter.',
      },
    ],
  },
];

const TOOLBOX = [
  { group: 'Languages', items: ['Python', 'Go', 'JavaScript', 'C++', 'Rust', 'Java', 'SQL'] },
  { group: 'Front end', items: ['React', 'HTML', 'CSS', 'Node.js', 'Responsive UI', 'Web performance'] },
  { group: 'Machine learning', items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas'] },
  { group: 'Backend and systems', items: ['FastAPI', 'Flask', 'Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'Redis', 'Airflow', 'Splunk', 'AWS', 'GCP'] },
  { group: 'Databases', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Elasticsearch'] },
];

const TYPED_WORDS = ['models that see and hear', 'clean and fast web apps', 'backends that do not drop messages', 'data pipelines'];
