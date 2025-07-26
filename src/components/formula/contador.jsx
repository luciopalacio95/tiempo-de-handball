import { useState, useRef, useEffect, useCallback  } from "react";
import {FormattedMessage, useIntl} from 'react-intl';
import cambio from '../../assets/images/change-2.png';
import achicar from '../../assets/images/achicar.png';
import ampliar from '../../assets/images/ampliar.png';
import editar from '../../assets/images/editar.png';
import play from '../../assets/images/boton-de-play.png';
import pausa from '../../assets/images/boton-de-pausa.png';
import refresh from '../../assets/images/refresh.png';
import sirenaOp1MP3 from '../../assets/audio/airhorn-fx-op1.mp3';
import sirenaOp2MP3 from '../../assets/audio/airhorn-fx-op2.mp3';

export default function Contador(){

    const intl = useIntl();
    const [visitante, setVisitante] = useState(""); 
    const [visitanteGoles, setVisitanteGoles] = useState(0); 
    const [local, setLocal] = useState("");
    const [localGoles, setLocalGoles] = useState(0);
    const [cuentaRegresiva, setCuentaRegresiva] = useState(Number(localStorage.getItem('duracion')) || Number(30 * 60));
    const [activo, setActivo] = useState(false);
    const intervaloRef = useRef(null);

    const [invertido, setInvertido] = useState(false);
    const [isPantallaCompleta, setIsPantallaCompleta] = useState(false);
    const [isEditando, setIsEditando] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('duracion')) {
            localStorage.setItem('duracion', Number(30 * 60));
        }
    }, []);


    const handleContador = () => {
        {!activo && cuentaRegresiva === 1800 && (
        iniciarCuenta()
        )}
        {activo && 
            pausarCuenta()
        }
        {!activo && cuentaRegresiva > 0 && cuentaRegresiva < 1800 && (
            reanudarCuenta()
        )}
    }

    const ejecutarFuncionTecla = useCallback((tecla) => {
        console.log(tecla);
        if(!isEditando){
            if (tecla.toLowerCase() === 'a') {
                invertido ? setLocalGoles(localGoles + 1) : setVisitanteGoles(visitanteGoles + 1);
            }
            if (tecla.toLowerCase() === 'g') {
                invertido ? setVisitanteGoles(visitanteGoles + 1) : setLocalGoles(localGoles + 1);
            }
            if (tecla.toLowerCase() === 't') {
                handleContador();
            } 
        }
    }, [invertido, localGoles, visitanteGoles, isEditando, handleContador]);

    useEffect(() => {
        const manejarTecla = (event) => {
            if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'g' || event.key.toLowerCase() === 't') {
                ejecutarFuncionTecla(event.key);
            }
        };

        window.addEventListener('keydown', manejarTecla);
        return () => window.removeEventListener('keydown', manejarTecla);
    }, [ejecutarFuncionTecla]);

    const iniciarCuenta = () => {
        if (intervaloRef.current) return; // evitar múltiples intervalos

        setActivo(true);
        intervaloRef.current = setInterval(() => {
            setCuentaRegresiva(prev => {
                if (prev <= 1) {
                clearInterval(intervaloRef.current);
                intervaloRef.current = null;
                setActivo(false);
                return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

  const alLlegarACero = () => {
    console.log('⏰ ¡Tiempo agotado! Ejecutando acción...');
    // Colocá acá la acción que querés disparar
     // 🔊 Reproducir sonido
    const audio = new Audio(sirenaOp2MP3); // ruta relativa desde public/
    audio.play().catch((error) => {
        console.warn('No se pudo reproducir el audio:', error);
    });
  };


    const pausarCuenta = () => {
        clearInterval(intervaloRef.current);
        intervaloRef.current = null;
        setActivo(false);
    };

    const reanudarCuenta = () => {
        if (!intervaloRef.current && cuentaRegresiva > 0) {
        setActivo(true);
        intervaloRef.current = setInterval(() => {
            setCuentaRegresiva(prev => {
            if (prev <= 1) {
                clearInterval(intervaloRef.current);
                intervaloRef.current = null;
                setActivo(false);
                alLlegarACero(); // ✅ Ejecutamos función cuando llega a cero
                return 0;
            }
            return prev - 1;
            });
        }, 1000);
        }
    };

    const reiniciarCuenta = () => {
        pausarCuenta();
        setCuentaRegresiva(Number(localStorage.getItem('duracion')));
    }

    const minutos = Math.floor(cuentaRegresiva / 60);
    const segundos = cuentaRegresiva % 60;

    const reset = () => {
        setVisitante("");
        setVisitanteGoles(0);
        setLocal("")
        setLocalGoles(0);
        setInvertido(false)
        pausarCuenta();
        setCuentaRegresiva(Number(localStorage.getItem('duracion')));
    }

    const toggleOrden = () => setInvertido(!invertido);

    function pantallaCompleta() {
        const elemento = document.documentElement; // O cualquier otro: div específico, etc.
        setIsEditando(false);
        if(!isPantallaCompleta) { 
            if (elemento.requestFullscreen) {
                elemento.requestFullscreen();
            } else if (elemento.webkitRequestFullscreen) {
                elemento.webkitRequestFullscreen(); // Safari
            } else if (elemento.msRequestFullscreen) {
                elemento.msRequestFullscreen(); // IE11
            }
            setIsPantallaCompleta(true);
        } else { 
            setIsPantallaCompleta(false);
            document.exitFullscreen();
        }
    }

    return (
        <>  
            <div className="w-full px-[1rem] sm:px-[8rem] flex flex-row items-center justify-end">
                {!isPantallaCompleta &&
                    <button
                        onClick={() => setIsEditando(!isEditando)}
                        disabled={activo === true}
                        className={"max-w-7xl text-white px-4 py-2 rounded mr-4 " + (isEditando ? "bg-[#607D8B]" : "bg-white")}
                        >
                        <img 
                            src={editar}
                            className='img-responsive w-auto h-6 sm:h-6'
                            alt='logo'
                        />
                    </button>
                }  
                <button
                    onClick={pantallaCompleta}
                    className="max-w-7xl bg-white text-white px-4 py-2 rounded"
                    >
                    <img 
                        src={!isPantallaCompleta ? ampliar : achicar}
                        className='img-responsive w-auto h-6 sm:h-6'
                        alt='logo'
                    />
                </button>   
            </div>
            <div className="w-full sm:w-5/6 mt-10 sm:mt-[5rem] flex flex-row items-center justify-between m-auto mb-6">
                {!invertido ? (
                    <div className="basis-[40%]">
                        <input type="text" disabled={!isEditando} name="visitante" autoComplete="off" placeholder={intl.formatMessage({ id: "general.visitante" })} value={visitante} onChange={(e) => setVisitante(e.target.value)} className="bg-[#3b3b3b] uppercase text-center text-white text-base sm:text-4xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100" />
                        <div className="flex mt-2 flex-row items-center justify-between">
                            {isEditando && (
                                <button onClick={() => setVisitanteGoles(visitanteGoles > 0 ? visitanteGoles - 1 : 0)} className="bg-[#E91E63] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> - </button>
                            )}
                            <button onClick={() => setVisitanteGoles(visitanteGoles + 1)} title={intl.formatMessage({ id: "general.botonA" })} className="boton-tip bg-white rounded-xl text-center text-gray-900 mt-6 text-4xl sm:text-8xl font-extrabold focus:ring-blue-500 focus:border-blue-500 block m-auto mx-2 w-24 sm:w-full p-2.5 dark:bg-white">{visitanteGoles}</button>
                            {isEditando && (
                                <button onClick={() => setVisitanteGoles(visitanteGoles + 1)} className="bg-[#03A9F4] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> + </button>
                            )}
                        </div>
                    </div>
                     ) :(
                    <div className="basis-[40%]">
                        <input type="text" disabled={!isEditando} name="local" autoComplete="off" placeholder={intl.formatMessage({ id: "general.local" })} value={local} onChange={(e) => setLocal(e.target.value)} className="bg-[#3b3b3b] uppercase text-center text-white text-base sm:text-4xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100" />
                         <div className="flex mt-2 flex-row items-center justify-between">
                            {isEditando && (
                                <button onClick={() => setLocalGoles(localGoles > 0 ? localGoles - 1 : 0)} className="bg-[#E91E63] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> - </button>
                            )}
                            <button onClick={() => setLocalGoles(localGoles + 1)} title={intl.formatMessage({ id: "general.botonA" })} className="bg-white rounded-xl text-center text-gray-900 mt-6 text-4xl sm:text-8xl font-extrabold focus:ring-blue-500 focus:border-blue-500 block m-auto w-24 mx-2 sm:w-full p-2.5 dark:bg-white">{localGoles}</button>            
                            {isEditando && (
                                <button onClick={() => setLocalGoles(localGoles + 1)} className="bg-[#03A9F4] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> + </button>
                            )}
                        </div>
                    </div>
                )}
                <div className="basis-[20%]">
                    {isEditando && (
                        <button disabled={activo === true} onClick={toggleOrden} className="bg-white d-block rounded-full sm:rounded-xl text-center text-gray-900 sm:mt-6 text-xl font-extrabold focus:ring-blue-500 focus:border-blue-500 block w-auto m-auto p-2 sm:p-2.5 dark:bg-white">
                        <img 
                            src={cambio}
                            className='img-responsive h-8 sm:h-8 m-auto'
                            alt='logo'
                        />
                        </button>
                    )}
                </div>
                {!invertido ? (
                    <div className="basis-[40%]">
                        <input type="text" name="local" disabled={!isEditando} autoComplete="off" placeholder={intl.formatMessage({ id: "general.local" })} value={local} onChange={(e) => setLocal(e.target.value)} className="bg-[#3b3b3b] uppercase text-center text-white text-base sm:text-4xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100" />
                        <div className="flex mt-2 flex-row items-center justify-between">
                            {isEditando && (                            
                                <button onClick={() => setLocalGoles(localGoles > 0 ? localGoles - 1 : 0)} className="bg-[#E91E63] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> - </button>
                            )}
                            <button onClick={() => setLocalGoles(localGoles + 1)} title={intl.formatMessage({ id: "general.botonG" })} className="bg-white rounded-xl text-center text-gray-900 mt-6 text-4xl sm:text-8xl font-extrabold focus:ring-blue-500 focus:border-blue-500 block m-auto w-24 mx-2 sm:w-full p-2.5 dark:bg-white">{localGoles}</button>
                            {isEditando && (
                                <button onClick={() => setLocalGoles(localGoles + 1)} className="bg-[#03A9F4] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> + </button>    
                            )}
                        </div>
                    </div>
                     ) :(
                    <div className="basis-[40%]">
                        <input type="text" name="visitante" disabled={!isEditando} autoComplete="off" placeholder={intl.formatMessage({ id: "general.visitante" })} value={visitante} onChange={(e) => setVisitante(e.target.value)} className="bg-[#3b3b3b] uppercase text-center text-white text-base sm:text-4xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey dark:focus:ring-gray-100 dark:focus:border-gray-100" />
                        <div className="flex mt-2 flex-row items-center justify-between">
                            {isEditando && (
                                <button onClick={() => setVisitanteGoles(visitanteGoles > 0 ? visitanteGoles - 1 : 0)} className="bg-[#E91E63] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> - </button>
                            )}
                            <button onClick={() => setVisitanteGoles(visitanteGoles + 1)} title={intl.formatMessage({ id: "general.botonG" })} className="bg-white rounded-xl text-center text-gray-900 mt-6 text-4xl sm:text-8xl font-extrabold focus:ring-blue-500 focus:border-blue-500 block m-auto w-24 mx-2 sm:w-full p-2.5 dark:bg-white">{visitanteGoles}</button>
                            {isEditando && (
                                <button onClick={() => setVisitanteGoles(visitanteGoles + 1)} className="bg-[#03A9F4] rounded-full text-center text-gray-900 mt-6 text-4xl sm:text-6xl font-extrabold block w-16 sm:w-[7rem] p-2.5"> + </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full px-[8rem] flex flex-col items-center justify-center">
                <h1 id="subTitulo" className="flex flex-row items-center justify-evenly mt-3 mb-1 text-4xl text-center mb-1">
                    <FormattedMessage id="general.tiempo" defaultMessage="Tiempo"/>
                    {((!activo && cuentaRegresiva === 0 || isEditando)) && (
                        <img 
                            src={refresh}
                            onClick={reiniciarCuenta}
                            className='cursor-pointer ml-5 img-responsive w-auto h-12 sm:h-12'
                            alt='logo'
                        />
                    )}
                </h1>
                <div className="mt-6 flex flex-row items-center justify-evenly">
                    <button onClick={()=> handleContador()} disabled={isEditando===true} title={intl.formatMessage({ id: "general.botonT" })} className="rounded-xl text-center text-gray-900 text-4xl sm:text-8xl font-extrabold block w-48 sm:w-96 py-2.5 px-2 sm:px-20 bg-white">
                        {`${minutos.toString().padStart(2, '0')}:${segundos
                        .toString()
                        .padStart(2, '0')}`}
                    </button>
                    <div className="flex flex-row items-center justify-center">
                        
                    </div>
                    {/* <span>
                        {!activo && cuentaRegresiva === 1800 && (
                            <img 
                                src={play}
                                onClick={iniciarCuenta}
                                className='cursor-pointer ml-5 img-responsive w-auto h-12 sm:h-20'
                                alt='logo'
                            />
                        )}
                        {activo && 
                            <img 
                                src={pausa}
                                onClick={pausarCuenta}
                                className='cursor-pointer ml-5 img-responsive w-auto h-12 sm:h-20'
                                alt='logo'
                            />
                        }
                        {!activo && cuentaRegresiva > 0 && cuentaRegresiva < 1800 && (
                            <img 
                                src={play}
                                onClick={reanudarCuenta}
                                className='cursor-pointer ml-5 img-responsive w-auto h-12 sm:h-20'
                                alt='logo'
                            />
                        )}
                    </span> */}
                </div>
            </div>
            <div className="w-full mt-20 sm:mt-10 px-[8rem] flex flex-row items-center justify-start">
                {isEditando && (
                    <button
                        onClick={() => reset()}
                        //disabled={cuentaRegresiva !== 0}
                        className="max-w-7xl bg-white text-black px-4 py-2 rounded"
                        >
                        <FormattedMessage id="general.resetear" defaultMessage="Resetear"/>
                    </button>
                )}
            </div>
        </>

    )
}