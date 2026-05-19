import React, {useState} from 'react'

const Button = (props) => {
    return (
        <button 
            className={`${props.isRed ? 'bg-red-500 hover:bg-red-700' : 'bg-secondary hover:bg-primary'}  text-white px-5 py-2 rounded-md  transition`}
            onClick={props.onClick ? props.onClick : () => props.function(!props.value)}
        >
            {props.title}
        </button>
    )
}

export default Button