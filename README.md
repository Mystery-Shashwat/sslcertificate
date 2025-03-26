# SSL Certificate Verification on Blockchain

A modern web application that verifies SSL certificates on the blockchain and enables content signing with IPFS integration. This project bridges Web2 SSL certificates with Web3 technology, providing enhanced security and transparency.

## 🌟 Features

- **SSL Certificate Verification**
  - Upload and verify SSL certificates
  - Blockchain-based verification
  - Real-time validation and feedback
  - Certificate expiration checking

- **IPFS Content Signing**
  - Sign content with blockchain address
  - Upload signed content to IPFS
  - View content on IPFS gateway
  - Copy IPFS links to clipboard

- **Modern UI/UX**
  - Responsive design
  - Real-time feedback
  - Loading animations
  - Interactive elements
  - Network status display

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MetaMask browser extension
- OpenSSL (for testing)

### Installation

1. Clone the repository:


2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
   - Copy `.env.example` to `.env`
   - Update the contract address and ABI in `frontend/app.js`

### Running the Application

1. Start the local server:
```bash
npx http-server frontend
```

2. Open your browser and navigate to:
```
http://localhost:8080
```

3. Connect your MetaMask wallet

## 🧪 Testing

### Setting Up Test Environment

1. Install OpenSSL:
   - Download from [Win64 OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)
   - Run the installer
   - Add OpenSSL to your system PATH

2. Generate test certificate:
```bash
openssl req -x509 -newkey rsa:4096 -keyout test.key -out test.crt -days 365 -nodes -subj "/CN=example.com"
```

### Test Cases

1. **Certificate Verification**
   - Valid certificate test
   - Invalid certificate test
   - Expired certificate test
   - Missing certificate test

2. **IPFS Content Signing**
   - Content signing test
   - IPFS upload test
   - Link copying test

3. **UI/UX Testing**
   - Form validation
   - Loading states
   - Network changes
   - Wallet connection

## 🔧 Technical Details

### Smart Contract
- Solidity version: 0.8.0
- Network: Ethereum (testnet/mainnet)
- Features:
  - Certificate verification
  - Domain mapping
  - IPFS hash storage

### Frontend
- HTML5
- CSS3 with modern features
- JavaScript (ES6+)
- Web3.js integration
- IPFS integration

### Security Features
- Certificate validation
- Blockchain verification
- Content signing
- Secure file handling

## 📝 Usage Guide

### Verifying SSL Certificates

1. Enter the domain name
2. Upload the SSL certificate file (.pem or .crt)
3. Click "Verify Certificate"
4. View the verification results

### Signing Content with IPFS

1. Enter the content to sign
2. Click "Sign & Upload to IPFS"
3. View the IPFS hash
4. Access the content via IPFS gateway

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ethereum](https://ethereum.org/)
- [IPFS](https://ipfs.io/)
- [MetaMask](https://metamask.io/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🔄 Updates

### Version 1.0.0
- Initial release
- Basic certificate verification
- IPFS content signing
- Modern UI implementation

### Version 1.1.0 (Planned)
- Enhanced certificate validation
- Multiple network support
- Advanced IPFS features
- Performance optimizations

## 🔍 Troubleshooting

### Common Issues

1. **MetaMask Connection**
   - Ensure MetaMask is installed
   - Check network connection
   - Verify account permissions

2. **Certificate Verification**
   - Check certificate format
   - Verify domain name
   - Ensure certificate is valid

3. **IPFS Upload**
   - Check network connection
   - Verify content format
   - Ensure sufficient gas fees

## 📚 Resources

- [Ethereum Documentation](https://ethereum.org/docs/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
