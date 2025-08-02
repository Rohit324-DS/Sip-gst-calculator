import React, { useState } from 'react';
import { Calculator, TrendingUp, PiggyBank, DollarSign, Clock, Percent, BarChart3, AlertCircle, Receipt, Grid3X3 } from 'lucide-react';
import GSTCalculator from './GSTCalculator';

type CalculatorType = 'sip' | 'gst';

function App() {
  const [currentCalculator, setCurrentCalculator] = useState<CalculatorType>('sip');
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [returnRate, setReturnRate] = useState<string>('');
  const [results, setResults] = useState<{
    totalInvested: number;
    estimatedReturns: number;
    maturityAmount: number;
  } | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSIP = () => {
    const P = parseFloat(monthlyInvestment);
    const years = parseFloat(duration);
    const annualRate = parseFloat(returnRate);

    if (!P || !years || !annualRate || P <= 0 || years <= 0 || annualRate <= 0) {
      alert('Please enter valid positive values for all fields');
      return;
    }

    const r = annualRate / 12 / 100; // Monthly rate
    const n = years * 12; // Total months

    // SIP Formula: M = P × [ ((1 + r)^n - 1) / r ] × (1 + r)
    const maturityAmount = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const totalInvested = P * n;
    const estimatedReturns = maturityAmount - totalInvested;

    setResults({
      totalInvested,
      estimatedReturns,
      maturityAmount,
    });
  };

  const resetCalculator = () => {
    setMonthlyInvestment('');
    setDuration('');
    setReturnRate('');
    setResults(null);
  };

  const calculators = [
    {
      id: 'sip' as CalculatorType,
      name: 'SIP Calculator',
      description: 'Calculate Systematic Investment Plan returns',
      icon: TrendingUp,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100'
    },
    {
      id: 'gst' as CalculatorType,
      name: 'GST Calculator',
      description: 'Calculate Goods and Services Tax',
      icon: Receipt,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100'
    }
  ];

  if (currentCalculator === 'gst') {
    return <GSTCalculator onBack={() => setCurrentCalculator('sip')} />;
  }

  // Show calculator selection if no specific calculator is selected
  if (currentCalculator !== 'sip') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mb-4">
              <Grid3X3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Finance Calculators</h1>
            <p className="text-gray-600">Choose a calculator to get started</p>
          </div>

          <div className="space-y-4">
            {calculators.map((calc) => {
              const IconComponent = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => setCurrentCalculator(calc.id)}
                  className="w-full bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${calc.color} rounded-full mr-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-gray-800">{calc.name}</h3>
                      <p className="text-gray-600 text-sm">{calc.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    if (!results) return 0;
    return (results.estimatedReturns / results.maturityAmount) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setCurrentCalculator('sip')}
            className="mr-4 p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
          >
            <Grid3X3 className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">SIP Calculator</h1>
            <p className="text-gray-600">Calculate your Systematic Investment Plan returns</p>
          </div>
          <button
            onClick={() => setCurrentCalculator('gst')}
            className="ml-4 p-2 rounded-full hover:bg-white/50 transition-colors duration-200"
          >
            <Receipt className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/50 rounded-xl p-3 mb-6">
          <div className="flex justify-center space-x-2">
            {calculators.map((calc) => {
              const IconComponent = calc.icon;
              return (
                <button
                  key={calc.id}
                  onClick={() => setCurrentCalculator(calc.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentCalculator === calc.id
                      ? `bg-gradient-to-r ${calc.color} text-white shadow-md`
                      : 'text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{calc.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Remove the old header section since we replaced it above */}
        <div className="hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SIP Calculator</h1>
          <p className="text-gray-600">Calculate your Systematic Investment Plan returns</p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="space-y-6">
            {/* Monthly Investment */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <PiggyBank className="w-4 h-4 mr-2 text-blue-600" />
                Monthly Investment (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
                />
              </div>
            </div>

            {/* Investment Duration */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-green-600" />
                Investment Duration (Years)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg"
                />
              </div>
            </div>

            {/* Expected Return Rate */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Percent className="w-4 h-4 mr-2 text-purple-600" />
                Expected Annual Return Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={returnRate}
                  onChange={(e) => setReturnRate(e.target.value)}
                  placeholder="e.g., 12"
                  step="0.1"
                  className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={calculateSIP}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <TrendingUp className="w-5 h-5 inline-block mr-2" />
                Calculate SIP
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Investment Results</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto"></div>
            </div>

            <div className="space-y-4">
              {/* Total Invested */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-gray-700">Total Invested</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">
                    {formatCurrency(results.totalInvested)}
                  </span>
                </div>
              </div>

              {/* Estimated Returns */}
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-gray-700">Estimated Returns</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(results.estimatedReturns)}
                  </span>
                </div>
              </div>

              {/* Maturity Amount */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-gray-700">Maturity Amount</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {formatCurrency(results.maturityAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Visualization */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Investment Breakdown</span>
                <span className="text-sm text-gray-500">
                  {getProgressPercentage().toFixed(1)}% Returns
                </span>
              </div>
              <div className="relative h-4 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(results.totalInvested / results.maturityAmount) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-blue-600 font-medium">Principal</span>
                <span className="text-xs text-green-600 font-medium">Returns</span>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Disclaimer:</span> This is an estimate based on the provided inputs. 
                Actual returns may vary depending on market conditions, fund performance, and other factors. 
                Please consult with a financial advisor for personalized investment advice.
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

export default App;