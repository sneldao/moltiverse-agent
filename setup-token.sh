#!/bin/bash
# Moltiverse Token Deployment Helper
# Run this script to set up token integration

set -e

echo "=== Moltiverse Token Deployment Setup ==="
echo ""

echo "1. Getting Monad Testnet Wallet Address"
echo "   Visit: https://monadexplorer.com or use WalletConnect"
echo "   Network: Monad Testnet (Chain ID: 10143)"
echo "   RPC: https://testnet.rpc.monad.xyz"
echo ""

echo "2. Deploying Token on nad.fun"
echo "   API: https://dev-api.nad.fun"
echo "   See: DEPLOY_TOKEN.md for full deployment guide"
echo ""

read -p "Press Enter after you've deployed the token..."

echo ""
echo "3. Update Frontend Configuration"
echo "   Create file: src/services/token-deployed.ts"
echo "   Add content:"
echo ""
cat << 'EOF'
// Auto-generated from token deployment
export const MOLTIVERSE_TOKEN_CONFIG = {
  tokenAddress: "YOUR_TOKEN_ADDRESS_HERE",
  tokenName: "Moltiverse",
  tokenSymbol: "MV",
  deployedAt: new Date().toISOString(),
};
EOF
echo ""
echo "   Then update src/services/token.ts to import from token-deployed.ts"
echo ""

echo "4. Deploy to Vercel"
echo "   npm run build"
echo "   vercel --prod"
echo ""
echo "=== Setup Complete ==="
