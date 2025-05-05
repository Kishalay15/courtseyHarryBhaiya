import React from 'react'

const Navbar = () => {
    return (
        <nav className='flex justify-between bg-violet-800 text-white py-2'>
            <div className="logo">
                <span className='font-bold text-xl mx-8'>TO DO</span>
            </div>
            <ul className='flex gap-7 mx-8'>
                <li className='cursor-pointer hover:font-bold'>Home</li>
                <li className='cursor-pointer hover:font-bold'>Your Tasks</li>
            </ul>
        </nav>
    )
}

export default Navbar
