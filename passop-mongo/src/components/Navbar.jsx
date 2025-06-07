import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white w-full">
      <div className="container mx-auto flex justify-between items-center px-4 py-4 h-16">
        <div className="font-bold text-white text-2xl">
          <span className="text-green-500">&lt;</span>
          <span>Secure</span>
          <span className="text-green-500">LY/&gt;</span>
        </div>

        <button className="text-white bg-green-700 rounded-full flex items-center ring-1 ring-white px-3 py-1">
          <img className="invert w-6 mr-2" src="/icons/github.svg" alt="github logo" />
          <span className="font-bold">GitHub</span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar




