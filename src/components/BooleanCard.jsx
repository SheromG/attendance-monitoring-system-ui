import React from 'react'

const BooleanCard = (props) => {
    return (
        <div 
            className={`group ${!props.value ? 'bg-white':'bg-primary'} p-6 rounded-xl shadow-custom border-l-4 border-primary relative overflow-hidden hover:bg-primary hover:text-white`}
            onClick={props.onClick}
        >
            {
                props.data ? (
                    <>
                        <h2 className={`${!props.value ? 'text-secondary':'text-white'} font-semibold group-hover:text-white `}>{props.title}</h2>
                        <p className={`${!props.value ? 'text-primary':'text-white'} text-4xl font-bold  mt-2 group-hover:text-white`}> {props.data}</p>
                    </>
                ):(
                    <div className="flex items-center justify-center h-full">
                        <h1 className={`${!props.value ? 'text-secondary' : 'text-white'} font-semibold group-hover:text-white text-3xl text-center`}>
                            {props.title}
                        </h1>
                    </div>
                )
            }
        </div>
    )
}

export default BooleanCard