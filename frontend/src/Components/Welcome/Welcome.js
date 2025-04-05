import React from 'react';

function Welcome() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Land Auction</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Find and bid on premium land properties</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">How it works</h2>
              <div className="mt-2 text-sm text-gray-500">
                <p>Browse available land auctions, place bids on properties you're interested in, and track your bidding history all in one place.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Real-time bidding updates</li>
                  <li>Secure payment processing</li>
                  <li>Verified property listings</li>
                  <li>Expert support throughout the process</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900">Featured Auctions</h2>
              <div className="mt-2 text-sm text-gray-500">
                <p>Discover our current featured land properties up for auction. New listings added regularly!</p>
                <div className="mt-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Browse Auctions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-5 sm:px-6">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-500">Get started today by creating an account or browsing available properties.</p>
            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;