import React from "react";
import "./styles.css"

function Button({text, onClick}){
    return <div className={"blue" ? "btn" : "btn btn-blue"} onClick={onClick}>
        {text}
    </div>
}

export default Button;