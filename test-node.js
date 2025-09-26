const fetch = require('node-fetch');
const fs = require('fs');

const testData = {
  resumeData: {
    personalInfo: {
      fullName: "John Doe Test",
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
        startDate: "Jan 2020",
        endDate: "Present",
        description: "Lead development of web applications using React and Node.js"
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "Bachelor of Computer Science",
        startDate: "Sep 2016",
        endDate: "May 2020"
      }
    ],
    skills: {
      technical: ["React", "Node.js", "TypeScript", "Python"]
    }
  },
  filename: "test-resume"
};

console.log('🔄 Testing React PDF API...');

fetch('http://localhost:3000/api/generate-pdf-react', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData),
})
.then(response => {
  console.log('📡 Response status:', response.status);
  console.log('📡 Response type:', response.headers.get('content-type'));
  
  if (!response.ok) {
    return response.text().then(text => {
      console.error('❌ Server error:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    });
  }
  
  return response.buffer();
})
.then(buffer => {
  console.log('✅ PDF generated successfully!');
  console.log(`📄 PDF size: ${buffer.length} bytes`);
  
  if (buffer.length === 0) {
    console.error('⚠️ PDF is empty (0 bytes)!');
    return;
  }
  
  // Save to file
  fs.writeFileSync('test-output.pdf', buffer);
  console.log('💾 PDF saved as test-output.pdf');
  console.log('🔍 Open test-output.pdf to verify content');
})
.catch(error => {
  console.error('❌ Test failed:', error.message);
});