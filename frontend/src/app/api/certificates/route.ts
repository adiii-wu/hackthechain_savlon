import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { candidateId, certName, issuer } = body;

    if (!candidateId || !certName) {
      return NextResponse.json({ error: 'Missing candidateId or certName' }, { status: 400 });
    }

    // Generate a mock IPFS hash and SBT ID
    const randomHex = () => Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const ipfsHash = `Qm${randomHex().toUpperCase()}...${randomHex()}`;
    const sbtId = `#SBT-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toISOString().split('T')[0];

    // Create the new certificate record
    const newCert = {
      id: `cert_${Date.now()}`,
      name: certName,
      issuer: issuer || 'External Provider',
      date,
      ipfsHash,
      sbtId,
      verified: true
    };

    // Determine an assigned exam based on the certificate content
    let examName = 'General Engineering Competency Exam';
    if (certName.toLowerCase().includes('react') || certName.toLowerCase().includes('frontend')) examName = 'Advanced Frontend Architecture Assessment';
    else if (certName.toLowerCase().includes('aws') || certName.toLowerCase().includes('cloud')) examName = 'Cloud Infrastructure & DevOps Exam';
    else if (certName.toLowerCase().includes('ai') || certName.toLowerCase().includes('machine learning')) examName = 'Applied AI & ML Deployment Exam';
    else if (certName.toLowerCase().includes('blockchain') || certName.toLowerCase().includes('web3')) examName = 'Smart Contract Security Assessment';

    // Create a new pending assignment for Sentinel
    const newExam = {
      id: `ass_${Date.now()}`,
      name: examName,
      score: 0,
      maxScore: 100,
      proctorScore: 0,
      date: 'Pending',
      duration: '45 min' 
    };

    // Note: In a real app we would save to a database here.
    // For this prototype, we return the parsed objects back to the client to update local state.
    
    // Simulate network delay for the AI proctor processing
    await new Promise(r => setTimeout(r, 1500));

    return NextResponse.json({ 
      success: true, 
      certificate: newCert, 
      assignedExam: newExam 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
