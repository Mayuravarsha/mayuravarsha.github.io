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
    id: 'lob-market-making',
    kicker: 'Quant · Low latency C++',
    title: 'Limit order book and market making backtester',
    pitch:
      'A price time priority limit order book written in C++17 and exposed to Python with pybind11. An event driven backtester runs a market making strategy on top of it and splits the profit per share into where it actually came from.',
    problem:
      'A market making strategy looks profitable on paper until you model where your quote sits in the queue and how often you get picked off. That needs an order book fast enough to replay hundreds of thousands of events and correct enough to trust every fill.',
    approach: [
      {
        head: 'Order book core',
        body: 'Orders at each price wait in an intrusive FIFO list and come from a pool allocator. So adding, cancelling and matching orders never allocates memory on the hot path. A typical add order takes about 74 nanoseconds. Pre-faulting the pool memory cut the p99 add order latency from about 2.7 to 0.42 microseconds.',
      },
      {
        head: 'Proving it is correct',
        body: '81 unit tests, a fuzzer that checks the book invariants over 200,000 random operations and a differential test against a separate order book written in Python. The two engines agreed on every one of 200,000 events.',
      },
      {
        head: 'Python bindings',
        body: 'pybind11 exposes the engine to Python. A batched path that sends many events in one call runs about 10 times faster than calling the engine once per event.',
      },
      {
        head: 'Realistic backtest',
        body: 'The backtester tracks the queue position of every resting quote, so a quote is filled only after the orders ahead of it are gone. Over 400,000 events of simulated market flow the strategy got 24,505 fills. Profit per share is split into spread captured, adverse selection and the maker rebate.',
      },
    ],
    results: [
      { value: '2.9M', label: 'events per second through the C++ order book on a 4 core cloud machine' },
      { value: '0', label: 'mismatches against an independent Python engine over 200K events' },
      { value: '+0.55¢', label: 'net per share from +1.40¢ spread capture, −1.05¢ adverse selection and a +0.20¢ rebate' },
    ],
    diagram: 'lob',
    stack: ['C++17', 'pybind11', 'Python', 'CMake'],
    links: [{ label: 'View code on GitHub', url: 'https://github.com/Mayuravarsha/lob-market-making' }],
  },
  {
    id: 'options-vol-engine',
    kicker: 'Quant · Derivatives pricing',
    title: 'Options pricing and volatility engine',
    pitch:
      'An options library built from scratch in Python. It prices options and their Greeks, solves for implied volatility, fits arbitrage checked volatility surfaces to SPY, AAPL and TSLA option chains and forecasts volatility with GARCH.',
    problem:
      'Market option prices are noisy and quoted in ticks, so a surface fitted without care can allow arbitrage. And a pricer is only useful if its Greeks and its Monte Carlo error can be trusted.',
    approach: [
      {
        head: 'Pricing and Greeks',
        body: 'Black-Scholes prices and Greeks with implied volatility solved by Newton and Brent root finders. 263 automated checks cover put call parity and compare every Greek with a finite difference estimate.',
      },
      {
        head: 'Volatility surfaces',
        body: 'SVI smiles are fitted to SPY, AAPL and TSLA chains and checked for butterfly arbitrage (Durrleman condition) and calendar arbitrage. On a test surface built from known parameters with added noise and tick rounding the fit recovered the true volatilities with an average error of 0.39 vol points.',
      },
      {
        head: 'Monte Carlo',
        body: 'Asian options are priced by Monte Carlo with the closed form geometric Asian price as a control variate. That cuts the variance of the estimate by 671 times.',
      },
      {
        head: 'Volatility forecasting',
        body: 'A GJR-GARCH model forecasts volatility over 2,500 out of sample days and beats a constant volatility forecast by 11.3% on QLIKE loss. Comparing implied with forecast volatility shows a variance risk premium of about 1 vol point.',
      },
    ],
    results: [
      { value: '671x', label: 'variance reduction for Asian options with a control variate' },
      { value: '0.39', label: 'vol points average error recovering a known surface from noisy tick rounded quotes' },
      { value: '11.3%', label: 'better volatility forecasts than constant volatility on QLIKE loss' },
    ],
    diagram: 'options',
    stack: ['Python', 'NumPy', 'SciPy'],
    links: [{ label: 'View code on GitHub', url: 'https://github.com/Mayuravarsha/options-vol-engine' }],
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
      'Redelivered rides never create duplicate records',
    ],
    diagram: 'rides',
    stack: ['Python', 'Flask', 'RabbitMQ', 'MongoDB', 'Docker'],
    links: [{ label: 'View code on GitHub', url: 'https://github.com/Mayuravarsha/ride-matching-rabbitmq' }],
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
  { group: 'Machine learning', items: ['PyTorch', 'TensorFlow / Keras', 'scikit-learn', 'OpenCV', 'NumPy', 'Pandas', 'SciPy'] },
  { group: 'Quant', items: ['Order books', 'Market making', 'Options and Greeks', 'Volatility surfaces', 'Monte Carlo', 'GARCH'] },
  { group: 'Backend and systems', items: ['FastAPI', 'Flask', 'Docker', 'Kubernetes', 'RabbitMQ', 'Kafka', 'Redis', 'Airflow', 'Splunk', 'AWS', 'GCP', 'pybind11', 'CMake'] },
  { group: 'Databases', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Elasticsearch'] },
];

const TYPED_WORDS = ['models that see and hear', 'fast order books in C++', 'volatility models', 'backends that do not drop messages', 'clean and fast web apps'];
