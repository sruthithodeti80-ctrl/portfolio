// Portfolio content data model for Thodeti Sruthi
window.portfolioData = {
  profile: {
    name: "Thodeti Sruthi",
    title: "Computer Science Engineer & AI Enthusiast",
    email: "sruthithodeti80@gmail.com",
    phone: "9059745576",
    address: "Vijayawada, India",
    dob: "22-10-2005",
    nationality: "Indian",
    github: "#", // Placeholder for actual link if any
    linkedin: "#",
    tagline: "Building intelligent systems and responsive web experiences with data-driven AI models.",
    about: "I am a passionate Computer Science Engineering student currently pursuing B.Tech at Velagapudi Ramakrishna Siddhartha Engineering College. I have a strong foundation in programming, software engineering, and artificial intelligence, with hands-on experience building smart systems. I enjoy creating responsive layouts and integrating machine learning concepts to solve real-world problems. Always eager to learn, adapt, and build impactful technology solutions."
  },
  
  internships: [
    {
      role: "Virtual Internship",
      company: "Infosys Springboard",
      duration: "10/2025 - 12/2025",
      points: [
        "Completed virtual internship focused on software development and industry best practices.",
        "Gained hands-on experience in problem solving, clean coding guidelines, and application design.",
        "Enhanced core skills in programming logic, debugging, and implementing optimal algorithmic solutions."
      ]
    }
  ],
  
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) - Computer Science Engineering",
      institution: "Velagapudi Ramakrishna Siddhartha Engineering College",
      duration: "01/2023 - Present",
      location: "Vijayawada, India",
      metricType: "CGPA",
      metricValue: "8.92/10"
    },
    {
      degree: "Intermediate Education (MPC)",
      institution: "Narayana Junior College",
      duration: "Completed 2023",
      location: "India",
      metricType: "Percentage",
      metricValue: "95.3%"
    }
  ],
  
  skills: {
    languages: [
      { name: "C", level: 90, icon: "fa-solid fa-code" },
      { name: "Java", level: 85, icon: "fa-brands fa-java" },
      { name: "Python", level: 92, icon: "fa-brands fa-python" },
      { name: "JavaScript", level: 88, icon: "fa-brands fa-js" },
      { name: "HTML & CSS", level: 90, icon: "fa-brands fa-html5" },
      { name: "Node.js", level: 80, icon: "fa-brands fa-node-js" },
      { name: "Express.js", level: 78, icon: "fa-solid fa-server" }
    ],
    databases: [
      { name: "SQL & MySQL", level: 85, icon: "fa-solid fa-database" },
      { name: "MongoDB", level: 80, icon: "fa-solid fa-leaf" }
    ],
    coursework: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Object Oriented Programming",
      "Database Management System",
      "Software Engineering",
      "Artificial Intelligence"
    ],
    softSkills: [
      { name: "Analytical Thinking", icon: "fa-solid fa-brain" },
      { name: "Problem Solving", icon: "fa-solid fa-lightbulb" },
      { name: "Teamwork", icon: "fa-solid fa-users" },
      { name: "Leadership", icon: "fa-solid fa-crown" },
      { name: "Time Management", icon: "fa-solid fa-hourglass-half" },
      { name: "Adaptability", icon: "fa-solid fa-arrows-spin" }
    ]
  },
  
  projects: [
    {
      id: "smart-nursery",
      title: "Smart Nursery Monitoring System",
      category: "AI & IoT",
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenCV", "Flutter", "Firebase", "SQL", "CNN", "QR Code System"],
      summary: "An end-to-end AI-based smart nursery system for real-time plant health monitoring using leaf image analysis, QR tracking, and a cloud database.",
      details: [
        "Built a complete Flutter mobile application integrated with a Firebase database for tracking plant health history and inventory.",
        "Deployed a Deep Learning Convolutional Neural Network (CNN) to detect plant diseases from leaf photos with high accuracy.",
        "Created QR code tags for easy plant identification, enabling instant info lookups and automated maintenance reminders."
      ]
    },
    {
      id: "lost-found",
      title: "Lost and Found Management System",
      category: "Web Development",
      technologies: ["HTML", "CSS", "JavaScript", "Node.js & Express", "SQL Database", "Notification System"],
      summary: "A web-based campus portal that allows students, faculty, and staff to report lost items, view found items, and get match notifications.",
      details: [
        "Created an intuitive client dashboard to submit reports of missing or found items with images and descriptions.",
        "Designed and implemented a match-making algorithm that checks key-value descriptors of items and automatically generates notifications.",
        "Greatly reduced item recovery times on campus by centralizing report logs into a single, responsive directory."
      ]
    },
    {
      id: "content-optimizer",
      title: "AI Automated Content Marketing Optimizer",
      category: "AI & LLM",
      technologies: ["Python", "LLMs (LLaMA-3.1)", "Hugging Face", "Pandas", "Slack API", "Google Sheets API", "REST APIs"],
      summary: "An AI platform automating content generation, sentiment analysis, performance logging, and A/B campaign testing.",
      details: [
        "Leveraged LLaMA-3.1 API and Hugging Face pipelines to generate customized target audience copywriting and sentiment evaluations.",
        "Integrated real-time campaign logging with Google Sheets and automated alerts to Slack workspace for immediate metrics tracking.",
        "Built dynamic scripts for evaluating content variants using statistical indicators to optimize marketing distribution."
      ]
    }
  ],
  
  certificates: [
    { name: "Cisco - Programming Essentials in C", issuer: "Cisco Networking Academy" },
    { name: "Cisco - Python Essentials", issuer: "Cisco Networking Academy" },
    { name: "Cisco - Introduction to Cybersecurity", issuer: "Cisco Networking Academy" },
    { name: "Cisco - Introduction to Modern AI", issuer: "Cisco Networking Academy" },
    { name: "edX - Python Basics for Data Science", issuer: "edX / IBM" },
    { name: "UiPath Academy - Automation Explorer Certification", issuer: "UiPath" },
    { name: "AWS Academy - Cloud Foundations", issuer: "Amazon Web Services" },
    { name: "AWS Academy - Cloud Practitioner", issuer: "Amazon Web Services" },
    { name: "NPTEL - Foundations of R Software", issuer: "NPTEL / IIT" },
    { name: "NPTEL - Privacy and Security in Online Social Media", issuer: "NPTEL" },
    { name: "Coursera - Copilot for Power BI", issuer: "Coursera" },
    { name: "Postman - API Fundamentals Student Expert", issuer: "Postman" }
  ],
  
  extracurricular: [
    {
      role: "NSS Volunteer",
      organization: "National Service Scheme",
      duration: "July 2024 - Present",
      location: "Vijayawada, India",
      description: "Active volunteer coordinating blood donation camps, local flood relief actions, community plastic collection drives, and social awareness campaigns."
    }
  ]
};
