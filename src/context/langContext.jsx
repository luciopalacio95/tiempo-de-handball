import React, {useState, useEffect} from 'react';
import {IntlProvider} from 'react-intl';
import mensajesES from '../lang/es.json';
import mensajesEN from '../lang/en.json';

export const langContext = React.createContext();
export const LangProvider = ({children}) => {
    const [mensajes, setMensajes] = useState(mensajesES);
    const [locale, setLocale] = useState('es');
    
    useEffect(() => {
        if(!localStorage.getItem('LanguageDef') || localStorage.getItem('LanguageDef') == null || localStorage.getItem('LanguageDef').length === 0){
            localStorage.setItem('LanguageDef', 'es');
        }else{
            setLenguaje(localStorage.getItem('LanguageDef'));
        }
    }, []);

    const setLenguaje = (lenguaje) => {
        switch(lenguaje){
            case "es":
                setMensajes(mensajesES)
                setLocale("es")
            break;
            case "en":
                setMensajes(mensajesEN)
                setLocale("en")
            break;
            default:
                setMensajes(mensajesES)
                setLocale("es")
            break;
        }
    }

    return(
        <langContext.Provider value={{setLenguaje: setLenguaje}}>
            <IntlProvider locale={locale} defaultLocale="es" messages={mensajes}>
                {children}
            </IntlProvider>
        </langContext.Provider>
     );
}
