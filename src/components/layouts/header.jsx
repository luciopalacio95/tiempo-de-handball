import { useState, useContext } from 'react';
import logo from '../../assets/images/handball_pictogram_blanco.png';
import flagArg from '../../assets/images/flag-arg.png';
import flagEEUU from '../../assets/images/flag-eeuu.png';

import { langContext } from '../../context/langContext';

export default function Header() {
    const [currentLaguange, setCurrentLaguange] = useState(localStorage.getItem('LanguageDef'));
    const idioma = useContext(langContext);

    const setLang = (valor) => {
        localStorage.setItem('LanguageDef', valor);
        setCurrentLaguange(valor);
        idioma.setLenguaje(valor);
    }

  return (
    <header className="w-full z-50 bg-[#00000080] ... top-0 border-solid border-slate-100 border-b">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8">
            <div
                className="flex items-center flex-row space-x-4 -m-1.5 p-1.5 cursor-pointer"
            >
                <img 
                    src={logo}
                    className='img-responsive w-auto h-8 sm:h-10'
                    alt='logo'
                />
                <span className="text-white text-xl sm:text-lg">Tiempo de Handball</span>
            </div>
            <div>
                {currentLaguange === "en" ?
                    <div onClick={() => setLang('es')} className='flex items-center cursor-pointer justify-between space-x-2'>
                        <span className='font-regular text-xl sm:text-lg'>EN</span>
                        <img 
                            src={flagEEUU}
                            className='img-responsive w-auto h-7 sm:h-8'
                            alt='logo'
                        />
                    </div>
                :
                    <div onClick={() => setLang('en')} className='flex items-center cursor-pointer justify-between space-x-2'>
                        <span className='font-regular text-xl sm:text-lg'>ES</span>
                        <img 
                            src={flagArg}
                            className='img-responsive w-auto h-7 sm:h-8'
                            alt='logo'
                        />
                    </div>
                }
                
            </div>
        </nav>
    </header>
  )
}
