// Test React PDF API endpoint
const testData = {
  resumeData: {
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234-567-8900",
      location: "New York, NY",
      title: "Software Developer"
    },
    professionalSummary: "Experienced software developer with 5+ years of experience building web applications.",
    workExperience: [
      {
        company: "Tech Corp",
        position: "Senior Developer",
        startDate: "2020-01",
        endDate: "Present",
        description: "Lead development of web applications using React and Node.js",
        responsibilities: [
          "Built and maintained scalable web applications",
          "Mentored junior developers",
          "Implemented CI/CD pipelines"
        ]
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        startDate: "2016-09",
        endDate: "2020-05",
        gpa: "3.8"
      }
    ],
    skills: {
      technical: ["React", "Node.js", "TypeScript", "Python", "PostgreSQL"],
      soft: ["Leadership", "Communication", "Problem Solving"],
      languages: ["English (Native)", "Spanish (Intermediate)"]
    },
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with payment integration",
        technologies: ["React", "Node.js", "Stripe", "MongoDB"],
        link: "https://example-shop.com",
        github: "https://github.com/johndoe/ecommerce"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-06",
        url: "https://aws.amazon.com/certification/"
      }
    ]
  },
  filename: "test-resume"
};

fetch('http://localhost:3000/api/generate-pdf-react', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  if (response.ok) {
    return response.blob();
  }
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
})
.then(blob => {
  console.log('✅ React PDF generated successfully!');
  console.log(`📄 PDF size: ${blob.size} bytes`);
  console.log(`📋 PDF type: ${blob.type}`);
  
  // Save the file for manual inspection
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'test-react-pdf-resume.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
})
.catch(error => {
  console.error('❌ React PDF generation failed:', error);
});