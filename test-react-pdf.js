// Test React PDF API endpoint - Updated Test
const testData = {
  resumeData: {
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234-567-8900",
      location: "New York, NY",
      title: "Software Developer"
    },
    professionalSummary: "Experienced software developer with 5+ years of experience building web applications using React, Node.js, and modern technologies. Passionate about creating efficient and scalable solutions.",
    workExperience: [
      {
        company: "Tech Corp Inc.",
        position: "Senior Software Developer",
        startDate: "Jan 2020",
        endDate: "Present",
        description: "Lead development of web applications using React and Node.js. Mentored junior developers and implemented CI/CD pipelines.",
        responsibilities: [
          "Built and maintained scalable web applications",
          "Mentored junior developers",
          "Implemented CI/CD pipelines"
        ]
      },
      {
        company: "StartupXYZ",
        position: "Full Stack Developer",
        startDate: "Jun 2018",
        endDate: "Dec 2019",
        description: "Developed full-stack applications using MERN stack. Collaborated with design team to implement responsive UI components."
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        startDate: "Sep 2016",
        endDate: "May 2020",
        gpa: "3.8"
      }
    ],
    skills: {
      technical: ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "MongoDB", "AWS"],
      soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
      languages: ["English (Native)", "Spanish (Intermediate)", "French (Basic)"]
    },
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with payment integration using Stripe API",
        technologies: ["React", "Node.js", "Stripe", "MongoDB", "Redis"],
        link: "https://example-shop.com",
        github: "https://github.com/johndoe/ecommerce"
      },
      {
        name: "Task Management App",
        description: "Developed a collaborative task management application with real-time updates",
        technologies: ["Vue.js", "Express.js", "Socket.io", "PostgreSQL"],
        github: "https://github.com/johndoe/taskapp"
      }
    ],
    certifications: [
      {
        name: "AWS Certified Developer Associate",
        issuer: "Amazon Web Services",
        date: "Jun 2023",
        url: "https://aws.amazon.com/certification/"
      },
      {
        name: "React Professional Certification",
        issuer: "Meta",
        date: "Mar 2023",
        url: "https://developers.facebook.com/certification/"
      }
    ]
  },
  filename: "john-doe-resume"
};

console.log('🔄 Testing React PDF generation...');
console.log('📋 Test data prepared:', testData.resumeData.personalInfo.fullName);

fetch('http://localhost:3000/api/generate-pdf-react', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('📡 Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
  
  if (response.ok) {
    return response.blob();
  }
  
  return response.text().then(text => {
    console.error('❌ Server error response:', text);
    throw new Error(`HTTP ${response.status}: ${text}`);
  });
})
.then(blob => {
  console.log('✅ React PDF generated successfully!');
  console.log(`📄 PDF size: ${blob.size} bytes`);
  console.log(`📋 PDF type: ${blob.type}`);
  
  if (blob.size === 0) {
    console.error('⚠️ PDF is empty (0 bytes)!');
    return;
  }
  
  // Save the file for manual inspection
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'test-react-pdf-resume.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  console.log('💾 PDF downloaded as test-react-pdf-resume.pdf');
  console.log('🔍 Check the downloaded file to verify content appears correctly');
})
.catch(error => {
  console.error('❌ React PDF generation failed:', error);
  console.log('🔧 Check the server console for detailed error messages');
});