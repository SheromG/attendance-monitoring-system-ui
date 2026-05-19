import React from 'react'
import { Link } from "react-router-dom";

const Card = (props) => {
    const base = `/${props.role}`;
    return (
        <div className="group bg-white p-6 rounded-xl shadow-custom border-l-4 border-primary relative overflow-hidden">
            <h2 className="text-secondary font-semibold">{props.title}</h2>
            <p className="text-4xl font-bold text-primary mt-2"> {props.data}</p>
            <Link className="hover:text-tertiary" to={`${base}/${props.title}`}>
                <div className="absolute inset-0 bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h1 className="text-xl font-bold">
                        View list of {props.title}
                    </h1>
                </div>
            </Link>
        </div>
    )
}

export default Card