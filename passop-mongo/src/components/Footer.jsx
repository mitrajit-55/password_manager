import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white flex flex-col justify-center items-center w-full py-4">
      <div className="font-bold text-white text-2xl mb-2">
        <span className="text-green-500">&lt;</span>
        <span>Secure</span>
        <span className="text-green-500">LY/&gt;</span>
      </div>
      <div className="flex items-center">
        Created with
        <img className="w-6 mx-2" src="/icons/heart.png" alt="heart icon" />
        by Mitrajit Ghosh
      </div>
    </footer>
  )
}

export default Footer




