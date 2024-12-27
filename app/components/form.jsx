'use client';
import React from 'react';

const Forms = () => {
  return (<>
    <div className="p-6">
      <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
    </div>
    <div className="p-6">

      <h3 className="text-gray-700 text-3xl font-semibold">Forms</h3>

      <div className="mt-4">
        <h4 className="text-gray-600"> </h4>
        <div className="mt-4">
          <div className="w-full bg-white shadow-md rounded-md overflow-hidden border">
            <form>
              <div className="flex justify-between items-center px-5 py-3 text-gray-700 border-b">
                <h3 className="text-sm">Add Category</h3>
                <button type="button">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-5 py-6 bg-gray-200 text-gray-700 border-b">
                <label className="text-xs">Data you want to save </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </span>
                  <input type="text" className="form-input w-full px-12 py-2 appearance-none rounded-md focus:border-indigo-600" />
                </div>
              </div>

              <div className="flex justify-between items-center px-5 py-3">
                <button type="button" className="px-3 py-1 text-gray-700 text-sm rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-500 focus:outline-none">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-gray-600">Forms</h4>
        <div className="mt-4">
          <div className="p-6 bg-white rounded-md shadow-md">
            <h2 className="text-lg text-gray-700 font-semibold capitalize">Account settings</h2>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Forms;
