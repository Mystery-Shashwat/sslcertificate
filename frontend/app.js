// Contract ABI and address (you'll need to update these with your deployed contract details)
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const CONTRACT_ABI = []; // Add your contract ABI here

// IPFS configuration
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";
const IPFS_API_URL = "https://api.ipfs.io/api/v0";

// State management
let provider;
let signer;
let contract;
let currentNetwork;
let userAddress;

// Initialize loading modal
const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

// Show loading modal with custom message and progress
function showLoading(message = 'Processing...', progress = null) {
    const modalBody = document.querySelector('.modal-body');
    let progressHtml = '';
    
    if (progress !== null) {
        progressHtml = `
            <div class="progress mt-3" style="height: 4px;">
                <div class="progress-bar progress-bar-striped progress-bar-animated" 
                     role="progressbar" 
                     style="width: ${progress}%">
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="loading mb-4"></div>
        <h4 id="loadingMessage" class="mb-0">${message}</h4>
        <p class="text-secondary mt-2">Please wait while we process your request</p>
        ${progressHtml}
    `;
    
    loadingModal.show();
}

// Update loading progress
function updateLoadingProgress(progress) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

// Hide loading modal
function hideLoading() {
    loadingModal.hide();
}

// Initialize Web3 with network detection
async function initWeb3() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Request account access
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            
            // Get network information
            const network = await provider.getNetwork();
            currentNetwork = network.name;
            
            // Get user address
            userAddress = await signer.getAddress();
            
            // Initialize contract
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Update UI with network info
            updateNetworkInfo();
            
            console.log("Web3 initialized successfully");
        } else {
            throw new Error("Please install MetaMask to use this application!");
        }
    } catch (error) {
        console.error("Error initializing Web3:", error);
        showStatus('verificationStatus', error.message, 'error');
    }
}

// Update network information in UI
function updateNetworkInfo() {
    const networkBadge = document.createElement('div');
    networkBadge.className = 'mt-2';
    networkBadge.innerHTML = `
        <span class="badge bg-secondary me-2">
            <i class="fas fa-network-wired me-1"></i>${currentNetwork}
        </span>
        <span class="badge bg-primary">
            <i class="fas fa-wallet me-1"></i>${userAddress.slice(0, 6)}...${userAddress.slice(-4)}
        </span>
    `;
    
    const header = document.querySelector('.text-center');
    header.appendChild(networkBadge);
}

// Show status message with animation and auto-dismiss
function showStatus(elementId, message, type, duration = 5000) {
    const element = document.getElementById(elementId);
    element.className = `mt-4 ${type} animate__animated animate__fadeIn`;
    element.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
        ${message}
    `;
    
    // Auto-dismiss after duration
    setTimeout(() => {
        element.classList.add('animate__fadeOut');
        setTimeout(() => {
            element.innerHTML = '';
            element.className = '';
        }, 500);
    }, duration);
}

// Update results table with animation and sorting
function updateResultsTable(domain, address, status, ipfsHash) {
    const tbody = document.getElementById('resultsBody');
    const row = document.createElement('tr');
    row.className = 'animate__animated animate__fadeIn';
    
    // Format timestamp
    const timestamp = new Date().toLocaleString();
    
    row.innerHTML = `
        <td>
            <div class="d-flex align-items-center">
                <i class="fas fa-globe me-2"></i>
                <div>
                    <div>${domain}</div>
                    <small class="text-muted">${timestamp}</small>
                </div>
            </div>
        </td>
        <td>
            <div class="d-flex align-items-center">
                <i class="fas fa-wallet me-2"></i>
                <div>
                    <div>${address.slice(0, 6)}...${address.slice(-4)}</div>
                    <small class="text-muted">${currentNetwork}</small>
                </div>
            </div>
        </td>
        <td>
            <span class="badge ${status === 'Verified' ? 'bg-success' : 'bg-danger'}">
                <i class="fas ${status === 'Verified' ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                ${status}
            </span>
        </td>
        <td>
            ${ipfsHash ? `
                <div class="d-flex align-items-center">
                    <a href="${IPFS_GATEWAY}${ipfsHash}" target="_blank" class="text-primary me-2">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-primary" onclick="copyToClipboard('${IPFS_GATEWAY}${ipfsHash}')">
                        <i class="fas fa-copy"></i>
                    </button>
                </div>
            ` : '-'}
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
    
    // Add hover effect
    row.addEventListener('mouseenter', () => {
        row.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
    });
    
    row.addEventListener('mouseleave', () => {
        row.style.backgroundColor = '';
    });
}

// Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showStatus('verificationStatus', 'Copied to clipboard!', 'success', 2000);
    } catch (err) {
        showStatus('verificationStatus', 'Failed to copy text', 'error', 2000);
    }
}

