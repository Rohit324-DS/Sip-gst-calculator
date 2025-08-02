import React, { useState } from 'react';
import { Calculator, Receipt, Plus, Minus, ArrowLeft, Info, DollarSign, Percent } from 'lucide-react';

interface GSTCalculatorProps {
  onBack?: () => void;
}

function GSTCalculator({ onBack }: GSTCalculatorProps) {
  const [amount, setAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<string>('18');
  const [calculationType, setCalculationType] = useState<'add' | 'remove'>('add');
  const [results, setResults] = useState<{
    gstAmount: number;
    netAmount: number;
    originalAmount: number;
  } | null>(null);

  const gstRateOptions = [
    { value: '0', label: '0% (Exempt)' },
    { value: '5', label: '5% (Essential goods)' },
    { value: '12', label: '12% (Standard goods)' },
    { value: '18', label: '18% (Most goods)' },
    { value: '28', label: '28% (Luxury goods)' },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateGST = () => {
    const inputAmount = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (!inputAmount || inputAmount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    if (rate < 0) {
      alert('Please select a valid GST rate');
      return;
    }

    let gstAmount: number;
    let netAmount: number;
    let originalAmount: number;

    if (calculationType === 'add') {
      // Add GST to amount
      originalAmount = inputAmount;
      gstAmount = (inputAmount * rate) / 100;
      netAmount = inputAmount + gstAmount;
    } else {
      // Remove GST from amount (amount is GST-inclusive)
      netAmount = inputAmount;
      originalAmount = (inputAmount * 100) / (100 + rate);
      gstAmount = inputAmount - originalAmount;
    }

    setResults({
      gstAmount,
      netAmount: calculationType === 'add' ? netAmount : originalAmount,
      originalAmount: calculationType === 'add' ? originalAmount : netAmount,
    });
  };

  const resetCalculator = () => {
    setAmount('');
    setGstRate('18');
    setCalculationType('add');
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">GST Calculator</h1>
            <p className="text-gray-600">Calculate Goods and Services Tax</p>
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                Amount (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 10000"
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg"
                />
              </div>
            </div>

            {/* GST Rate Selection */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Percent className="w-4 h-4 mr-2 text-blue-600" />
                GST Rate (%)
              </label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg bg-white"
              >
                {gstRateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculation Type Toggle */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Calculator className="w-4 h-4 mr-2 text-purple-600" />
                Calculation Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCalculationType('add')}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    calculationType === 'add'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-medium">Add GST</span>
                </button>
                <button
                  onClick={() => setCalculationType('remove')}
                  className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                    calculationType === 'remove'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  <span className="font-medium">Remove GST</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={calculateGST}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Receipt className="w-5 h-5 inline-block mr-2" />
                Calculate GST
              </button>
              {results && (
                <button
                  onClick={resetCalculator}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Display */}
        {results && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">GST Calculation Results</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4">
              {/* Original/Base Amount */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-700">
                      {calculationType === 'add' ? 'Original Amount' : 'Base Amount (Excl. GST)'}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(results.netAmount)}
                  </span>
                </div>
              </div>

              {/* GST Amount */}
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Percent className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="font-semibold text-gray-700">
                      GST Amount ({gstRate}%)
                    </span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">
                    {formatCurrency(results.gstAmount)}
                  </span>
                </div>
              </div>

              {/* Final Amount */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Receipt className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-700">
                      {calculationType === 'add' ? 'Total Amount (Incl. GST)' : 'GST-Inclusive Amount'}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.originalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Breakdown Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">Calculation Breakdown:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {calculationType === 'add' ? (
                  <>
                    <p>• Base Amount: {formatCurrency(results.netAmount)}</p>
                    <p>• GST ({gstRate}%): {formatCurrency(results.gstAmount)}</p>
                    <p>• <strong>Total: {formatCurrency(results.originalAmount)}</strong></p>
                  </>
                ) : (
                  <>
                    <p>• GST-Inclusive Amount: {formatCurrency(results.originalAmount)}</p>
                    <p>• GST ({gstRate}%): {formatCurrency(results.gstAmount)}</p>
                    <p>• <strong>Base Amount: {formatCurrency(results.netAmount)}</strong></p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Note:</span> GST is calculated as per selected rate. 
                Actual values may vary based on applicable tax rules, exemptions, and current regulations. 
                Please consult with a tax professional for accurate tax calculations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default GSTCalculator;