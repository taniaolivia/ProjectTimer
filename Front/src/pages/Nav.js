import  React , { useState } from 'react';
import { Link } from 'react-router-dom';

const Nav = () =>{
    
    const home = <img className="mr-3"src="/images/home.png" width={30} height={30} ></img>
    const [dropdown,setDropdown] = useState(false);
    
    return (
        <nav className="px-2 bg-gray-silver text-white w-full h-[50px]">
            <div className="grid grid-cols-5 items-center  w-full h-full">
                <div className='col-start-1 col-span-2 ml-2 flex flex-row gap-4'>
                    <div><Link className="" to="/">{home} </Link></div>
                </div>
                <div className='col-start-3 flex flex-row gap-4'>
                    <div>Logo</div>
                    <div>Site name</div>
                </div>
                <div className='col-start-5 relative flex justify-end mr-4'>
                <div><button onClick={()=>setDropdown(!dropdown)}>▼ Connection</button></div>
                {dropdown && <div className='absolute top-8 rigth-0 flex flex-col bg-gray-silver z-[999] gap-4 p-2 rounded-b-lg'>
                        <div><Link className="" to="/Login">Login</Link></div>
                        <div><Link className="" to="/Register">Register </Link></div>
                    </div>}
                </div>
            </div>
        </nav>

    )
}

export default Nav;