// Verify SSL certificate with enhanced validation
async function verifyCertificate() {
    try {
        const domainName = document.getElementById('domainName').value;
        const certificateFile = document.getElementById('certificateFile').files[0];

        // Enhanced validation
        if (!domainName) {
            throw new Error('Please enter a domain name');
        }
        
        if (!isValidDomain(domainName)) {
            throw new Error('Please enter a valid domain name');
        }
        
        if (!certificateFile) {
            throw new Error('Please select a certificate file');
        }
        
        if (!isValidCertificateFile(certificateFile)) {
            throw new Error('Please select a valid certificate file (.pem or .crt)');
        }

        showLoading('Verifying SSL Certificate...', 0);

        // Read certificate file
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const certificate = event.target.result;
                updateLoadingProgress(30);
                
                // Connect to MetaMask
                if (!window.ethereum) {
                    throw new Error('Please install MetaMask to use this feature');
                }

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                updateLoadingProgress(60);

                // Parse certificate
                const parsedCert = parseCertificate(certificate);
                updateLoadingProgress(80);

                // Verify certificate
                const isVerified = await verifyCertificateOnChain(parsedCert);
                updateLoadingProgress(100);
                
                updateResultsTable(
                    domainName,
                    address,
                    isVerified ? 'Verified' : 'Not Verified',
                    null
                );

                showStatus(
                    'verificationStatus',
                    isVerified ? 'Certificate verified successfully!' : 'Certificate verification failed',
                    isVerified ? 'success' : 'error'
                );
            } catch (error) {
                showStatus('verificationStatus', error.message, 'error');
            } finally {
                hideLoading();
            }
        };

        reader.readAsText(certificateFile);
    } catch (error) {
        showStatus('verificationStatus', error.message, 'error');
        hideLoading();
    }
}

// Validate domain name
function isValidDomain(domain) {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
}

// Validate certificate file
function isValidCertificateFile(file) {
    const validTypes = ['application/x-x509-ca-cert', 'application/pkix-cert'];
    const validExtensions = ['.pem', '.crt'];
    
    return validTypes.includes(file.type) || 
           validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
}

// Parse certificate content
function parseCertificate(certificate) {
    // Basic certificate parsing
    const lines = certificate.split('\n');
    const certData = {
        subject: '',
        issuer: '',
        validFrom: '',
        validTo: '',
        serialNumber: ''
    };
    
    // Parse certificate data (simplified)
    lines.forEach(line => {
        if (line.includes('Subject:')) {
            certData.subject = line.split('Subject:')[1].trim();
        } else if (line.includes('Issuer:')) {
            certData.issuer = line.split('Issuer:')[1].trim();
        } else if (line.includes('Not Before:')) {
            certData.validFrom = line.split('Not Before:')[1].trim();
        } else if (line.includes('Not After:')) {
            certData.validTo = line.split('Not After:')[1].trim();
        } else if (line.includes('Serial Number:')) {
            certData.serialNumber = line.split('Serial Number:')[1].trim();
        }
    });
    
    return certData;
}

// Verify certificate on blockchain
async function verifyCertificateOnChain(certData) {
    try {
        // Here you would implement the actual blockchain verification
        // For now, we'll simulate it with some basic checks
        const now = new Date();
        const validTo = new Date(certData.validTo);
        
        if (now > validTo) {
            throw new Error('Certificate has expired');
        }
        
        // Simulate blockchain verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Math.random() > 0.5; // Simulate random verification result
    } catch (error) {
        throw new Error(`Certificate verification failed: ${error.message}`);
    }
}

// Sign and upload content to IPFS with enhanced features
async function signAndUpload() {
    try {
        const content = document.getElementById('content').value;

        if (!content) {
            throw new Error('Please enter content to sign');
        }

        showLoading('Signing and Uploading Content...', 0);

        // Connect to MetaMask
        if (!window.ethereum) {
            throw new Error('Please install MetaMask to use this feature');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        updateLoadingProgress(30);

        // Sign content
        const signature = await signer.signMessage(content);
        updateLoadingProgress(60);

        // Upload to IPFS (simulated)
        const ipfsHash = await uploadToIPFS(content, signature);
        updateLoadingProgress(100);
        
        updateResultsTable(
            'Content Signing',
            address,
            'Verified',
            ipfsHash
        );

        showStatus(
            'ipfsStatus',
            'Content signed and uploaded successfully!',
            'success'
        );
    } catch (error) {
        showStatus('ipfsStatus', error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Upload content to IPFS (simulated)
async function uploadToIPFS(content, signature) {
    // Simulate IPFS upload
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Qm' + Math.random().toString(36).substring(2, 15);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced form validation with real-time feedback
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('input', function() {
        validateField(this);
    });
    
    element.addEventListener('blur', function() {
        validateField(this);
    });
});

function validateField(field) {
    const value = field.value.trim();
    const feedback = field.nextElementSibling;
    
    if (!value) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'invalid-feedback';
            feedbackDiv.textContent = 'This field is required';
            field.parentNode.appendChild(feedbackDiv);
        }
    } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.remove();
        }
    }
}

// Initialize when page loads
window.addEventListener('load', initWeb3);

// Handle network changes
if (window.ethereum) {
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
    
    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    });
} 