# Moltiverse Token Deployment Guide

This script deploys the Moltiverse ($MV) token on nad.fun bonding curve.

## Prerequisites

1. **Monad RPC**: Configure in `.env.local`
   ```env
   NEXT_PUBLIC_MONAD_RPC=https://monad-testnet.drpc.org
   ```

2. **Nad.fun API Key** (Optional but recommended)
   - Visit: https://dev-api.nad.fun/auth/nonce
   - Follow authentication flow in skill.md
   - Or proceed without (10 req/min limit)

3. **Wallet with MON** on Monad testnet
   - Use WalletConnect or MetaMask with Monad network

## Deployment Steps

### Step 1: Generate Token Image (Optional)

If you want a custom logo:

```bash
# Create a simple 200x200 PNG with gradient
# Or use the default Moltiverse logo
IMAGE=moltiverse-logo.png
```

### Step 2: Upload Image

```bash
curl -X POST https://dev-api.nad.fun/agent/token/image \
  -H "Content-Type: image/png" \
  --data-binary @"$IMAGE" \
  | jq -r '.image_uri, .is_nsfw'
```

### Step 3: Create Metadata

```bash
METADATA_RESPONSE=$(curl -s -X POST https://dev-api.nad.fun/agent/token/metadata \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $NAD_API_KEY" \
  -d '{
    "image_uri": "'$IMAGE_URI'",
    "name": "Moltiverse",
    "symbol": "MV",
    "description": "The Moltiverse ecosystem token - explore, play games, and earn rewards together",
    "website": "https://moltiverse-final-snel.vercel.app"
  }')

METADATA_URI=$(echo $METADATA_RESPONSE | jq -r '.metadata_uri')
```

### Step 4: Mine Salt for Vanity Address

```bash
SALT_RESPONSE=$(curl -s -X POST https://dev-api.nad.fun/agent/salt \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $NAD_API_KEY" \
  -d '{
    "creator": "'$WALLET_ADDRESS'",
    "name": "Moltiverse",
    "symbol": "MV",
    "metadata_uri": "'$METADATA_URI'"
  }')

SALT=$(echo $SALT_RESPONSE | jq -r '.salt')
PREDICTED_ADDRESS=$(echo $SALT_RESPONSE | jq -r '.address')
echo "Salt: $SALT"
echo "Predicted Address: $PREDICTED_ADDRESS"
```

### Step 5: Deploy Token (Final!)

```bash
# Get deploy fee
FEE_RESPONSE=$(curl -s -X POST https://dev-api.nad.fun/curve/fee \
  -H "Content-Type: application/json" \
  -d '{"contract": "0x6F6B8F1a20703309951a5127c45B49b1CD981A22"}')

DEPLOY_FEE=$(echo $FEE_RESPONSE | jq -r '.fee')
DEPLOY_FEE_DECIMAL=$(echo "scale=18; $DEPLOY_FEE / 1" | bc)

# Deploy (via viem)
cast send \
  --rpc-url https://monad-testnet.drpc.org \
  --private-key $PRIVATE_KEY \
  --to 0x6F6B8F1a20703309951a5127c45B49b1CD981A22 \
  --value ${DEPLOY_FEE_DECIMAL}MON \
  --data "$(cast calldata 'create(string,string,bytes32,uint256,uint256,address,address)' \
    'Moltiverse' 'MV' '$METADATA_URI' 0x000000000000000000000000000000000000000000000001 '$SALT' 0x000000000000000000000000000000000000000000000000 '0x0000000000000000000000000000000000000000000000000' \
  --legacy
```

### Step 6: Get Token Address

Monitor transaction to get the `CurveCreate` event log. Parse for `token` field.

```bash
TOKEN_ADDRESS=0x...
echo "Token deployed to: $TOKEN_ADDRESS"
```

### Step 7: Update Moltiverse Frontend

Update `/src/services/token.ts` with the deployed token address:

```typescript
export const MOLTIVERSE_TOKEN = "0x..." as `0x${string}`;
```

### Step 8: Deploy to Vercel

```bash
npm run build
vercel --prod
```

## Alternative: Use Existing Token

If you don't want to deploy a new token, you can use an existing one:

1. Find a token on nad.fun or another platform
2. Update the token address in the codebase
3. Deploy the frontend

## Quick Deployment (No Token Creation)

If you want to skip token creation and just deploy the demo:

```bash
# Build and deploy
npm run build
vercel --prod

# The frontend will work with a placeholder token
```

## Verification

After deployment:

1. Check token on nad.fun: https://dev-api.nad.fun/curve/0x...
2. Verify on Monad explorer: https://testnet.monadexplorer.com
3. Test the frontend at https://moltiverse-final-snel.vercel.app

## Troubleshooting

- **Insufficient MON**: Get testnet MON from faucet
- **Gas estimation**: Use `cast estimate` before sending
- **Timeout**: Increase deadline in transaction
- **Invalid metadata**: Check image URI is valid
