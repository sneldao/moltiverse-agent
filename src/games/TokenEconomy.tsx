// Token Economy Interface for Moltiverse
// Buy/sell $MV tokens, view portfolio

'use client';

import { useState } from 'react';

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  supply: number;
  holders: number;
  bondingCurve: boolean;
}

interface Portfolio {
  mvBalance: number;
  usdcValue: number;
  totalValue: number;
  dailyChange: number;
}

export function TokenEconomy() {
  const [tokenInfo] = useState<TokenInfo>({
    address: '0xMV...',
    name: 'Moltiverse',
    symbol: '$MV',
    price: 0.05,
    marketCap: 50000,
    supply: 1000000,
    holders: 247,
    bondingCurve: true,
  });

  const [portfolio] = useState<Portfolio>({
    mvBalance: 15000,
    usdcValue: 750,
    totalValue: 750,
    dailyChange: 5.2,
  });

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  const calculateBuyOutput = (usdc: number) => {
    return (usdc / tokenInfo.price).toFixed(2);
  };

  const calculateSellOutput = (mv: number) => {
    return (mv * tokenInfo.price).toFixed(2);
  };

  return (
    <div className="token-economy">
      <div className="economy-header">
        <span className="icon">🪙</span>
        <h3>Token Economy</h3>
        <span className="badge bonding">On Bonding Curve</span>
      </div>

      {/* Token Stats */}
      <div className="token-stats">
        <div className="stat-main">
          <span className="token-price">${tokenInfo.price.toFixed(4)}</span>
          <span className="price-change positive">+5.2%</span>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">${tokenInfo.marketCap.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Supply</span>
            <span className="stat-value">{(tokenInfo.supply / 1000).toFixed(0)}K</span>
          </div>
          <div className="stat">
            <span className="stat-label">Holders</span>
            <span className="stat-value">{tokenInfo.holders}</span>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="portfolio-card">
        <h4>Your Portfolio</h4>
        <div className="portfolio-main">
          <div className="portfolio-balance">
            <span className="balance-label">Total Value</span>
            <span className="balance-value">${portfolio.totalValue.toLocaleString()}</span>
            <span className={`balance-change ${portfolio.dailyChange >= 0 ? 'positive' : 'negative'}`}>
              {portfolio.dailyChange >= 0 ? '+' : ''}{portfolio.dailyChange}% today
            </span>
          </div>
          <div className="portfolio-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-icon">🪙</span>
              <span className="breakdown-value">{portfolio.mvBalance.toLocaleString()} $MV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Section */}
      <div className="trade-section">
        <div className="trade-tabs">
          <button className="trade-tab active">Buy</button>
          <button className="trade-tab">Sell</button>
        </div>

        {/* Buy Panel */}
        <div className="trade-panel">
          <div className="trade-input-group">
            <label>Pay with USDC</label>
            <div className="input-with-max">
              <input
                type="number"
                placeholder="0.00"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
              />
              <button className="max-btn">Max</button>
            </div>
            <span className="input-usd">≈ ${buyAmount || '0.00'}</span>
          </div>
          <div className="trade-arrow">↓</div>
          <div className="trade-input-group">
            <label>Receive $MV</label>
            <div className="output-display">
              <span className="output-value">{buyAmount ? calculateBuyOutput(Number(buyAmount)) : '0'}</span>
              <span className="output-symbol">$MV</span>
            </div>
            <span className="input-rate">Rate: 1 $MV = ${tokenInfo.price.toFixed(4)}</span>
          </div>
          <button className="trade-btn buy">
            Buy ${tokenInfo.symbol}
          </button>
        </div>
      </div>

      {/* Price Chart */}
      <div className="price-chart">
        <h4>Price History</h4>
        <div className="chart-placeholder">
          <div className="chart-line">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none">
              <path
                d="M0,80 L20,75 L40,70 L60,65 L80,68 L100,60 L120,55 L140,50 L160,45 L180,48 L200,40 L220,35 L240,30 L260,25 L280,20 L300,15"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="chart-labels">
            <span>7d</span>
            <span>5d</span>
            <span>3d</span>
            <span>1d</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      {/* Bonding Curve Info */}
      <div className="bonding-info">
        <div className="info-header">
          <span className="info-icon">📈</span>
          <span className="info-title">Bonding Curve</span>
        </div>
        <p>
          $MV is currently on a bonding curve. When market cap reaches $100K,
          liquidity will be deposited to Raydium and the curve will be bypassed.
        </p>
        <div className="curve-progress">
          <div className="curve-bar">
            <div className="curve-fill" style={{ width: '50%' }} />
          </div>
          <span className="curve-label">50% to Raydium</span>
        </div>
      </div>

      <style jsx>{`
        .token-economy {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
        }
        .economy-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .economy-header .icon {
          font-size: 24px;
        }
        .economy-header h3 {
          margin: 0;
          font-size: 18px;
          flex: 1;
        }
        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge.bonding {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        .token-stats {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .stat-main {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 16px;
        }
        .token-price {
          font-size: 32px;
          font-weight: 700;
          color: #4ade80;
        }
        .price-change {
          font-size: 14px;
          font-weight: 600;
        }
        .price-change.positive {
          color: #4ade80;
        }
        .price-change.negative {
          color: #ef4444;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .stat {
          text-align: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .stat-label {
          display: block;
          font-size: 11px;
          color: #888;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 16px;
          font-weight: 600;
        }
        .portfolio-card {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .portfolio-card h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #888;
        }
        .portfolio-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .balance-label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 4px;
        }
        .balance-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #4ade80;
          margin-bottom: 8px;
        }
        .balance-change {
          font-size: 13px;
          font-weight: 600;
        }
        .balance-change.positive {
          color: #4ade80;
        }
        .balance-change.negative {
          color: #ef4444;
        }
        .portfolio-breakdown {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .breakdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }
        .breakdown-icon {
          font-size: 16px;
        }
        .breakdown-value {
          font-size: 14px;
          font-weight: 600;
        }
        .trade-section {
          margin-bottom: 20px;
        }
        .trade-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .trade-tab {
          flex: 1;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 8px;
          color: #888;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trade-tab.active {
          background: linear-gradient(135deg, #22c554, #16a34a);
          color: white;
        }
        .trade-panel {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .trade-input-group {
          margin-bottom: 16px;
        }
        .trade-input-group label {
          display: block;
          font-size: 12px;
          color: #888;
          margin-bottom: 8px;
        }
        .input-with-max {
          display: flex;
          gap: 8px;
        }
        .input-with-max input {
          flex: 1;
          padding: 14px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: white;
          font-size: 18px;
          outline: none;
        }
        .input-with-max input:focus {
          border-color: #22c554;
        }
        .max-btn {
          padding: 14px 20px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: #888;
          font-size: 12px;
          cursor: pointer;
        }
        .input-usd {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #888;
          margin-top: 6px;
        }
        .output-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 8px;
        }
        .output-value {
          font-size: 24px;
          font-weight: 700;
          color: #4ade80;
        }
        .output-symbol {
          font-size: 14px;
          color: #888;
        }
        .input-rate {
          display: block;
          font-size: 11px;
          color: #888;
          margin-top: 6px;
        }
        .trade-arrow {
          text-align: center;
          font-size: 24px;
          color: #4ade80;
          margin: 12px 0;
        }
        .trade-btn {
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .trade-btn.buy {
          background: linear-gradient(135deg, #22c554, #16a34a);
          color: white;
        }
        .trade-btn:hover {
          transform: scale(1.02);
        }
        .price-chart {
          margin-bottom: 20px;
        }
        .price-chart h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #888;
        }
        .chart-placeholder {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 20px;
        }
        .chart-line {
          height: 80px;
        }
        .chart-line svg {
          width: 100%;
          height: 100%;
        }
        .chart-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 11px;
          color: #888;
        }
        .bonding-info {
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          padding: 16px;
        }
        .info-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .info-icon {
          font-size: 20px;
        }
        .info-title {
          font-weight: 600;
          font-size: 14px;
        }
        .bonding-info p {
          font-size: 13px;
          color: #888;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }
        .curve-progress {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .curve-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .curve-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa);
          border-radius: 4px;
        }
        .curve-label {
          font-size: 12px;
          color: #a78bfa;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
